const CACHE_NAME = 'myhealthcheckup-v2.0.0';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const IMAGE_CACHE = 'images-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/lovable-uploads/5cc87ed3-fbf6-4b5c-8010-c4232a260a13.png',
  '/lovable-uploads/a4949588-cff7-48ae-ba93-d0040f1dd838.png'
];

// Routes to cache dynamically
const CACHEABLE_ROUTES = [
  '/compare',
  '/search',
  '/tests',
  '/how-it-works',
  '/about'
];

// Images and assets patterns
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const ASSET_EXTENSIONS = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting(); // Force activation
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isImageRequest(request)) {
    // Images: Cache first, then network
    event.respondWith(handleImageRequest(request));
  } else if (isAssetRequest(request)) {
    // CSS/JS/Fonts: Cache first, then network  
    event.respondWith(handleAssetRequest(request));
  } else if (isNavigationRequest(request)) {
    // HTML pages: Network first, then cache
    event.respondWith(handleNavigationRequest(request));
  } else if (isAPIRequest(request)) {
    // API calls: Network first, short cache
    event.respondWith(handleAPIRequest(request));
  } else {
    // Default: Network first
    event.respondWith(handleDefaultRequest(request));
  }
});

// Helper functions to determine request types
function isImageRequest(request) {
  return IMAGE_EXTENSIONS.some(ext => request.url.includes(ext)) ||
         request.destination === 'image';
}

function isAssetRequest(request) {
  return ASSET_EXTENSIONS.some(ext => request.url.includes(ext)) ||
         ['style', 'script', 'font'].includes(request.destination);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept') && request.headers.get('accept').includes('text/html'));
}

function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('supabase.co') ||
         request.url.includes('functions.supabase.co');
}

// Image handling - Cache first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Image request failed:', error);
    // Return a fallback image if available
    return caches.match('/placeholder.svg') || new Response('Image not available', { 
      status: 404, 
      statusText: 'Not Found' 
    });
  }
}

// Asset handling - Cache first strategy
async function handleAssetRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Asset request failed:', error);
    return caches.match(request) || new Response('Asset not available', { 
      status: 404, 
      statusText: 'Not Found' 
    });
  }
}

// Navigation handling - Network first strategy
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Navigation request failed, serving from cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return caches.match('/offline.html') || 
           caches.match('/') || 
           new Response('Page not available offline', { 
             status: 503, 
             statusText: 'Service Unavailable' 
           });
  }
}

// API handling - Network first with short cache
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('API request failed:', error);
    return new Response('API not available offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Default handling - Network first
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Default request failed:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response('Content not available offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

console.log('Service Worker: Enhanced version loaded and ready');