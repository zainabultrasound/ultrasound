// ============================================================
// APPLICATION INITIALIZATION
// ============================================================

import { initSidebar } from './components/sidebar.js';
import { initStatusBar } from './components/status-bar.js';
import { initPatientSection, renderPatientSection } from './components/patient-section.js';
import { initImpressionSection, renderImpressionSection } from './components/impression-section.js';
import { renderActionButtons } from './components/action-buttons.js';
import { loadLocalDraft, saveLocalDraft } from './services/storage.js';
import { loadScan, initActionButtonHandlers } from './router.js';
import { setState, getState } from './core/state.js';
import CONFIG from './core/config.js';
import { processQueue } from './services/sync.js';
import { renderForm } from './renderer.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize UI components
  initStatusBar();
  initSidebar();
  initPatientSection();
  initImpressionSection();

  // Set clinic branding
  document.getElementById('clinic-name-display').textContent = CONFIG.clinicName;
  document.getElementById('clinic-address').textContent = CONFIG.clinicAddress;
  document.getElementById('clinic-phone').textContent = CONFIG.clinicPhone;
  document.getElementById('sig-doctor-name').textContent = CONFIG.doctorName;
  document.getElementById('sig-qualification').textContent = CONFIG.doctorQualification;
  document.getElementById('sig-registration').textContent = CONFIG.doctorRegistration;

  // Load clinic logo
  const logo = document.getElementById('clinic-logo');
  if (logo) logo.src = CONFIG.clinicLogo;

  // Render initial empty states
  renderPatientSection();
  renderImpressionSection();
  renderActionButtons();
  initActionButtonHandlers();   // <-- ensure buttons work from the start

  // Try to restore local draft
  const draft = loadLocalDraft();
  if (draft && draft.reportType) {
    const shouldRestore = confirm(`You have an unsaved draft from ${new Date(draft.savedAt).toLocaleString()}. Restore it?`);
    if (shouldRestore) {
      // Save the values, impression, notes before loadScan resets state
      const savedValues = draft.values || {};
      const savedImpression = draft.impression || '';
      const savedAdditionalNotes = draft.additionalNotes || '';

      // Pre-set patient info into state so loadScan can pick it up
      setState({
        patientInfo: draft.patientInfo || {},
        reportStatus: draft.reportStatus || 'draft',
      });

      await loadScan(draft.reportType, {
        skipReportNumber: true,
        reportId: draft.reportId,
        reportNumber: draft.reportNumber,
      });

      // Now apply the saved form values and impression
      setState({
        values: savedValues,
        impression: savedImpression,
        additionalNotes: savedAdditionalNotes,
      });

      // Re-render form with saved data
      const template = getState().currentTemplate;
      if (template) {
        renderForm(template, savedValues);
      }
      renderImpressionSection();
      renderActionButtons();
      initActionButtonHandlers();   // <-- FIX: re-attach after re-render

      // Restore patient fields (already loaded, but ensure DOM matches)
      const p = getState().patientInfo;
      Object.entries(p).forEach(([key, val]) => {
        const el = document.querySelector(`[data-field="${key}"]`);
        if (el) el.value = val || '';
      });
      document.getElementById('impression-text').value = savedImpression;
    }
  }

  // Auto-save draft periodically
  setInterval(() => {
    const state = getState();
    if (state?.isDirty && state?.reportType) {
      saveLocalDraft(state);
    }
  }, CONFIG.autoSaveIntervalSeconds * 1000);

  // Process any pending sync queue
  processQueue();

  console.log('Ultrasound Reporting System initialized.');
  console.log('Clinic:', CONFIG.clinicName);
  console.log('Offline capable:', true);
});