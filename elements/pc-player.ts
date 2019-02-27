import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';

StorePromise.then((Store) => {
    customElement('pc-player', ({ constructing, update, element }) => {
    
        if (constructing) {
            Store.subscribe(update);
        }
        
        const state = Store.getState();
        const currentEpisode = state.episodes[state.currentEpisodeGuid];
        const currentPodcast = state.podcasts[currentEpisode.podcastId];
    
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentEpisode.title,
                artwork: [
                    {
                        src: currentPodcast.imageUrl,
                        sizes: '60x60',
                        type: 'image/jpg'
                    }
                ] // TODO I can't get the artwork to work, not sure why
            });
    
            navigator.mediaSession.setActionHandler('play', () => {
                element.querySelector('audio').play();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                element.querySelector('audio').pause();
            });
            navigator.mediaSession.setActionHandler('seekbackward', () => {
                const audioElement = element.querySelector('audio');
                audioElement.currentTime = audioElement.currentTime - 5;
            });
            navigator.mediaSession.setActionHandler('seekforward', () => {
                const audioElement = element.querySelector('audio');
                audioElement.currentTime = audioElement.currentTime + 5;
            });
            // navigator.mediaSession.setActionHandler('previoustrack', () => {
            //     Store.dispatch({
            //         type: 'PLAY_EPISODE_FROM_PLAYLIST',
            //         playlistIndex: Store.getState().playlistIndex + 1
            //     });
            // });
            // navigator.mediaSession.setActionHandler('nexttrack', () => {
            //     Store.dispatch({
            //         type: 'PLAY_EPISODE_FROM_PLAYLIST',
            //         playlistIndex: Store.getState().playlistIndex - 1
            //     });
            // });
        }
    
        return html`
            <style>
                .pc-player-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    position: fixed;
                    bottom: 2%;
                    width: 100%;
                }
    
                .pc-player-audio {
                    width: 100%;
                }
            </style>
    
            <div class="pc-player-container">
                <audio
                    class="pc-player-audio"
                    src="${currentEpisode ? currentEpisode.src : ''}"
                    @ended=${audioEnded}
                    @timeupdate=${timeUpdated}
                    @play=${played}
                    @pause=${paused}
                    @loadstart=${() => loadStarted(currentEpisode, element)}
                    controls
                    autoplay
                ></audio>
            </div>
        `;
    });
    
    function audioEnded() {
        Store.dispatch({
            type: 'CURRENT_EPISODE_COMPLETED'
        });
    }
    
    function timeUpdated(e) {
        const progress = e.target.currentTime;
    
        if (progress === 0) {
            return;
        }
    
        Store.dispatch({
            type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
            progress
        });
    }
    
    function played() {
        Store.dispatch({
            type: 'CURRENT_EPISODE_PLAYED'
        });
    }
    
    function paused() {
        Store.dispatch({
            type: 'CURRENT_EPISODE_PAUSED'
        });
    }
    
    function loadStarted(currentEpisode, element) {
        const audioElement = element.querySelector('audio');
        audioElement.currentTime = currentEpisode.progress;
    }
});