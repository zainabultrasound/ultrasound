// ============================================================
// ACTION BUTTONS COMPONENT
// ============================================================

import { getState } from '../core/state.js';

export function renderActionButtons() {
  const container = document.getElementById('action-buttons');
  const state = getState();
  const isFinal = state.reportStatus === 'final';

  container.innerHTML = `
    <button id="btn-save-draft" class="btn-secondary" ${isFinal ? 'disabled' : ''}>
      💾 Save Draft
    </button>
    <button id="btn-finalize" class="btn-primary" ${isFinal ? 'disabled' : ''}>
      ✔ Finalize Report
    </button>
    <button id="btn-print" class="btn-secondary">🖨 Print</button>
    <button id="btn-pdf" class="btn-secondary">📄 Download PDF</button>
    <button id="btn-history" class="btn-secondary">📋 History</button>
    <button id="btn-new" class="btn-warning">🗑 New Report</button>
    <span id="save-spinner" style="display:none;"><span class="spinner"></span> Saving...</span>
  `;
}

export function setSavingIndicator(show) {
  const el = document.getElementById('save-spinner');
  if (el) el.style.display = show ? '' : 'none';
}