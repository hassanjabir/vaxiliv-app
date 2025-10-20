// A unique name for the cache. Using a version number helps in managing updates.
const CACHE_NAME = 'vaxiliv-cache-v1.1';

// A list of all the essential files your app needs to work offline.
// This is the "app shell".
const urlsToCache = [
  './',
  './index.html',

  // External CDN assets
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  
  // Local Assets: Images & Icons
  'assets/images/logo.png',
  'assets/images/background-blurred.jpg',
  'assets/images/amr_visual.jpg',
  'assets/images/about_hero.jpg',
  'assets/images/icons/icon-192.png',
  'assets/images/icons/vet-map-pin.png',
  'assets/images/animals/cat.png',
  'assets/images/animals/chicken.png',
  'assets/images/animals/cow.png',
  'assets/images/animals/dog.png',
  'assets/images/animals/goat.png',
  'assets/images/animals/pig.png',
  'assets/images/animals/sheep.png',
  'assets/images/animals/sheep_goat.png'
];

// --- INSTALL Event ---
// This event runs when the service worker is first installed.
// It opens the cache and adds all the app shell files to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache. Caching app shell files...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache app shell:', err);
      })
  );
});

// --- ACTIVATE Event ---
// This event is triggered after the 'install' event and when the service worker becomes active.
// Its main job is to clean up old, unused caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache's name is different from our current CACHE_NAME, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// --- FETCH Event ---
// This is the most important part. It intercepts every network request made by the app.
// It uses a "cache-first" strategy.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. If we find a matching response in the cache, return it immediately.
        if (response) {
          return response;
        }

        // 2. If it's not in the cache, try to fetch it from the network.
        return fetch(event.request)
          .then(networkResponse => {
            // Check if we received a valid response from the network.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response because a response is a "stream" and can only be consumed once.
            // We need one copy for the cache and one to send to the browser.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Add the new response to the cache for next time.
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(error => {
            // This happens when the fetch fails (e.g., user is offline and the item wasn't cached).
            // You can optionally return a fallback page here, like an "offline.html" page.
            console.error('Fetch failed; user is likely offline.', error);
            // For now, it will just result in the standard browser offline error.
          });
      })
  );
});