// ============================================================
// PATIENT INFORMATION COMPONENT
// ============================================================

import { getState, updatePatientInfo, setState } from '../core/state.js';
import { on } from '../core/events.js';
import { isSpeechSupported, toggleListening } from '../services/voice.js';

export function renderPatientSection() {
  const container = document.getElementById('patient-section');
  const patient = getState().patientInfo;
  
  container.innerHTML = `
    <h3 class="section-title">Patient Information</h3>
    <div class="field-grid">
      <div class="field-item">
        <label for="pt-code">Patient ID *</label>
        <div class="input-voice-wrapper">
          <input type="text" id="pt-code" data-field="patient_code" value="${esc(patient.patient_code)}" required>
          ${renderVoiceButton('pt-code')}
        </div>
      </div>
      <div class="field-item">
        <label for="pt-name">Patient Name *</label>
        <div class="input-voice-wrapper">
          <input type="text" id="pt-name" data-field="name" value="${esc(patient.name)}" required>
          ${renderVoiceButton('pt-name')}
        </div>
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
        <div class="input-voice-wrapper">
          <input type="text" id="pt-phone" data-field="phone" value="${esc(patient.phone)}">
          ${renderVoiceButton('pt-phone')}
        </div>
      </div>
    </div>
    <div class="field-grid" style="margin-top:12px;">
      <div class="field-item">
        <label for="pt-ref-by">Referred By</label>
        <div class="input-voice-wrapper">
          <input type="text" id="pt-ref-by" data-field="referred_by" value="${esc(patient.referred_by)}">
          ${renderVoiceButton('pt-ref-by')}
        </div>
      </div>
      <div class="field-item">
        <label for="pt-ref-clinic">Referring Clinic</label>
        <div class="input-voice-wrapper">
          <input type="text" id="pt-ref-clinic" data-field="referring_clinic" value="${esc(patient.referring_clinic)}">
          ${renderVoiceButton('pt-ref-clinic')}
        </div>
      </div>
      <div class="field-item">
        <label for="pt-lmp">LMP (if OB)</label>
        <input type="date" id="pt-lmp" data-field="lmp" value="${esc(patient.lmp)}">
      </div>
      <div class="field-item">
        <label for="pt-ga">Gestational Age</label>
        <div class="input-voice-wrapper">
          <input type="text" id="pt-ga" data-field="gestational_age" value="${esc(patient.gestational_age)}" placeholder="e.g. 12w 3d">
          ${renderVoiceButton('pt-ga')}
        </div>
      </div>
    </div>
    <div class="field-grid" style="margin-top:12px;">
      <div class="field-item full-width">
        <label for="pt-clin-hist">Clinical History</label>
        <div class="input-voice-wrapper input-voice-wrapper-textarea">
          <textarea id="pt-clin-hist" data-field="clinical_history" rows="2">${esc(patient.clinical_history)}</textarea>
          ${renderVoiceButton('pt-clin-hist')}
        </div>
      </div>
    </div>
  `;
}

export function initPatientSection() {
  const container = document.getElementById('patient-section');
  
  // existing input change handler
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

  // Voice button click handler
  on(container, 'click', '.voice-btn', (e, el) => {
    e.preventDefault();
    e.stopPropagation();
    const input = el.parentElement.querySelector('input, textarea');
    if (input) {
      toggleListening(input);
    }
  });
}

export function collectPatientInfo() {
  return { ...getState().patientInfo };
}

function renderVoiceButton(fieldId) {
  if (!isSpeechSupported()) return '';
  return `<button type="button" class="voice-btn no-print" title="Click to dictate" aria-label="Voice typing">🎤</button>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}