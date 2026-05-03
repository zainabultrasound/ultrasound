// ============================================================
// OFFLINE SYNC SERVICE
// ============================================================

import { addToSyncQueue, getSyncQueue, clearSyncQueue, removeFromSyncQueue, cacheHistory, setLastSync, getCachedHistory } from './storage.js';
import { upsertPatient, createReport, updateReport, getReportsList, supabase } from './supabase.js';

let isOnline = navigator.onLine;
let syncInProgress = false;

export function isAppOnline() { return isOnline; }

export function initSyncMonitor() {
  window.addEventListener('online', () => {
    isOnline = true;
    updateStatusDisplay();
    processQueue();
  });
  window.addEventListener('offline', () => {
    isOnline = false;
    updateStatusDisplay();
  });
  updateStatusDisplay();
}

function updateStatusDisplay() {
  const el = document.getElementById('sync-status');
  const pendingEl = document.getElementById('pending-sync');
  if (el) {
    el.innerHTML = isOnline
      ? '<span style="color:#2ecc71;">●</span> Online'
      : '<span style="color:#e74c3c;">●</span> Offline';
  }
  if (pendingEl) {
    const count = getSyncQueue().length;
    pendingEl.style.display = count > 0 ? '' : 'none';
    pendingEl.textContent = `📤 Pending sync: ${count}`;
  }
}

export async function processQueue() {
  if (!isOnline || syncInProgress) return;
  syncInProgress = true;
  const queue = getSyncQueue();
  if (queue.length === 0) {
    syncInProgress = false;
    // Refresh history cache when online
    try {
      const { data } = await getReportsList(50, 0);
      if (data) cacheHistory(data);
      setLastSync();
    } catch {}
    return;
  }
  for (const item of [...queue]) {
    try {
      if (item.type === 'save_draft') {
        const patientId = await upsertPatient(item.payload.patientInfo);
        if (item.payload.reportId) {
          await updateReport(item.payload.reportId, {
            patient_id: patientId,
            draft_data: item.payload.draftData,
            report_status: 'draft'
          });
        } else {
          await createReport({
            report_number: item.payload.reportNumber,
            patient_id: patientId,
            report_type: item.payload.reportType,
            report_status: 'draft',
            draft_data: item.payload.draftData
          });
        }
      } else if (item.type === 'finalize') {
        const patientId = await upsertPatient(item.payload.patientInfo);
        if (item.payload.reportId) {
          await updateReport(item.payload.reportId, {
            patient_id: patientId,
            final_data: item.payload.finalData,
            report_status: 'final',
            finalized_at: new Date().toISOString(),
            draft_data: null
          });
        } else {
          await createReport({
            report_number: item.payload.reportNumber,
            patient_id: patientId,
            report_type: item.payload.reportType,
            report_status: 'final',
            final_data: item.payload.finalData,
            finalized_at: new Date().toISOString()
          });
        }
      }
      removeFromSyncQueue(item.id);
    } catch (err) {
      console.error('Sync failed for item:', item.id, err);
      break; // stop on failure, retry later
    }
  }
  updateStatusDisplay();
  syncInProgress = false;
}

export function queueOperation(type, payload) {
  addToSyncQueue({ type, payload });
  updateStatusDisplay();
  if (isOnline) processQueue();
}