const CACHE_NAME = 'myhealthcheckup-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png',
  '/lovable-uploads/b3d139bc-e5b4-4c1e-ab5f-fc110e1d2ed5.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});