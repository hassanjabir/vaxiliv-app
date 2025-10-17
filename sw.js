const CACHE_NAME = 'vaxiliv-cache-v4'; // Updated the version number to trigger refresh

// The list of all essential files for your app to work offline
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    
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
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

// Install event: opens the cache and adds the files to it
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching app shell');
                // Use fetch with no-cors for CDN requests to prevent opaque responses blocking cache.addAll
                const cachePromises = urlsToCache.map(urlToCache => {
                    const request = new Request(urlToCache, { mode: 'no-cors' });
                    return fetch(request).then(response => cache.put(urlToCache, response));
                });

                return Promise.all(cachePromises)
                    .catch(error => console.error('Failed to cache one or more resources:', error));
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
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event: implements a "Network falling back to cache" strategy
self.addEventListener('fetch', event => {
    // We only want to apply this strategy to GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Clone the response to put it in the cache and also return it to the browser
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                return networkResponse;
            })
            .catch(() => {
                // If the network request fails (e.g., offline), try to get it from the cache
                return caches.match(event.request);
            })
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    event.notification.close(); // Close the notification

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            const appUrl = new URL('./index.html#schedules', self.location.origin).href;
            
            // If the app window is already open, focus it and navigate
            for (const client of clientList) {
                if (client.url === appUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow(appUrl);
            }
        })
    );
});


