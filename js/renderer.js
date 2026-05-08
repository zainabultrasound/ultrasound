// ============================================================
// DYNAMIC FORM RENDERER
// ============================================================

import { getState, updateFieldValue, addRepeatableItem, removeRepeatableItem } from './core/state.js';
import { on, clearAll } from './core/events.js';
import { gaFromCRL, eddFromGA, efwHadlock } from './services/calculations.js';
import { toggleListening, stopListening, isSpeechSupported } from './services/voice.js';

console.log('[Renderer] Module loaded, speech supported:', isSpeechSupported());

/**
 * Main render function. Renders a template's sections and fields into #dynamic-form.
 */
export function renderForm(template, existingValues = null) {
  const container = document.getElementById('dynamic-form');
  clearAll(container);

  // Stop any active voice recognition when re-rendering
  stopListening();

  if (!template || !template.sections) {
    container.innerHTML = '<p>Select a scan type from the sidebar to begin.</p>';
    return;
  }

  const values = existingValues || getState().values;
  let html = '';

  template.sections.forEach(section => {
    html += `<div class="form-section" data-section="${section.id}">`;
    
    if (section.repeatable) {
      const items = values[section.id] || [{}];
      html += `<h3 class="section-title">
        ${section.title}
        <button class="add-btn" data-action="add-repeatable" data-section="${section.id}">+ Add ${section.groupLabel || 'Item'}</button>
      </h3>`;
      html += `<div class="repeatable-container" data-repeatable-container="${section.id}">`;
      items.forEach((item, idx) => {
        html += renderRepeatableItem(section, idx, item);
      });
      html += `</div>`;
    } else {
      html += `<h3 class="section-title">${section.title}</h3>`;
      html += `<div class="field-grid">`;
      section.fields.forEach(field => {
        const val = values[section.id]?.[field.id] ?? '';
        html += renderField(section.id, field, val);
      });
      html += `</div>`;
    }
    
    html += `</div>`;
  });

  container.innerHTML = html;
  attachFormEvents(template);
  applyConditionals(template);
}

function renderRepeatableItem(section, index, itemData) {
  let html = `<div class="repeatable-item" data-repeatable-index="${index}" data-section="${section.id}">
    <button class="remove-btn" data-action="remove-repeatable" data-section="${section.id}" data-index="${index}">✖</button>
    <div class="field-grid">`;
  section.fields.forEach(field => {
    const val = itemData?.[field.id] ?? '';
    html += renderField(section.id, field, val, index);
  });
  html += `</div></div>`;
  return html;
}

function renderField(sectionId, field, value, repeatableIndex = null) {
  const fieldKey = repeatableIndex !== null ? `${sectionId}_${repeatableIndex}_${field.id}` : `${sectionId}_${field.id}`;
  const required = field.required ? 'required' : '';
  
  let inputHtml = '';
  switch (field.type) {
    case 'text':
      inputHtml = `<div class="input-voice-wrapper">
        <input type="text" id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" value="${esc(value)}" placeholder="${field.placeholder || ''}" ${required}>
        ${renderVoiceButton(fieldKey)}
      </div>`;
      break;
    case 'number':
      inputHtml = `<input type="number" id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" value="${esc(value)}" placeholder="${field.placeholder || ''}" min="${field.min ?? ''}" max="${field.max ?? ''}" step="${field.step || 'any'}" ${required}>`;
      break;
    case 'textarea':
      inputHtml = `<div class="input-voice-wrapper input-voice-wrapper-textarea">
        <textarea id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" rows="${field.rows || 3}" placeholder="${field.placeholder || ''}" ${required}>${esc(value)}</textarea>
        ${renderVoiceButton(fieldKey)}
      </div>`;
      break;
    case 'date':
      inputHtml = `<input type="date" id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" value="${esc(value)}" ${required}>`;
      break;
    case 'dropdown':
      inputHtml = `<select id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" ${required}>
        <option value="">-- Select --</option>
        ${(field.options || []).map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>`;
      break;
    case 'radio':
      inputHtml = `<div class="radio-group">${(field.options || []).map((opt, idx) => 
        `<label><input type="radio" name="field-${fieldKey}" value="${opt}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" ${value === opt ? 'checked' : ''} ${required}> ${opt}</label>`
      ).join('')}</div>`;
      break;
    case 'checkbox':
      inputHtml = `<div class="checkbox-group"><label><input type="checkbox" id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" ${value === 'true' || value === true ? 'checked' : ''}> ${field.label}</label></div>`;
      break;
    case 'measurement':
      inputHtml = `<div class="measurement-wrapper">
        <input type="number" id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" value="${esc(value)}" placeholder="${field.placeholder || ''}" min="${field.min ?? ''}" max="${field.max ?? ''}" step="any" ${required}>
        <span class="unit">${field.unit || ''}</span>
      </div>`;
      break;
    default:
      inputHtml = `<input type="text" id="field-${fieldKey}" data-section="${sectionId}" data-field="${field.id}" data-index="${repeatableIndex ?? ''}" value="${esc(value)}" ${required}>`;
  }

  const helpHtml = field.help ? `<span class="help-text">${field.help}</span>` : '';
  const showIfAttr = field.showIf ? `data-show-if='${JSON.stringify(field.showIf)}'` : '';
  
  return `<div class="field-item" ${showIfAttr} data-field-container="${fieldKey}">
    <label for="field-${fieldKey}">${field.label} ${field.required ? '*' : ''}</label>
    ${inputHtml}
    <span class="validation-error"></span>
    ${helpHtml}
  </div>`;
}

/**
 * Render the mic button for text/textarea fields.
 * Only shown if browser supports speech recognition.
 */
function renderVoiceButton(fieldKey) {
  if (!isSpeechSupported()) {
    console.warn('[Renderer] Voice not supported, omitting button for', fieldKey);
    return '';
  }
  return `<button type="button" class="voice-btn no-print" data-voice-target="field-${fieldKey}" title="Click to dictate" aria-label="Voice typing">🎤</button>`;
}

function attachFormEvents(template) {
  const container = document.getElementById('dynamic-form');

  on(container, 'input', 'input, select, textarea', (e, el) => {
    handleFieldChange(el);
    runCalculations(template);
    applyConditionals(template);
  });

  on(container, 'change', 'select, input[type="radio"], input[type="checkbox"]', (e, el) => {
    handleFieldChange(el);
    applyConditionals(template);
  });

  // Voice button click handler
  on(container, 'click', '.voice-btn', (e, el) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = el.dataset.voiceTarget;
    const field = targetId ? document.getElementById(targetId) : null;
    if (field) {
      toggleListening(field);
    } else {
      console.warn('[Renderer] Voice target not found:', targetId);
    }
  });

  on(container, 'click', '[data-action="add-repeatable"]', (e, el) => {
    const sectionId = el.dataset.section;
    addRepeatableItem(sectionId);
    const section = template.sections.find(s => s.id === sectionId);
    if (section) {
      const state = getState();
      const items = state.values[sectionId] || [{}];
      const rContainer = container.querySelector(`[data-repeatable-container="${sectionId}"]`);
      if (rContainer) {
        rContainer.innerHTML = items.map((item, idx) => renderRepeatableItem(section, idx, item)).join('');
      }
    }
    attachFormEvents(template);
    applyConditionals(template);
  });

  on(container, 'click', '[data-action="remove-repeatable"]', (e, el) => {
    const sectionId = el.dataset.section;
    const index = parseInt(el.dataset.index);
    removeRepeatableItem(sectionId, index);
    const section = template.sections.find(s => s.id === sectionId);
    if (section) {
      const state = getState();
      const items = state.values[sectionId] || [];
      const rContainer = container.querySelector(`[data-repeatable-container="${sectionId}"]`);
      if (rContainer) {
        rContainer.innerHTML = items.map((item, idx) => renderRepeatableItem(section, idx, item)).join('');
      }
    }
    attachFormEvents(template);
    applyConditionals(template);
  });
}

function handleFieldChange(el) {
  const sectionId = el.dataset.section;
  const fieldId = el.dataset.field;
  const indexStr = el.dataset.index;
  const index = indexStr !== '' && indexStr !== undefined ? parseInt(indexStr) : null;
  let value;

  if (el.type === 'checkbox') {
    value = el.checked;
  } else if (el.type === 'radio') {
    if (el.checked) value = el.value; else return;
  } else {
    value = el.value;
  }

  updateFieldValue(sectionId, fieldId, value, index);
}

function applyConditionals() {
  const state = getState();
  document.querySelectorAll('[data-field-container]').forEach(cnt => {
    const showIfData = cnt.dataset.showIf ? JSON.parse(cnt.dataset.showIf) : null;
    if (!showIfData) return;
    const dependValue = getDependentValue(showIfData.field, state);
    if (String(dependValue) === String(showIfData.equals)) {
      cnt.removeAttribute('data-hidden');
    } else {
      cnt.setAttribute('data-hidden', 'true');
    }
  });
}

function getDependentValue(fieldName, state) {
  for (const sectionId of Object.keys(state.values)) {
    const section = state.values[sectionId];
    if (Array.isArray(section)) {
      for (const item of section) {
        if (item[fieldName] !== undefined) return item[fieldName];
      }
    } else if (section[fieldName] !== undefined) {
      return section[fieldName];
    }
  }
  if (state.patientInfo[fieldName] !== undefined) return state.patientInfo[fieldName];
  const el = document.getElementById(fieldName);
  if (el) return el.type === 'checkbox' ? el.checked : el.value;
  return '';
}

function runCalculations(template) {
  const state = getState();
  const values = state.values;

  if (template.id === 'dating_scan' || template.id === 'nt_scan') {
    const crl = parseFloat(values.measurements?.crl);
    if (crl && crl > 0 && crl <= 84) {
      const ga = gaFromCRL(crl);
      if (ga) {
        const gaField = document.getElementById('field-measurements_gestational_age');
        if (gaField && !gaField.dataset.manualOverride) {
          gaField.value = ga;
          updateFieldValue('measurements', 'gestational_age', ga);
        }
        const edd = eddFromGA(ga);
        const eddField = document.getElementById('field-measurements_edd');
        if (eddField && !eddField.dataset.manualOverride) {
          eddField.value = edd;
          updateFieldValue('measurements', 'edd', edd);
        }
      }
    }
  }

  if (template.id === 'growth_scan' || template.id === 'anomaly_scan') {
    const bpd = parseFloat(values.biometry?.bpd);
    const hc = parseFloat(values.biometry?.hc);
    const ac = parseFloat(values.biometry?.ac);
    const fl = parseFloat(values.biometry?.fl);
    if (bpd && hc && ac && fl) {
      const efw = efwHadlock(bpd, hc, ac, fl);
      if (efw) {
        const efwField = document.getElementById('field-biometry_efw');
        if (efwField && !efwField.dataset.manualOverride) {
          efwField.value = efw;
          updateFieldValue('biometry', 'efw', efw);
        }
      }
    }
  }
}

document.addEventListener('focusin', (e) => {
  if (e.target.closest('#dynamic-form input, #dynamic-form textarea')) {
    e.target.dataset.manualOverride = 'true';
  }
});

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}