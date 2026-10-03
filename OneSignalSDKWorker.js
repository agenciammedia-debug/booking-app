importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_APP = 'booking-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Solo páginas de la app: red primero, copia guardada si no hay internet
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.mode !== 'navigate') return;
  const u = new URL(req.url); u.search = '';
  const clave = u.toString();
  e.respondWith(
    fetch(req)
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE_APP).then(c => c.put(clave, copia));
        return res;
      })
      .catch(() => caches.match(clave))
  );
});
