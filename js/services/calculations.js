// ============================================================
// CALCULATION ENGINE
// Supports auto-calculation and manual override.
// ============================================================

/**
 * Calculate Gestational Age from CRL (Robinson & Fleming)
 * @param {number} crlMm - Crown-Rump Length in mm
 * @returns {string|null} - "Xw Yd" format or null
 */
export function gaFromCRL(crlMm) {
  if (!crlMm || crlMm <= 0 || crlMm > 84) return null;
  const gaDays = Math.pow(crlMm * 1.037, 0.5) * 8.052 + 23.73;
  const totalDays = Math.round(gaDays);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return `${weeks}w ${days}d`;
}

/**
 * Calculate EDD from GA string
 * @param {string} gaString - "Xw Yd"
 * @returns {string} - ISO date string
 */
export function eddFromGA(gaString) {
  const match = String(gaString).match(/(\d+)\s*w\s*(\d+)\s*d/i);
  if (!match) return '';
  const weeks = parseInt(match[1]);
  const days = parseInt(match[2]);
  const gaDays = weeks * 7 + days;
  const edd = new Date();
  edd.setDate(edd.getDate() + (280 - gaDays));
  return edd.toISOString().split('T')[0];
}

/**
 * Hadlock 4-parameter EFW formula
 * @returns {number|null} - Estimated weight in grams
 */
export function efwHadlock(bpd, hc, ac, fl) {
  if (!bpd || !hc || !ac || !fl) return null;
  const log10efw = 1.3596
    - (0.00386 * ac * fl)
    + (0.0064 * hc)
    + (0.00061 * bpd * ac)
    + (0.0424 * ac)
    + (0.174 * fl);
  return Math.round(Math.pow(10, log10efw));
}

/**
 * Calculate GA from BPD
 */
export function gaFromBPD(bpdMm) {
  if (!bpdMm || bpdMm < 20) return null;
  // Simplified: GA(weeks) ≈ BPD(mm) / 2.8 + 4
  const gaWeeks = bpdMm / 2.8 + 4;
  const weeks = Math.floor(gaWeeks);
  const days = Math.round((gaWeeks - weeks) * 7);
  return `${weeks}w ${days}d`;
}

/**
 * Body Surface Area (Mosteller)
 */
export function bsa(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  return Math.sqrt((heightCm * weightKg) / 3600).toFixed(2);
}