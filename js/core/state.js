// ============================================================
// CENTRALIZED STATE MANAGEMENT
// Single source of truth for all application state.
// ============================================================

import { emit } from './events.js';

const AppState = {
  // Report identity
  reportId: null,          // UUID from database
  reportNumber: '',        // Human-readable: USG-YYYYMMDD-001
  reportStatus: 'draft',   // 'draft' | 'final'
  reportType: '',          // template id e.g. 'dating_scan'
  scanTypeTitle: '',       // display title
  pdf_url: null,           // NEW: PREVENT DUPLICATE generated PDF for download 

  // Patient info
  patientInfo: {
    patient_code: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    referred_by: '',
    referring_clinic: '',
    clinical_history: '',
    lmp: '',
    gestational_age: ''
  },

  // Dynamic form values: { sectionId: { fieldId: value } } or arrays for repeatable
  values: {},

  // Impression & notes
  impression: '',
  additionalNotes: '',

  // Metadata
  createdAt: '',
  updatedAt: '',
  finalizedAt: '',

  // Flags
  isDirty: false,
  isSaving: false,
  isLoading: false,

  // Current template reference
  currentTemplate: null,

  // Voice typing language preference (session-only, not persisted in reports)
  voiceLanguage: 'en-US',
};

const stateProxy = new Proxy(AppState, {
  set(target, prop, value) {
    const old = target[prop];
    target[prop] = value;
    if (old !== value) {
      emit(document, 'state:change', { key: prop, oldValue: old, newValue: value });
    }
    return true;
  }
});

export function getState() {
  return stateProxy;
}

export function setState(updates) {
  Object.entries(updates).forEach(([key, value]) => {
    stateProxy[key] = value;
  });
}

export function resetState() {
  setState({
    reportId: null,
    reportNumber: '',
    reportStatus: 'draft',
    reportType: '',
    scanTypeTitle: '',
    patientInfo: {
      patient_code: '', name: '', age: '', gender: '', phone: '',
      referred_by: '', referring_clinic: '', clinical_history: '',
      lmp: '', gestational_age: ''
    },
    values: {},
    impression: '',
    additionalNotes: '',
    createdAt: '',
    updatedAt: '',
    finalizedAt: '',
    isDirty: false,
    isSaving: false,
    isLoading: false,
    currentTemplate: null,
    pdf_url: null, // NEW
    // NOTE: voiceLanguage intentionally preserved across resets
  });
}

export function updatePatientInfo(field, value) {
  const info = { ...stateProxy.patientInfo };
  info[field] = value;
  stateProxy.patientInfo = info;
  stateProxy.isDirty = true;
}

export function updateFieldValue(sectionId, fieldId, value, index = null) {
  const values = { ...stateProxy.values };
  if (index !== null) {
    // Repeatable group field
    if (!values[sectionId]) values[sectionId] = [];
    if (!values[sectionId][index]) values[sectionId][index] = {};
    values[sectionId][index][fieldId] = value;
  } else {
    if (!values[sectionId]) values[sectionId] = {};
    values[sectionId][fieldId] = value;
  }
  stateProxy.values = values;
  stateProxy.isDirty = true;
}

export function getFieldValue(sectionId, fieldId, index = null) {
  const values = stateProxy.values;
  if (index !== null) {
    return values[sectionId]?.[index]?.[fieldId] ?? '';
  }
  return values[sectionId]?.[fieldId] ?? '';
}

export function addRepeatableItem(sectionId) {
  const values = { ...stateProxy.values };
  if (!values[sectionId]) values[sectionId] = [];
  values[sectionId] = [...values[sectionId], {}];
  stateProxy.values = values;
  stateProxy.isDirty = true;
}

export function removeRepeatableItem(sectionId, index) {
  const values = { ...stateProxy.values };
  if (values[sectionId]) {
    values[sectionId] = values[sectionId].filter((_, i) => i !== index);
  }
  stateProxy.values = values;
  stateProxy.isDirty = true;
}

export function markClean() {
  stateProxy.isDirty = false;
}