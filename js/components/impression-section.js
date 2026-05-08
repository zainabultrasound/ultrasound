// ============================================================
// IMPRESSION SECTION COMPONENT
// ============================================================

import { getState, setState } from '../core/state.js';
import { on } from '../core/events.js';
import { isSpeechSupported, toggleListening } from '../services/voice.js';

export function renderImpressionSection() {
  const container = document.getElementById('impression-section');
  const state = getState();
  
  container.innerHTML = `
    <h3 class="section-title">Comment and Advice</h3>
    <div class="field-grid">
      <div class="field-item full-width">
        <label for="impression-text">Comment *</label>
        <div class="input-voice-wrapper input-voice-wrapper-textarea">
          <textarea id="impression-text" data-field="impression" rows="4" required>${esc(state.impression)}</textarea>
          ${renderVoiceButton('impression-text')}
        </div>
      </div>
      <div class="field-item full-width">
        <label for="additional-notes">Advice</label>
        <div class="input-voice-wrapper input-voice-wrapper-textarea">
          <textarea id="additional-notes" data-field="additionalNotes" rows="2">${esc(state.additionalNotes)}</textarea>
          ${renderVoiceButton('additional-notes')}
        </div>
      </div>
    </div>
  `;

  // Attach direct click listeners to voice buttons (bypasses delegation issues)
  container.querySelectorAll('.voice-btn').forEach(btn => {
    // Remove any previously attached listener to avoid duplicates
    btn.removeEventListener('click', voiceButtonClickHandler);
    btn.addEventListener('click', voiceButtonClickHandler);
  });
}

function voiceButtonClickHandler(e) {
  e.preventDefault();
  e.stopPropagation();
  const btn = e.currentTarget;
  const wrapper = btn.closest('.input-voice-wrapper');
  if (!wrapper) return;
  const field = wrapper.querySelector('textarea');
  if (field) {
    toggleListening(field);
  }
}

export function initImpressionSection() {
  const container = document.getElementById('impression-section');
  
  // Textarea input → state (delegation is fine here)
  on(container, 'input', 'textarea', (e, el) => {
    const field = el.dataset.field;
    if (field === 'impression') setState({ impression: el.value });
    if (field === 'additionalNotes') setState({ additionalNotes: el.value });
  });

  // No delegated voice button click – direct listeners attached in render
}

function renderVoiceButton(fieldId) {
  if (!isSpeechSupported()) return '';
  return `<button type="button" class="voice-btn no-print" title="Click to dictate" aria-label="Voice typing">🎤</button>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}