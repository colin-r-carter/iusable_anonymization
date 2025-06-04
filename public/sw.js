const CACHE_NAME = 'iusable-gliner-model-cache-v1';
const EXPECTED_URLS = [/\.onnx$/, /\.wasm$/, /\.json$/, /\.txt$/, /\.bin$/];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const reqUrl = new URL(req.url);
  const isOriginValid = reqUrl.origin === self.location.origin;
  
  if (EXPECTED_URLS.some(pattern => pattern.test(req.url)) && isOriginValid) {
    event.respondWith(
      caches.match(req).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(req).then(networkResponse => {
          if (networkResponse.ok) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(req, cloned);
            });
          }
          return networkResponse;
        }).catch(error => {
          console.error('Network fetch failed:', error);
          throw error;
        });
      })
    );
  }
});