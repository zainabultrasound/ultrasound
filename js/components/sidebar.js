// ============================================================
// SIDEBAR COMPONENT
// ============================================================

import { on } from '../core/events.js';
import { getTemplateCategories } from '../templates/registry.js';
import { loadScan } from '../router.js';

export function initSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const categories = getTemplateCategories();

  nav.innerHTML = '';
  for (const [cat, scans] of Object.entries(categories)) {
    const catDiv = document.createElement('div');
    catDiv.className = 'sidebar-category';
    catDiv.innerHTML = `<h3 class="sidebar-cat-title">${cat}</h3>`;
    const ul = document.createElement('ul');
    ul.className = 'sidebar-scan-list';
    scans.forEach(scan => {
      const li = document.createElement('li');
      li.textContent = scan.title;
      li.dataset.scanId = scan.id;
      li.className = 'sidebar-scan-item';
      ul.appendChild(li);
    });
    catDiv.appendChild(ul);
    nav.appendChild(catDiv);
  }

  // Event delegation for scan selection
  on(nav, 'click', '.sidebar-scan-item', (e, el) => {
    const scanId = el.dataset.scanId;
    // Highlight active
    nav.querySelectorAll('.sidebar-scan-item').forEach(li => li.classList.remove('active'));
    el.classList.add('active');
    loadScan(scanId);
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });

  // Mobile toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }
}