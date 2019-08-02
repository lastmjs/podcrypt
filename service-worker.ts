// TODO zwitterion needs to change to not say window.process, use self.process or something like that

const CACHE_NAME = 'PODCRYPT_CACHE_V9';
const urlsToCache = [
    '/index.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(urlsToCache);
        });
    );
});

self.addEventListener('fetch', (event) => {
    // TODO Figure out why audio requests have a destination of video
    // We do not respond to media requests because service workers don't currently support Range headers or 206 partial content responses
    
    console.log('event.request.url', event.request.url);

    if (
        event.request.url.includes('index.html') ||
        event.request.url.startsWith('https://proxy.podcrypt.app/')
    ) {
        console.log('attempting to return from cache')

        const rangeHeader = event.request.headers.get('range');

        console.log('rangeHeader', rangeHeader);

        // TODO I got some good help from here: https://philna.sh/blog/2018/10/23/service-workers-beware-safaris-range-request/
        // TODO and here: https://github.com/philnash/philna.sh/blob/ba798a2d5d8364fc7c1dae1819cbd8ef103c8b67/sw.js#L50-L94
        // TODO I am not sure if it's enough to apply the MIT license, but we'll see
        event.respondWith(
            caches
            .match(event.request)
            .then((response) => {
                if (response) {
                    if (rangeHeader) {
                        return response.arrayBuffer().then((arrayBuffer) => {
                            const bytes = rangeHeader.replace('bytes=', '').split('-');
                            const start = bytes[0];
                            const end = bytes[1] || arrayBuffer.byteLength - 1;

                            return new Response(arrayBuffer.slice(start, end + 1), {
                                status: 206,
                                statusText: 'Partial Content',
                                headers: [
                                    ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
                                ]
                            });
                        });
                    }
                    else {
                        return response;
                    }
                }

                return fetch(event.request);
            })
        );

    }

    // const cachedResponse = await caches.match(event.request);

    // if (cachedResponse) {
    //     event.respondWith(cachedResponse);
    // }
    
    // if (
    //     event.request.destination !== 'audio' &&
    //     event.request.destination !== 'video' &&
    //     !event.request.url.includes('.mp3') &&
    //     !event.request.url.includes('.m4a')
    // ) {
    //     event.respondWith(
    //         caches
    //         .match(event.request)
    //         .then((response) => {
    //             if (response) {
    //                 return response;
    //             }
    //             return fetch(event.request);
    //         })
    //     );
    // }
});