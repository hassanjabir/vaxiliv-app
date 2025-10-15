const CACHE_NAME = 'vaxiliv-cache-v2'; // We've updated the version number

// The list of all essential files for your app to work offline
const urlsToCache = [
    './',
    './index.html',
    './sw.js',
    
    // Your local images and icons
    './assets/images/logo.svg',
    './assets/images/animals/dog.svg',
    './assets/images/animals/cat.svg',
    './assets/images/animals/cow.svg',
    './assets/images/animals/goat.svg',
    './assets/images/animals/sheep.svg',
    './assets/images/animals/chicken.svg',
    './assets/images/animals/camel.svg',
    './assets/images/animals/donkey.svg',
    './assets/images/animals/turkey.svg',
    './assets/images/animals/duck.svg',
    './assets/images/icons/vet.svg',
    './assets/images/icons/medicine.svg',
    './assets/images/icons/vaccine.svg',
    './assets/images/icons/hygiene.svg',
    './assets/images/icons/amr-bacteria.svg',
    './assets/images/icons/vet-map-pin.svg',
    './assets/images/icons/icon-192.png',
    './assets/images/icons/icon-512.png',

    // External files from CDNs
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event: opens the cache and adds the files to it
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event: clean up old, unused caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: serves files from cache first, then falls back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the file is in the cache, return it.
                if (response) {
                    return response;
                }
                // Otherwise, fetch it from the network.
                return fetch(event.request);
            })
    );
});

