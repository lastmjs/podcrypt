// TODO zwitterion needs to change to not say window.process, use self.process or something like that

const CACHE_NAME = 'PODCRYPT_CACHE_V1';
const urlsToCache = [
    '/',
    '/index.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache', cache);
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
        .match(event.request)
        .then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});