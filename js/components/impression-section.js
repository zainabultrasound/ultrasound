// ============================================================
// IMPRESSION SECTION COMPONENT
// ============================================================

import { getState, setState } from '../core/state.js';
import { on } from '../core/events.js';

export function renderImpressionSection() {
  const container = document.getElementById('impression-section');
  const state = getState();
  
  container.innerHTML = `
    <h3 class="section-title">Impression & Notes</h3>
    <div class="field-grid">
      <div class="field-item full-width">
        <label for="impression-text">Impression *</label>
        <textarea id="impression-text" data-field="impression" rows="4" required>${esc(state.impression)}</textarea>
      </div>
      <div class="field-item full-width">
        <label for="additional-notes">Additional Notes</label>
        <textarea id="additional-notes" data-field="additionalNotes" rows="2">${esc(state.additionalNotes)}</textarea>
      </div>
    </div>
  `;
}

export function initImpressionSection() {
  const container = document.getElementById('impression-section');
  on(container, 'input', 'textarea', (e, el) => {
    const field = el.dataset.field;
    if (field === 'impression') setState({ impression: el.value });
    if (field === 'additionalNotes') setState({ additionalNotes: el.value });
  });
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}