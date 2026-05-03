-- ============================================================
-- COMPLETE SCHEMA FOR ULTRASOUND REPORTING SYSTEM
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PATIENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_code TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_code)
);

CREATE INDEX idx_patients_code ON patients(patient_code);
CREATE INDEX idx_patients_name ON patients(name);

-- ============================================================
-- REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    report_type TEXT NOT NULL,
    report_status TEXT NOT NULL DEFAULT 'draft' CHECK (report_status IN ('draft', 'final')),
    draft_data JSONB,
    final_data JSONB,
    pdf_url TEXT,
    finalized_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_patient ON reports(patient_id);
CREATE INDEX idx_reports_number ON reports(report_number);
CREATE INDEX idx_reports_status ON reports(report_status);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_created ON reports(created_at DESC);
CREATE INDEX idx_reports_drafts ON reports(report_status) WHERE report_status = 'draft';

-- ============================================================
-- REPORT COUNTERS (for safe sequential numbering)
-- ============================================================
CREATE TABLE IF NOT EXISTS report_counters (
    date_key TEXT PRIMARY KEY,  -- 'YYYYMMDD'
    last_sequence INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- SETTINGS TABLE (clinic config, doctor info, presets)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('clinic_info', '{"name":"Zainab Zacha Bacha Ultrasound and Medical Center","address":"123 Medical Complex, City","phone":"+92-XXX-XXXXXXX","logo_url":"/assets/logo-placeholder.svg"}'),
    ('doctor_info', '{"name":"Dr. [Name]","qualification":"MBBS, FCPS","registration":"[Reg No]","designation":"Consultant Radiologist"}'),
    ('impression_presets', '["Normal study","Within normal limits","No significant abnormality detected","Correlate clinically","Follow-up recommended"]'),
    ('app_settings', '{"auto_save_interval_seconds":60,"draft_expiry_days":90,"clinic_name":"Zainab Zacha Bacha Ultrasound and Medical Center"}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DRAFT CLEANUP FUNCTION (delete drafts older than 90 days)
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_old_drafts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM reports
    WHERE report_status = 'draft'
      AND updated_at < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SAFE REPORT NUMBER GENERATION FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TEXT AS $$
DECLARE
    today_key TEXT;
    next_seq INTEGER;
    new_number TEXT;
BEGIN
    today_key := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Try to insert a new counter row for today, or increment existing
    INSERT INTO report_counters (date_key, last_sequence)
    VALUES (today_key, 1)
    ON CONFLICT (date_key) DO UPDATE
    SET last_sequence = report_counters.last_sequence + 1
    RETURNING last_sequence INTO next_seq;
    
    new_number := 'USG-' || today_key || '-' || LPAD(next_seq::TEXT, 3, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STORAGE BUCKET FOR PDFs
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS POLICIES (permissive for single-user internal use)
-- ============================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (single-user clinic software)
CREATE POLICY "Allow all on patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on reports" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on report_counters" ON report_counters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Storage policies
CREATE POLICY "Allow all on reports bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'reports')
WITH CHECK (bucket_id = 'reports');