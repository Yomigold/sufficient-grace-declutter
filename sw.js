/* Ledgr service worker — network-first app shell with offline fallback */
const CACHE = 'ledgr-v3';
const ASSETS = [
  '/index.html', '/inventory.html', '/add.html', '/lookup.html',
  '/notifications.html', '/settings.html', '/login.html',
  '/style.css', '/ledgr.js', '/manifest.webmanifest', '/icon.svg',
];

self.addEventListener('install', e => {
  // Do NOT skipWaiting — the page will prompt the user first
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

// Allow the page to trigger the takeover after the user taps "Update"
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Never cache API calls — always hit the network.
  if (url.pathname.startsWith('/api/')) return;
  // Network-first so fresh deploys win; fall back to cache offline.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
  );
});
