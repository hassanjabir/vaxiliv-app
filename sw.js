// Updated sw.js file
const CACHE_NAME = 'vaxiliv-cache-v1';

// List all the essential files that need to be cached to work offline
const URLS_TO_CACHE = [
  'index3.html',
  'data.json',
  'vets.json',
  'manifest.json',
  'assets/images/logo.png',
  'assets/images/background-blurred.jpg',
  'assets/images/animals/dog.png',
  'assets/images/animals/cat.png',
  'assets/images/animals/cow.png',
  'assets/images/animals/goat.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event: This runs when the service worker is first installed.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use {cache: 'reload'} to make sure you get the latest version from the network
        return Promise.all(
            URLS_TO_CACHE.map(url => {
                return cache.add(new Request(url, {cache: 'reload'}));
            })
        );
      })
  );
});

// Fetch event: This runs for every request the app makes.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});