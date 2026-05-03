// GA from CRL (Robinson & Fleming)
export function gaFromCrl(crl_mm) {
  if (!crl_mm || crl_mm <= 0) return null;
  // Robinson formula for CRL < 84mm
  const gaDays = Math.pow(crl_mm * 1.037, 0.5) * 8.052 + 23.73;
  const totalDays = Math.round(gaDays);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return `${weeks}w ${days}d`;
}

// EDD from CRL (simplified)
export function eddFromGa(gaString) {
  // gaString like "8w 3d"
  const match = gaString.match(/(\d+)w\s*(\d+)d/);
  if (!match) return '';
  const weeks = parseInt(match[1]);
  const days = parseInt(match[2]);
  const gaDays = weeks * 7 + days;
  const edd = new Date();
  edd.setDate(edd.getDate() + (280 - gaDays));
  return edd.toISOString().split('T')[0];
}

// EFW using Hadlock formula (BPD,HC,AC,FL in mm)
export function efwHadlock(bpd, hc, ac, fl) {
  if (!bpd || !hc || !ac || !fl) return null;
  // Hadlock 4 formula: Log10 EFW = 1.3596 - 0.00386*AC*FL + 0.0064*HC + 0.00061*BPD*AC + 0.0424*AC + 0.174*FL
  const log10efw = 1.3596 - (0.00386 * ac * fl) + (0.0064 * hc) + (0.00061 * bpd * ac) + (0.0424 * ac) + (0.174 * fl);
  const efw = Math.pow(10, log10efw);
  return Math.round(efw); // grams
}