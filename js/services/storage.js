// ============================================================
// LOCAL STORAGE SERVICE (OFFLINE SUPPORT)
// ============================================================

const KEYS = {
  DRAFT: 'usg_current_draft',
  QUEUE: 'usg_sync_queue',
  SETTINGS: 'usg_local_settings',
  HISTORY_CACHE: 'usg_history_cache',
  LAST_SYNC: 'usg_last_sync',
};

export function saveLocalDraft(state) {
  try {
    localStorage.setItem(KEYS.DRAFT, JSON.stringify({
      reportType: state.reportType,
      scanTypeTitle: state.scanTypeTitle,
      reportId: state.reportId,
      reportNumber: state.reportNumber,
      reportStatus: state.reportStatus,
      patientInfo: state.patientInfo,
      values: state.values,
      impression: state.impression,
      additionalNotes: state.additionalNotes,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.warn('Failed to save local draft:', e);
  }
}

export function loadLocalDraft() {
  try {
    const raw = localStorage.getItem(KEYS.DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearLocalDraft() {
  localStorage.removeItem(KEYS.DRAFT);
}

export function addToSyncQueue(operation) {
  const queue = getSyncQueue();
  queue.push({ ...operation, id: Date.now(), timestamp: new Date().toISOString() });
  localStorage.setItem(KEYS.QUEUE, JSON.stringify(queue));
}

export function getSyncQueue() {
  try {
    const raw = localStorage.getItem(KEYS.QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function clearSyncQueue() {
  localStorage.removeItem(KEYS.QUEUE);
}

export function removeFromSyncQueue(id) {
  let queue = getSyncQueue();
  queue = queue.filter(item => item.id !== id);
  localStorage.setItem(KEYS.QUEUE, JSON.stringify(queue));
}

export function cacheHistory(records) {
  try {
    localStorage.setItem(KEYS.HISTORY_CACHE, JSON.stringify(records));
  } catch { /* ignore */ }
}

export function getCachedHistory() {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY_CACHE);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function setLastSync() {
  localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
}

export function getLastSync() {
  return localStorage.getItem(KEYS.LAST_SYNC);
}