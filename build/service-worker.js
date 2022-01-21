const CACHE_NAME = "PODCRYPT_CACHE_V12";
const urlsToCache = [
  "/index.html"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(urlsToCache);
  }));
});
self.addEventListener("fetch", async (event) => {
  if (event.request.url.includes("index.html")) {
    event.respondWith(caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    }));
  }
  if (event.request.url.startsWith("https://proxy.podcrypt.app/downloaded/")) {
    event.respondWith(new Promise(async (resolve) => {
      const state = await idbGet("state");
      const episodeGuid = event.request.url.replace("https://proxy.podcrypt.app/downloaded/", "");
      const episode = Object.values(state.episodes).find((episode2) => {
        return episode2.src === episodeGuid;
      });
      if (episode === void 0) {
        alert("Episode was not found");
        return new Response("404 Not Found", {
          status: 404,
          statusText: "Not Found"
        });
      }
      const rangeHeader = event.request.headers.get("range");
      const totalByteLength = episode.downloadChunkData[episode.downloadChunkData.length - 1].endByte + 1;
      const bytes = rangeHeader.replace("bytes=", "").split("-");
      const startByte = parseInt(bytes[0]);
      const endByte = parseInt(bytes[1]) || totalByteLength - 1;
      const finalArrayBuffer = await getFinalArrayBuffer(episode, startByte, endByte);
      resolve(new Response(finalArrayBuffer, {
        status: 206,
        statusText: "Partial Content",
        headers: [
          ["Content-Range", `bytes ${startByte}-${endByte}/${totalByteLength}`]
        ]
      }));
    }));
  }
});
function idbGet(key) {
  return new Promise((resolve) => {
    const dbOpenRequest = indexedDB.open("keyval-store");
    dbOpenRequest.addEventListener("success", () => {
      const idb = dbOpenRequest.result;
      const dbReadRequest = idb.transaction("keyval", "readonly").objectStore("keyval").get(key);
      dbReadRequest.addEventListener("success", () => {
        resolve(dbReadRequest.result);
      });
    });
  });
}
async function getFinalArrayBuffer(episode, startByte, endByte) {
  const downloadChunkData = episode.downloadChunkData.filter((downloadChunkDatum) => {
    return startByte <= downloadChunkDatum.endByte && endByte >= downloadChunkDatum.startByte;
  });
  const downloadChunkBlobs = await Promise.all(downloadChunkData.map(async (downloadChunkDatum) => {
    return await idbGet(downloadChunkDatum.key);
  }));
  const masterBlob = new Blob(downloadChunkBlobs);
  const almostFinalArrayBuffer = await new Response(masterBlob).arrayBuffer();
  const startDownloadChunkDatum = downloadChunkData[0];
  const sliceStart = startByte - startDownloadChunkDatum.startByte;
  const sliceLength = sliceStart + endByte - startByte + 1;
  const finalArrayBuffer = almostFinalArrayBuffer.slice(sliceStart, sliceLength);
  return finalArrayBuffer;
}
