// ============================================================
// CENTRAL CONFIGURATION
// All hardcoded values live here. Edit this file for your clinic.
// ============================================================

export const CONFIG = {
  // Supabase
  supabaseUrl: 'https://asultmnprusfbyqcfeoh.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdWx0bW5wcnVzZmJ5cWNmZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjMyNzUsImV4cCI6MjA5MzI5OTI3NX0.L4DNix2xIK5M7H15hY-2B0C96VcD2al0YR2z_V4QP8k',
  storageBucket: 'reports',

  // Clinic Info (fallback - loaded from DB settings)
  clinicName: 'Zainab Zacha Bacha Ultrasound and Medical Center',
  clinicAddress: 'Gali No. 4 , 5, Makkuana, Faisalabad',
  clinicPhone: '+92-3064932006',
  clinicLogo: 'assets/logo.png',

  // Doctor Info
  doctorName: 'Dr. Atta ur Rehman',
  doctorQualification: 'MBBS, MD',
  doctorRegistration: '_________________',
  doctorDesignation: 'Family Physician',

  // App Settings
  autoSaveIntervalSeconds: 60,
  draftExpiryDays: 90,
  itemsPerPage: 20,

  // Report Number Format
  reportNumberPrefix: 'ZUC',
};

export default CONFIG;