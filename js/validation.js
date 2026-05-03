// ============================================================
// FORM VALIDATION SYSTEM
// ============================================================

import { getState } from './core/state.js';

export function validateForm() {
  const state = getState();
  const errors = [];

  // Clear previous errors
  document.querySelectorAll('.field-item.has-error').forEach(el => el.classList.remove('has-error'));
  document.querySelectorAll('.validation-error').forEach(el => el.textContent = '');

  // Validate patient info
  const p = state.patientInfo;
  if (!p.patient_code?.trim()) errors.push({ field: 'pt-code', message: 'Patient ID is required' });
  if (!p.name?.trim()) errors.push({ field: 'pt-name', message: 'Patient name is required' });
  if (!p.age || isNaN(p.age) || parseInt(p.age) < 0) errors.push({ field: 'pt-age', message: 'Valid age is required' });
  if (!p.gender) errors.push({ field: 'pt-gender', message: 'Gender is required' });

  // Validate impression
  if (!state.impression?.trim()) {
    errors.push({ field: 'impression-text', message: 'Impression is required' });
  }

  // Validate template required fields
  const template = state.currentTemplate;
  if (template) {
    template.sections.forEach(section => {
      section.fields.forEach(field => {
        if (!field.required) return;
        // Look for all inputs with matching data-field
        const inputs = document.querySelectorAll(`[data-field="${field.id}"]`);
        inputs.forEach(input => {
          const fieldContainer = input.closest('.field-item');
          // Skip if hidden by conditional logic
          if (fieldContainer && fieldContainer.hasAttribute('data-hidden')) return;
          
          let isEmpty = false;
          if (input.type === 'radio') {
            const name = input.name;
            if (name) {
              const checked = document.querySelector(`input[name="${CSS.escape(name)}"]:checked`);
              if (!checked) isEmpty = true;
            }
          } else if (!input.value?.toString().trim()) {
            isEmpty = true;
          }
          
          if (isEmpty) {
            errors.push({ field: field.id, message: `${field.label} is required` });
          }
        });
      });
    });
  }

  // Highlight errors
  errors.forEach(err => {
    const el = document.getElementById(err.field);
    if (!el) {
      // For repeatable fields, find first visible instance
      const firstEl = document.querySelector(`[data-field="${err.field}"]:not([data-hidden])`);
      if (firstEl) {
        const fieldItem = firstEl.closest('.field-item');
        if (fieldItem) {
          fieldItem.classList.add('has-error');
          const errorSpan = fieldItem.querySelector('.validation-error');
          if (errorSpan) errorSpan.textContent = err.message;
        }
      }
    } else {
      const fieldItem = el.closest('.field-item');
      if (fieldItem) {
        fieldItem.classList.add('has-error');
        const errorSpan = fieldItem.querySelector('.validation-error');
        if (errorSpan) errorSpan.textContent = err.message;
      }
    }
  });

  if (errors.length > 0) {
    alert(`Please fix ${errors.length} validation error(s).\n\n${errors.map(e => '• ' + e.message).join('\n')}`);
    const firstEl = document.getElementById(errors[0].field) || document.querySelector(`[data-field="${errors[0].field}"]`);
    if (firstEl) firstEl.focus();
    return false;
  }

  return true;
}