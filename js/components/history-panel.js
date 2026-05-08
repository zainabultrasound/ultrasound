// ============================================================
// HISTORY PANEL COMPONENT
// ============================================================

import { getState, setState } from '../core/state.js';
import { getReportsList, searchReports, getReportById } from '../services/supabase.js';
import { isAppOnline } from '../services/sync.js';
import { cacheHistory, getCachedHistory } from '../services/storage.js';
import { loadScan } from '../router.js';
import { renderPatientSection, initPatientSection } from './patient-section.js';
import { renderImpressionSection, initImpressionSection } from './impression-section.js';
import { renderForm } from '../renderer.js';
import { getTemplate } from '../templates/registry.js';
import { renderActionButtons } from './action-buttons.js';
import { initActionButtonHandlers } from '../router.js';   // <-- new import

let isVisible = false;

export async function toggleHistoryPanel() {
  const panel = document.getElementById('history-panel');
  isVisible = !isVisible;
  panel.style.display = isVisible ? 'block' : 'none';
  if (isVisible) {
    await loadHistory();
  }
}

async function loadHistory(searchQuery = '') {
  const panel = document.getElementById('history-panel');
  panel.innerHTML = '<p><span class="spinner"></span> Loading history...</p>';

  try {
    let records;
    if (isAppOnline()) {
      if (searchQuery) {
        records = await searchReports(searchQuery);
      } else {
        const result = await getReportsList(50, 0);
        records = result.data;
      }
      cacheHistory(records);
    } else {
      records = getCachedHistory();
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        records = records.filter(r =>
          (r.patients?.name?.toLowerCase().includes(q)) ||
          (r.patients?.patient_code?.toLowerCase().includes(q)) ||
          (r.report_number?.toLowerCase().includes(q)) ||
          (r.report_type?.toLowerCase().includes(q))
        );
      }
    }

    panel.innerHTML = `
      <h3 class="section-title">Report History</h3>
      <div class="history-search">
        <input type="text" id="history-search-input" placeholder="Search by name, ID, report #, type..." value="${esc(searchQuery)}">
        <button class="btn-secondary btn-sm" id="history-search-btn">Search</button>
        <button class="btn-secondary btn-sm" id="history-refresh-btn">Refresh</button>
      </div>
      <div class="history-list">
        ${records.length === 0 ? '<p>No reports found.</p>' : records.map(r => historyItem(r)).join('')}
      </div>
    `;

    // Delegate all history list clicks (buttons and rows)
    panel.addEventListener('click', (e) => {
      const openBtn = e.target.closest('.open-report-btn');
      if (openBtn) {
        e.stopPropagation();
        openReport(openBtn.dataset.reportId);
        return;
      }

      const pdfBtn = e.target.closest('.view-pdf-btn');
      if (pdfBtn) {
        e.stopPropagation();
        const pdfUrl = pdfBtn.dataset.pdf;
        if (pdfUrl) window.open(pdfUrl, '_blank');
        return;
      }

      const historyItem = e.target.closest('.history-item');
      if (historyItem && !e.target.closest('button')) {
        openReport(historyItem.dataset.reportId);
      }
    });

    // Search / refresh controls
    const searchInput = document.getElementById('history-search-input');
    const searchBtn = document.getElementById('history-search-btn');
    const refreshBtn = document.getElementById('history-refresh-btn');

    if (searchBtn) searchBtn.addEventListener('click', () => loadHistory(searchInput.value));
    if (refreshBtn) refreshBtn.addEventListener('click', () => loadHistory(searchInput.value));
    if (searchInput) searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadHistory(searchInput.value);
    });

  } catch (err) {
    panel.innerHTML = `<p style="color:var(--danger)">Error loading history: ${err.message}</p>`;
  }
}

function historyItem(report) {
  const statusClass = report.report_status === 'final' ? 'badge-final' : 'badge-draft';
  return `
    <div class="history-item" data-report-id="${report.id}">
      <div>
        <strong>${esc(report.patients?.name || 'Unknown')}</strong>
        <span class="badge ${statusClass}">${report.report_status}</span>
        <div class="hi-meta">
          ${esc(report.report_number)} | ${esc(report.report_type)} | ${new Date(report.created_at).toLocaleDateString()}
        </div>
      </div>
      <div class="history-actions">
        <button class="btn-sm btn-primary open-report-btn" data-report-id="${report.id}">Open</button>
        ${report.pdf_url ? `<button class="btn-sm btn-secondary view-pdf-btn" data-pdf="${esc(report.pdf_url)}">PDF</button>` : ''}
      </div>
    </div>
  `;
}

async function openReport(reportId) {
  try {
    const report = await getReportById(reportId);
    if (!report) { alert('Report not found.'); return; }

    const data = report.report_status === 'final' ? report.final_data : report.draft_data;
    if (!data) { alert('No data found in report.'); return; }

    setState({
        reportId: report.id,
        reportNumber: report.report_number,
        reportStatus: report.report_status,
        reportType: report.report_type,
        scanTypeTitle: data.scanTypeTitle || report.report_type,
        patientInfo: { ...getState().patientInfo, ...(data.patientInfo || {}) },
        values: data.values || {},
        impression: data.impression || '',
        additionalNotes: data.additionalNotes || '',
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        finalizedAt: report.finalized_at,
        isDirty: false,
        pdf_url: report.pdf_url || null,
    });

    const template = getTemplate(report.report_type);
    if (template) {
      setState({ currentTemplate: template, scanTypeTitle: template.title });
      renderPatientSection();
      initPatientSection();
      renderForm(template, data.values || {});
      renderImpressionSection();
      initImpressionSection();
      renderActionButtons();
      initActionButtonHandlers();
      updateHeader();
    }

    document.getElementById('history-panel').style.display = 'none';
    isVisible = false;

  } catch (err) {
    alert('Failed to open report: ' + err.message);
  }
}

function updateHeader() {
  const state = getState();
  document.getElementById('display-report-number').textContent = state.reportNumber || '—';
  document.getElementById('display-report-date').textContent = state.createdAt ? new Date(state.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  document.getElementById('display-scan-type').textContent = state.scanTypeTitle || '—';
  const statusEl = document.getElementById('display-report-status');
  statusEl.textContent = state.reportStatus;
  statusEl.className = 'badge ' + (state.reportStatus === 'final' ? 'badge-final' : 'badge-draft');
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export { openReport, updateHeader };