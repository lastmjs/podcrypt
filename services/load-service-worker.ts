// TODO put the service worker back in once we figure out caching, 206, Range header, and playback issues
if ('serviceWorker' in window.navigator) {
    window.addEventListener('load', async () => {
        try {     
            await window.navigator.serviceWorker.register('/service-worker.ts');
            console.log('service worker registration successful');
        }
        catch(error) {
            console.log(error);
        }
    });
}