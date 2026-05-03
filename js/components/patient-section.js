// ============================================================
// PATIENT INFORMATION COMPONENT
// ============================================================

import { getState, updatePatientInfo, setState } from '../core/state.js';
import { on } from '../core/events.js';

export function renderPatientSection() {
  const container = document.getElementById('patient-section');
  const patient = getState().patientInfo;
  
  container.innerHTML = `
    <h3 class="section-title">Patient Information</h3>
    <div class="field-grid">
      <div class="field-item">
        <label for="pt-code">Patient ID *</label>
        <input type="text" id="pt-code" data-field="patient_code" value="${esc(patient.patient_code)}" required>
      </div>
      <div class="field-item">
        <label for="pt-name">Patient Name *</label>
        <input type="text" id="pt-name" data-field="name" value="${esc(patient.name)}" required>
      </div>
      <div class="field-item">
        <label for="pt-age">Age *</label>
        <input type="number" id="pt-age" data-field="age" value="${esc(patient.age)}" min="0" max="150" required>
      </div>
      <div class="field-item">
        <label for="pt-gender">Gender *</label>
        <select id="pt-gender" data-field="gender" required>
          <option value="">-- Select --</option>
          <option value="male" ${patient.gender === 'male' ? 'selected' : ''}>Male</option>
          <option value="female" ${patient.gender === 'female' ? 'selected' : ''}>Female</option>
          <option value="other" ${patient.gender === 'other' ? 'selected' : ''}>Other</option>
        </select>
      </div>
      <div class="field-item">
        <label for="pt-phone">Phone</label>
        <input type="text" id="pt-phone" data-field="phone" value="${esc(patient.phone)}">
      </div>
    </div>
    <div class="field-grid" style="margin-top:12px;">
      <div class="field-item">
        <label for="pt-ref-by">Referred By</label>
        <input type="text" id="pt-ref-by" data-field="referred_by" value="${esc(patient.referred_by)}">
      </div>
      <div class="field-item">
        <label for="pt-ref-clinic">Referring Clinic</label>
        <input type="text" id="pt-ref-clinic" data-field="referring_clinic" value="${esc(patient.referring_clinic)}">
      </div>
      <div class="field-item">
        <label for="pt-lmp">LMP (if OB)</label>
        <input type="date" id="pt-lmp" data-field="lmp" value="${esc(patient.lmp)}">
      </div>
      <div class="field-item">
        <label for="pt-ga">Gestational Age</label>
        <input type="text" id="pt-ga" data-field="gestational_age" value="${esc(patient.gestational_age)}" placeholder="e.g. 12w 3d">
      </div>
    </div>
    <div class="field-grid" style="margin-top:12px;">
      <div class="field-item full-width">
        <label for="pt-clin-hist">Clinical History</label>
        <textarea id="pt-clin-hist" data-field="clinical_history" rows="2">${esc(patient.clinical_history)}</textarea>
      </div>
    </div>
  `;
}

export function initPatientSection() {
  const container = document.getElementById('patient-section');
  on(container, 'input', 'input, select, textarea', (e, el) => {
    const field = el.dataset.field;
    if (field) {
      updatePatientInfo(field, el.value);
    }
  });
  on(container, 'change', 'select', (e, el) => {
    const field = el.dataset.field;
    if (field) {
      updatePatientInfo(field, el.value);
    }
  });
}

export function collectPatientInfo() {
  return { ...getState().patientInfo };
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}