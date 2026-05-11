// service-worker.js – PWA for ZUC Ultrasound Reports
// Version: change this string whenever you deploy a new build
const VERSION = 'v1';
const BASE = '/';
const CACHE_NAME = `zuc-reports-${VERSION}`;

// ----- Pre‑cache critical app shell files -----
const PRE_CACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/css/style.css`,
  `${BASE}/css/layout.css`,
  `${BASE}/css/forms.css`,
  `${BASE}/css/print.css`,
  `${BASE}/assets/logo.png`,
  `${BASE}/manifest.json`
];

// ----- Install: pre‑cache and force waiting SW to activate -----
self.addEventListener('install', event => {
  console.log(`[SW] Installing version ${VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRE_CACHE))
      .then(() => self.skipWaiting())   // activate immediately
  );
});

// ----- Activate: clean up old caches -----
self.addEventListener('activate', event => {
  console.log(`[SW] Activating version ${VERSION}`);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim()) // take control of all pages
  );
});

// ----- Fetch: handle navigation, static assets, and offline fallback -----
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non‑GET & chrome‑extension / Supabase API requests
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;  // skip chrome extensions etc.
  if (url.hostname.includes('supabase.co')) return; // let API calls pass through

  // ----- 1. Navigation requests -> Network first, fallback to cached app shell -----
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Successful fetch – cache a clone for offline fallback
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return networkResponse;
        })
        .catch(() => caches.match(`${BASE}/index.html`))  // fallback
    );
    return;
  }

  // ----- 2. Static assets (CSS, JS, images, fonts, etc.) -> Cache first -----
  event.respondWith(
    caches.match(request)
      .then(cached => {
        const fetched = fetch(request)
          .then(response => {
            // Update cache with fresh copy
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
            return response;
          })
          .catch(() => cached);   // if network fails, return cached
        return cached || fetched;
      })
  );
});

// ----- Notify all clients when a new version is waiting -----
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Notify the user the moment a new SW is ready
self.addEventListener('updatefound', () => {
  const newWorker = self.registration.installing;
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && self.registration.waiting) {
      // Send a message to all clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'NEW_VERSION' }));
      });
    }
  });
});