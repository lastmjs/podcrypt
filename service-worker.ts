const CACHE_NAME = 'PODCRYPT_CACHE_V10';
const urlsToCache = [
    '/index.html'
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', async (event: any) => {    
    if (
        event.request.url.includes('index.html')
    ) {
        event.respondWith(
            caches
            .match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                else {
                    return fetch(event.request);
                }
            }));
    }

    // TODO I got some good help from here: https://philna.sh/blog/2018/10/23/service-workers-beware-safaris-range-request/
    // TODO and here: https://github.com/philnash/philna.sh/blob/ba798a2d5d8364fc7c1dae1819cbd8ef103c8b67/sw.js#L50-L94
    // TODO and here: https://stackoverflow.com/questions/54138601/cant-access-arraybuffer-on-rangerequest
    // TODO I am not sure if it's enough to apply the MIT license, but we'll see
    if (
        event.request.url.startsWith('https://download.podcrypt.app/')
    ) {
        event.respondWith(new Promise(async (resolve) => {
                const state: Readonly<State> = await idbGet('state');
                const episodeGuid: EpisodeGuid = event.request.url.replace('https://download.podcrypt.app/', '');
                const episode: Readonly<Episode> | undefined = Object.values(state.episodes).find((episode: Readonly<Episode>) => {
                    return episode.src === episodeGuid;
                });

                if (episode === undefined) {
                    alert('Episode was not found');
                    return new Response('404 Not Found', {
                        status: 404,
                        statusText: 'Not Found'
                    });
                }
        
                const rangeHeader = event.request.headers.get('range');
    
                const totalByteLength: number = episode.downloadChunkData[episode.downloadChunkData.length - 1].endByte + 1;
    
                const fiveMegabytesInBytes: number = 5242880;
                const bytes = rangeHeader.replace('bytes=', '').split('-');
                const startByte: number = parseInt(bytes[0]);
                const endByte: number = parseInt(bytes[1]) || (startByte + fiveMegabytesInBytes - 1 < totalByteLength - 1) ? startByte + fiveMegabytesInBytes - 1 : totalByteLength - 1;
        
                const finalArrayBuffer: ArrayBuffer = await getFinalArrayBuffer(
                    episode,
                    startByte,
                    endByte
                );

                // TODO are we going to have to deal with the mime type at all? I think we should store the arraybuffer in indexeddb...but will the audio element be able to know the mime type just from the file extension?
                resolve(new Response(finalArrayBuffer, {
                    status: 206,
                    statusText: 'Partial Content',
                    // headers: response.headers
                    headers: [
                        // ['Content-Type', response.headers.get('Content-Type')],
                        // ['Content-Type', 'audio/mpeg'],
                        ['Content-Range', `bytes ${startByte}-${endByte}/${totalByteLength}`],
                        // ['Content-Length', `${slicedBuffer.byteLength}`]
                    ]
                }));

            }));
    }
});

// TODO I am mostly using this because modules are not yet supported in workers...otherwise I would use the idb-keyval package
// TODO though, it isn't that hard to make my own quick abstraction like this here, it might be better to just use my own in the future to get rid of the dependency
// TODO it would be nice to use async/await directly in here...not sure if I can
function idbGet(key: string): Promise<any> {
    return new Promise((resolve) => {

        const dbOpenRequest = indexedDB.open('keyval-store');
        
        dbOpenRequest.addEventListener('success', () => {
            const idb = dbOpenRequest.result;
            
            const dbReadRequest = 
                idb
                .transaction('keyval', 'readonly')
                .objectStore('keyval')
                .get(key);

            dbReadRequest.addEventListener('success', () => {
                resolve(dbReadRequest.result);
            });            
        });
    });
}

// TODO this function needs some work...the indeces and everything do not seem exactly right
// TODO at the end of an episode things are getting wonky
async function getFinalArrayBuffer(
    episode: Readonly<Episode>,
    startByte: number,
    endByte: number
): Promise<ArrayBuffer> {

    const downloadChunkData: ReadonlyArray<DownloadChunkDatum> = episode.downloadChunkData.filter((downloadChunkDatum: Readonly<DownloadChunkDatum>) => {
        return (
            startByte < downloadChunkDatum.endByte &&
            endByte >= downloadChunkDatum.startByte
        );
    });

    const downloadChunkBlobs: Array<Blob> = await Promise.all(downloadChunkData.map(async (downloadChunkDatum) => {
        return await idbGet(downloadChunkDatum.key);
    }));

    const masterBlob: Blob = new Blob(downloadChunkBlobs);

    const almostFinalArrayBuffer: ArrayBuffer = await new Response(masterBlob).arrayBuffer();

    const startDownloadChunkDatum: Readonly<DownloadChunkDatum> = downloadChunkData[0];

    const sliceStart: number = startByte - startDownloadChunkDatum.startByte;
    const sliceLength: number = sliceStart + endByte - startByte + 1;

    const finalArrayBuffer: ArrayBuffer = almostFinalArrayBuffer.slice(sliceStart, sliceLength);

    return finalArrayBuffer;
}