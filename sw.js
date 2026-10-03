/* Oceanum — service worker: abre instantaneamente e funciona sem internet. */
const V = 'oceanum-5d7b92ab34';
const SHELL = ["./","index.html","manifest.webmanifest","apple-touch-icon.png","icon-192.png","icon-512.png","icon-maskable-512.png"];
const IMG = 'oceanum-img'; // fotos dos exercícios e dos alimentos: guardadas para funcionarem sem internet
const IMGHOST = /(^|\.)(jsdelivr\.net|themealdb\.com|openfoodfacts\.org|wikimedia\.org)$/;
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== IMG).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET') return;
  if (IMGHOST.test(u.hostname) && /\.(jpe?g|png|webp)$/i.test(u.pathname)) { e.respondWith(caches.open(IMG).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; })))); return; }
  if (u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => { const net = fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); } return r; }).catch(() => hit); return hit || net; }));
});
