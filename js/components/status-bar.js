// ============================================================
// STATUS BAR COMPONENT
// ============================================================

import { getState } from '../core/state.js';
import { initSyncMonitor, isAppOnline } from '../services/sync.js';

export function initStatusBar() {
  initSyncMonitor();
  
  // Listen for dirty state changes
  document.addEventListener('state:change', (e) => {
    if (e.detail.key === 'isDirty') {
      const indicator = document.getElementById('draft-indicator');
      if (indicator) {
        indicator.style.display = e.detail.newValue ? '' : 'none';
      }
    }
  });

  // Initial check
  const indicator = document.getElementById('draft-indicator');
  if (indicator) indicator.style.display = 'none';
}