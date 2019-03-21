import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { navigate } from '../services/utilities';
import BigNumber from 'bignumber.js';

StorePromise.then((Store) => {
    customElement('pc-player', ({ constructing, update, element }) => {
    
        if (constructing) {
            Store.subscribe(update);
        }
        
        const state = Store.getState() as any;
        const currentEpisode = state.episodes[state.currentEpisodeGuid];
        const currentPodcast = currentEpisode ? state.podcasts[currentEpisode.podcastId] : null;
    
        if ('mediaSession' in window.navigator) {
            (window.navigator as any).mediaSession.metadata = new MediaMetadata({
                title: currentEpisode.title,
                // artwork: [
                //     {
                //         src: currentPodcast.imageUrl,
                //         sizes: '60x60',
                //         type: 'image/jpg'
                //     }
                // ] // TODO I can't get the artwork to work, not sure why
            });
    
            (window.navigator as any).mediaSession.setActionHandler('play', () => {
                // const audioElement = element.querySelector('audio');
                // if (audioElement && currentEpisode) {
                //     audioElement.play();
                // }
                // TODO perhaps we want to make a new action type that plays the currenty episode?
                // Store.dispatch({
                //     type: 'PLAY_EPISODE_FROM_PLAYLIST',
                //     playlistIndex: (Store.getState() as any).currentPlaylistIndex
                // });
                Store.dispatch({
                    type: 'CURRENT_EPISODE_PLAYED'
                });
            });
            
            (window.navigator as any).mediaSession.setActionHandler('pause', () => {
                // const audioElement = element.querySelector('audio');
                // if (audioElement) {
                //     audioElement.pause();
                // }
                // Store.dispatch({
                //     type: 'PAUSE_EPISODE_FROM_PLAYLIST'
                // });
                Store.dispatch({
                    type: 'CURRENT_EPISODE_PAUSED'
                });
            });
            
            (window.navigator as any).mediaSession.setActionHandler('seekbackward', () => {
                const audioElement = element.querySelector('audio');
                if (audioElement) {
                    audioElement.currentTime = audioElement.currentTime - 10;
                }
            });
            
            (window.navigator as any).mediaSession.setActionHandler('seekforward', () => {
                const audioElement = element.querySelector('audio');
                if (audioElement) {
                    audioElement.currentTime = audioElement.currentTime + 10;
                }
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

        // TODO this might be necessary so that the src gets set first when switching episodes
        // TODO the src gets set, then we click play on a new episode
        setTimeout(() => {
            const state: Readonly<State> = Store.getState();
            const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];

            const audioElement: HTMLAudioElement | null = element.querySelector('audio');
            
            if (
                audioElement &&
                currentEpisode
            ) {
                if (currentEpisode.playing === true) {
                    audioElement.play();    
                }
    
                if (currentEpisode.playing === false) {
                    audioElement.pause();
                }
            }
        });
    
        return html`
            <style>
                .pc-player-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    background-color: white;
                    padding: calc(10px + 1vmin);
                    box-shadow: inset 0px 5px 5px -5px grey;
                }
    
                .pc-player-play-icon {
                    font-size: calc(50px + 1vmin);
                }
            </style>
    
            <div class="pc-player-container">
                <div style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1"></div>
                <div style="width: ${getProgressPercentage(element)}%; position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(1, 1, 1, .1); z-index: -1"></div>
                <!-- <i 
                    class="material-icons pc-player-play-icon"
                >
                    skip_previous
                </i> -->

                <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center">
                    <div style="font-size: calc(10px + 1vmin);">${secondsToHoursMinutesSeconds(currentEpisode ? currentEpisode.progress : 0)}</div>
                    <div><hr style="width: 100%"></div>
                    <div style="font-size: calc(10px + 1vmin);">${getDuration(element)}</div>
                </div>

                <div style="flex: 2; display: flex; align-items: center; justify-content: center">
                    <i 
                        class="material-icons pc-player-play-icon"
                        @click=${() => skipBack(element)}
                    >
                        fast_rewind
                    </i>

                    ${
                        Store.getState().playerPlaying ? 
                        html`
                            <i 
                                class="material-icons pc-player-play-icon"
                                @click=${paused}
                            >
                                pause
                            </i>
                        ` :
                        html`
                            <i 
                                class="material-icons pc-player-play-icon"
                                @click=${played}
                            >
                                play_arrow
                            </i>
                        `
                    }

                    <i 
                        class="material-icons pc-player-play-icon"
                        @click=${() => skipForward(element)}
                    >
                        fast_forward
                    </i>

                    <!-- <i 
                        class="material-icons pc-player-play-icon"
                    >
                        skip_next
                    </i> -->
                </div>

                <div style="flex: 1; display: flex; justify-content: center; align-items: center">
                    <select @change=${playbackRateChanged} style="border: none;">
                        <option value=".25" ?selected=${Store.getState().playbackRate === '.25'}>.25x</option>
                        <option value=".5" ?selected=${Store.getState().playbackRate === '.5'}>.5x</option>
                        <option value=".75" ?selected=${Store.getState().playbackRate === '.75'}>.75x</option>
                        <option value="1" ?selected=${Store.getState().playbackRate === '1'}>1x</option>
                        <option value="1.25" ?selected=${Store.getState().playbackRate === '1.25'}>1.25x</option>
                        <option value="1.5" ?selected=${Store.getState().playbackRate === '1.5'}>1.5x</option>
                        <option value="1.75" ?selected=${Store.getState().playbackRate === '1.75'}>1.75x</option>
                        <option value="2" ?selected=${Store.getState().playbackRate === '2'}>2x</option>
                    </select>
                </div>

            </div>

            <audio
                src="${currentEpisode ? currentEpisode.src : ''}"
                preload="metadata"
                @ended=${audioEnded}
                @timeupdate=${timeUpdated}
                @loadstart=${() => loadStarted(currentEpisode, element)}
                .playbackRate=${(Store.getState() as any).playbackRate}
            ></audio>
        `;
    });

    function getProgressPercentage(element: any) {
        const audioElement = element.querySelector('audio');
        if (audioElement && !isNaN(audioElement.duration) && !isNaN(audioElement.currentTime)) {
            return (audioElement.currentTime / audioElement.duration) * 100;
        }
        else {
            return 0;
        }
    }

    function getDuration(element: any) {
        const audioElement = element.querySelector('audio');
        if (
            audioElement &&
            !isNaN(audioElement.duration)
        ) {
            return secondsToHoursMinutesSeconds(audioElement.duration);
        }
    }

    function secondsToHoursMinutesSeconds(seconds: any) {
        const hours = Math.floor(seconds / 3600);
        const hoursRemainder = seconds % 3600;
        const minutes = Math.floor(hoursRemainder / 60);
        const totalSeconds = Math.floor(hoursRemainder % 60);

        return `${hours === 0 ? '' : `${hours}:`}${minutes < 10 ? `0${minutes}` : minutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`;
    }

    function playbackRateChanged(e: any) {
        console.log(e)
        Store.dispatch({
            type: 'SET_PLAYBACK_RATE',
            playbackRate: e.target.value
        });
    }

    function skipBack(element: any) {
        const audioElement = element.querySelector('audio');
        if (audioElement) {
            audioElement.currentTime = audioElement.currentTime - 10;
        }
    }

    function skipForward(element: any) {
        const audioElement = element.querySelector('audio');
        if (audioElement) {
            audioElement.currentTime = audioElement.currentTime + 10;
        }
    }
    
    function audioEnded() {
        Store.dispatch({
            type: 'CURRENT_EPISODE_COMPLETED'
        });

        if (Store.getState().currentRoute.pathname === '/playlist') {
            const episode: Readonly<Episode> = Store.getState().episodes[Store.getState().currentEpisodeGuid];
            navigate(Store, `/playlist?feedUrl=${episode.feedUrl}&episodeGuid=${episode.guid}`);
        }
    }
    
    function timeUpdated(e: any) {
        const progress = e.target.currentTime;
    
        if (progress === 0) {
            return;
        }

        if (e.target.paused) {
            return;
        }
    
        Store.dispatch({
            type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
            progress: new BigNumber(progress).toString()
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
    
    function loadStarted(currentEpisode: any, element: any) {
        if (currentEpisode === null || currentEpisode === undefined) {
            return;
        }

        const audioElement = element.querySelector('audio');
        audioElement.currentTime = currentEpisode.progress;

        // if (currentEpisode.playing) {
        //     audioElement.play();
        // }
    }

    // function togglePlaybackRateMenu() {
    //     Store.dispatch({
    //         type: 'TOGGLE_PLAYBACK_RATE_MENU'
    //     });
    // }
});
