// ============================================================
// SAFE REPORT NUMBER GENERATION
// ============================================================

import { generateReportNumber as dbGenerate } from './supabase.js';
import { isAppOnline } from './sync.js';

/**
 * Generate a fallback report number for offline use.
 * Format: USG-YYYYMMDD-XXX (XXX = sequential within day from localStorage)
 */
function offlineFallbackNumber() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `usg_counter_${today}`;
  let seq = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(seq));
  return `ZUC-${today}-${String(seq).padStart(3, '0')}`;
}

/**
 * Generate a report number. Uses DB function when online, falls back to local counter.
 */
export async function getNextReportNumber() {
  if (isAppOnline()) {
    try {
      return await dbGenerate();
    } catch (err) {
      console.warn('DB report number failed, using offline fallback:', err);
    }
  }
  return offlineFallbackNumber();
}