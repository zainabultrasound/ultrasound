// ============================================================
// SUPABASE CLIENT & DATABASE OPERATIONS
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import CONFIG from '../core/config.js';

export const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ---- PATIENTS ----

export async function upsertPatient(patientData) {
  const { data, error } = await supabase
    .from('patients')
    .upsert({
      patient_code: patientData.patient_code,
      name: patientData.name,
      age: patientData.age || null,
      gender: patientData.gender || null,
      phone: patientData.phone || null
    }, { onConflict: 'patient_code' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getPatientByCode(code) {
  const { data } = await supabase
    .from('patients')
    .select('*')
    .eq('patient_code', code)
    .single();
  return data;
}

// ---- REPORTS ----

export async function createReport(reportData) {
  const { data, error } = await supabase
    .from('reports')
    .insert(reportData)
    .select('id, report_number')
    .single();
  if (error) throw error;
  return data;
}

export async function updateReport(id, updates) {
  const { error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function getReportById(id) {
  const { data, error } = await supabase
    .from('reports')
    .select('*, patients(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getReportByNumber(reportNumber) {
  const { data, error } = await supabase
    .from('reports')
    .select('*, patients(*)')
    .eq('report_number', reportNumber)
    .single();
  if (error) throw error;
  return data;
}

export async function getReportsList(limit = 50, offset = 0) {
  const { data, error, count } = await supabase
    .from('reports')
    .select('*, patients(name, patient_code)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { data, count };
}

export async function searchReports(query) {
  if (!query || !query.trim()) {
    // fallback: return recent reports (consistent with original behaviour)
    const { data } = await supabase
      .from('reports')
      .select('*, patients!inner(name, patient_code)')
      .order('created_at', { ascending: false })
      .limit(50);
    return data || [];
  }

  const q = query.trim();

  // Search patients table
  const { data: matchedPatients, error: patientErr } = await supabase
    .from('patients')
    .select('id')
    .or(`name.ilike.%${q}%,patient_code.ilike.%${q}%`);
  if (patientErr) throw patientErr;

  const patientIds = (matchedPatients || []).map(p => p.id);

  // Search reports table directly for report_number or report_type
  const { data: matchedReportsDirect, error: reportErr } = await supabase
    .from('reports')
    .select('id')
    .or(`report_number.ilike.%${q}%,report_type.ilike.%${q}%`);
  if (reportErr) throw reportErr;

  // Combine unique report IDs
  const directIds = (matchedReportsDirect || []).map(r => r.id);
  const allReportIds = [...new Set([...patientIds.length ? [] : [], ...directIds])]; // actually we need the report ids from patient matches, not patient ids

  // If no patient matches, we only have direct matches; still we need to fetch reports. 
  // For patient matches we need reports that have patient_id in patientIds.
  let combinedIds = directIds;

  if (patientIds.length > 0) {
    const { data: reportsByPatient, error: reportPatientErr } = await supabase
      .from('reports')
      .select('id')
      .in('patient_id', patientIds);
    if (reportPatientErr) throw reportPatientErr;
    const patientReportIds = (reportsByPatient || []).map(r => r.id);
    combinedIds = [...new Set([...directIds, ...patientReportIds])];
  }

  // If no IDs, return empty array
  if (combinedIds.length === 0) {
    return [];
  }

  // Fetch full reports with patient info
  const { data: fullReports, error: fullErr } = await supabase
    .from('reports')
    .select('*, patients!inner(name, patient_code)')
    .in('id', combinedIds)
    .order('created_at', { ascending: false })
    .limit(50);
  if (fullErr) throw fullErr;

  return fullReports || [];
}

// ---- REPORT NUMBER ----

export async function generateReportNumber() {
  const { data, error } = await supabase.rpc('generate_report_number');
  if (error) throw error;
  return data;
}

// ---- SETTINGS ----

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  const settings = {};
  data.forEach(row => { settings[row.key] = row.value; });
  return settings;
}

// ---- STORAGE ----

export async function uploadPDF(filePath, blob) {
  const { data, error } = await supabase.storage
    .from(CONFIG.storageBucket)
    .upload(filePath, blob, {
      contentType: 'application/pdf',
      upsert: true
    });
  if (error) throw error;
  return data;
}

export function getPDFPublicUrl(filePath) {
  const { data } = supabase.storage
    .from(CONFIG.storageBucket)
    .getPublicUrl(filePath);
  return data.publicUrl;
}