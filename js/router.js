// ============================================================
// ROUTER - Loads scan templates and initializes the form
// ============================================================

import { getTemplate } from './templates/registry.js';
import { setState, getState, resetState, markClean } from './core/state.js';
import { renderForm } from './renderer.js';
import { renderPatientSection, initPatientSection } from './components/patient-section.js';
import { renderImpressionSection, initImpressionSection } from './components/impression-section.js';
import { renderActionButtons } from './components/action-buttons.js';
import { getNextReportNumber } from './services/report-number.js';
import CONFIG from './core/config.js';

export async function loadScan(scanId, options = {}) {
  const template = getTemplate(scanId);
  if (!template) {
    alert('Template not found: ' + scanId);
    return;
  }

  const existingPatient = { ...getState().patientInfo };
  resetState();
  setState({
    patientInfo: existingPatient,
    reportType: scanId,
    scanTypeTitle: template.title,
    currentTemplate: template,
    reportStatus: 'draft',
  });

  if (options.skipReportNumber) {
    setState({
      reportId: options.reportId || null,
      reportNumber: options.reportNumber || '',
    });
  } else {
    try {
      const number = await getNextReportNumber();
      setState({ reportNumber: number });
    } catch {
      // Fallback already handled inside getNextReportNumber
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      setState({ reportNumber: `ZUC-${today}-OFFLINE` });
    }
  }

  renderPatientSection();
  initPatientSection();
  renderForm(template);
  renderImpressionSection();
  initImpressionSection();
  renderActionButtons();
  initActionButtonHandlers();
  updateHeaderDisplay();

  document.getElementById('clinic-name-display').textContent = CONFIG.clinicName;
  document.getElementById('clinic-address').textContent = CONFIG.clinicAddress;
  document.getElementById('clinic-phone').textContent = CONFIG.clinicPhone;
  document.getElementById('sig-doctor-name').textContent = CONFIG.doctorName;
  document.getElementById('sig-qualification').textContent = CONFIG.doctorQualification;
  document.getElementById('sig-registration').textContent = CONFIG.doctorRegistration;
}

function updateHeaderDisplay() {
  const state = getState();
  document.getElementById('display-report-number').textContent = state.reportNumber || '—';
  document.getElementById('display-report-date').textContent = state.createdAt
    ? new Date(state.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  document.getElementById('display-scan-type').textContent = state.scanTypeTitle || '—';
  const statusEl = document.getElementById('display-report-status');
  if (state.reportStatus === 'final') {
    statusEl.textContent = 'Final';
    statusEl.className = 'badge badge-final';
  } else {
    statusEl.textContent = 'Draft';
    statusEl.className = 'badge badge-draft';
  }
}

export function initActionButtonHandlers() {
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnFinalize = document.getElementById('btn-finalize');
  const btnPrint = document.getElementById('btn-print');
  const btnPdf = document.getElementById('btn-pdf');
  const btnHistory = document.getElementById('btn-history');
  const btnNew = document.getElementById('btn-new');

  if (btnSaveDraft) btnSaveDraft.addEventListener('click', () => saveDraftHandler());
  if (btnFinalize) btnFinalize.addEventListener('click', () => finalizeHandler());
  if (btnPrint) btnPrint.addEventListener('click', () => import('./print.js').then(m => m.printReport()));
  if (btnPdf) btnPdf.addEventListener('click', () => import('./print.js').then(m => m.generatePDF()));
  if (btnHistory) btnHistory.addEventListener('click', () => import('./components/history-panel.js').then(m => m.toggleHistoryPanel()));
  if (btnNew) btnNew.addEventListener('click', () => {
    if (confirm('Clear current form? Unsaved changes will be lost.')) {
      resetState();
      renderPatientSection();
      initPatientSection();
      renderForm(null);
      renderImpressionSection();
      renderActionButtons();
      initActionButtonHandlers();
      document.getElementById('display-report-number').textContent = '—';
      document.getElementById('display-report-date').textContent = '—';
      document.getElementById('display-scan-type').textContent = '—';
      document.getElementById('display-report-status').textContent = '—';
    }
  });
}

async function saveDraftHandler() {
  const state = getState();
  const spinner = document.getElementById('save-spinner');
  if (spinner) spinner.style.display = '';

  try {
    const { saveLocalDraft, clearLocalDraft } = await import('./services/storage.js');
    const { isAppOnline, queueOperation } = await import('./services/sync.js');
    const { upsertPatient, createReport, updateReport } = await import('./services/supabase.js');

    saveLocalDraft(state);

    if (isAppOnline()) {
      const patientId = await upsertPatient(state.patientInfo);
      const draftData = {
        values: state.values,
        impression: state.impression,
        additionalNotes: state.additionalNotes,
        patientInfo: state.patientInfo,
        scanTypeTitle: state.scanTypeTitle,
      };
      if (state.reportId) {
        await updateReport(state.reportId, {
          patient_id: patientId,
          draft_data: draftData,
          report_status: 'draft'
        });
      } else {
        const result = await createReport({
          report_number: state.reportNumber,
          patient_id: patientId,
          report_type: state.reportType,
          report_status: 'draft',
          draft_data: draftData
        });
        setState({ reportId: result.id, reportNumber: result.report_number });
        document.getElementById('display-report-number').textContent = result.report_number;
      }
      clearLocalDraft();
      markClean();
      alert('Draft saved to cloud.');
    } else {
      queueOperation('save_draft', {
        reportId: state.reportId,
        reportNumber: state.reportNumber,
        reportType: state.reportType,
        patientInfo: state.patientInfo,
        draftData: {
          values: state.values,
          impression: state.impression,
          additionalNotes: state.additionalNotes,
          patientInfo: state.patientInfo,
          scanTypeTitle: state.scanTypeTitle,
        }
      });
      markClean();
      alert('Saved offline. Will sync when online.');
    }
  } catch (err) {
    alert('Save failed: ' + err.message);
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}

async function finalizeHandler() {
  const { validateForm } = await import('./validation.js');
  if (!validateForm()) return;

  const state = getState();
  const spinner = document.getElementById('save-spinner');
  if (spinner) spinner.style.display = '';

  try {
    const { isAppOnline, queueOperation } = await import('./services/sync.js');
    const { upsertPatient, createReport, updateReport } = await import('./services/supabase.js');

    const finalData = {
      values: state.values,
      impression: state.impression,
      additionalNotes: state.additionalNotes,
      patientInfo: state.patientInfo,
      scanTypeTitle: state.scanTypeTitle,
    };

    if (isAppOnline()) {
      const patientId = await upsertPatient(state.patientInfo);
      if (state.reportId) {
        await updateReport(state.reportId, {
          patient_id: patientId,
          final_data: finalData,
          report_status: 'final',
          finalized_at: new Date().toISOString(),
          draft_data: null
        });
      } else {
        const result = await createReport({
          report_number: state.reportNumber,
          patient_id: patientId,
          report_type: state.reportType,
          report_status: 'final',
          final_data: finalData,
          finalized_at: new Date().toISOString()
        });
        setState({ reportId: result.id, reportNumber: result.report_number });
        document.getElementById('display-report-number').textContent = result.report_number;
      }
      setState({ reportStatus: 'final' });
      updateHeaderDisplay();
      renderActionButtons();
      initActionButtonHandlers();   // <-- FIX: re-attach listeners after re-render
      markClean();
      alert('Report finalized.');
    } else {
      queueOperation('finalize', {
        reportId: state.reportId,
        reportNumber: state.reportNumber,
        reportType: state.reportType,
        patientInfo: state.patientInfo,
        finalData
      });
      setState({ reportStatus: 'final' });
      updateHeaderDisplay();
      renderActionButtons();
      initActionButtonHandlers();   // <-- FIX: re-attach listeners
      markClean();
      alert('Finalized offline. Will sync when online.');
    }
  } catch (err) {
    alert('Finalization failed: ' + err.message);
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}