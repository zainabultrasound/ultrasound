// ============================================================
// CENTRAL TEMPLATE REGISTRY
// All 17 templates registered in one place.
// ============================================================

import { datingScan } from './pregnancy/dating-scan.js';
import { ntScan } from './pregnancy/nt-scan.js';
import { anomalyScan } from './pregnancy/anomaly-scan.js';
import { growthScan } from './pregnancy/growth-scan.js';
import { dopplerObstetric } from './pregnancy/doppler-obstetric.js';
import { threeDFourDScan } from './pregnancy/3d-4d-scan.js';
import { wholeAbdomen } from './abdomen/whole-abdomen.js';
import { kub } from './abdomen/kub.js';
import { pelvic } from './abdomen/pelvic.js';
import { tvs } from './abdomen/tvs.js';
import { trus } from './abdomen/trus.js';
import { dopplerPeripheral } from './specialized/doppler-peripheral.js';
import { thyroidNeck } from './specialized/thyroid-neck.js';
import { breast } from './specialized/breast.js';
import { echocardiogram } from './specialized/echocardiogram.js';
import { msk } from './specialized/msk.js';
import { scrotal } from './specialized/scrotal.js';

// All templates keyed by their id
const TEMPLATES = {
  dating_scan: datingScan,
  nt_scan: ntScan,
  anomaly_scan: anomalyScan,
  growth_scan: growthScan,
  doppler_obstetric: dopplerObstetric,
  threed_fourd_scan: threeDFourDScan,
  whole_abdomen: wholeAbdomen,
  kub: kub,
  pelvic: pelvic,
  tvs: tvs,
  trus: trus,
  doppler_peripheral: dopplerPeripheral,
  thyroid_neck: thyroidNeck,
  breast: breast,
  echocardiogram: echocardiogram,
  msk: msk,
  scrotal: scrotal,
};

// Category groupings for sidebar
const CATEGORIES = {
  'Pregnancy': [
    { id: 'dating_scan', title: 'Dating / Viability' },
    { id: 'nt_scan', title: 'NT Scan' },
    { id: 'anomaly_scan', title: 'Anomaly Scan (Level-II)' },
    { id: 'growth_scan', title: 'Fetal Wellbeing / Growth' },
    { id: 'doppler_obstetric', title: 'Obstetric Doppler' },
    { id: 'threed_fourd_scan', title: '3D / 4D Ultrasound' },
  ],
  'Abdomen & Pelvic': [
    { id: 'whole_abdomen', title: 'Whole Abdomen' },
    { id: 'kub', title: 'KUB' },
    { id: 'pelvic', title: 'Pelvic Ultrasound' },
    { id: 'tvs', title: 'TVS' },
    { id: 'trus', title: 'TRUS' },
  ],
  'Specialized': [
    { id: 'doppler_peripheral', title: 'Doppler (Peripheral)' },
    { id: 'thyroid_neck', title: 'Thyroid & Neck' },
    { id: 'breast', title: 'Breast Ultrasound' },
    { id: 'echocardiogram', title: 'Echocardiogram' },
    { id: 'msk', title: 'Musculoskeletal (MSK)' },
    { id: 'scrotal', title: 'Scrotal / Testis' },
  ],
};

/**
 * Get a template by its id.
 * @param {string} id
 * @returns {object|null}
 */
export function getTemplate(id) {
  return TEMPLATES[id] || null;
}

/**
 * Get category groupings for sidebar.
 */
export function getTemplateCategories() {
  return CATEGORIES;
}

/**
 * Get all template ids.
 */
export function getAllTemplateIds() {
  return Object.keys(TEMPLATES);
}

export default TEMPLATES;