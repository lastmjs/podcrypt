import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { navigate } from '../services/utilities';
import BigNumber from 'bignumber.js';
import {
    pxXXLarge,
    pxXLarge
} from '../services/css';
import { get } from 'idb-keyval';

StorePromise.then((Store) => {
    customElement('pc-player', ({ constructing, update, element, props }) => {
    
        if (constructing) {
            Store.subscribe(update);

            return {
                src: '',
                currentEpisode: null
            };
        }
        
        const state: Readonly<State> = Store.getState();
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const currentPodcast: Readonly<Podcast> | null = currentEpisode ? state.podcasts[currentEpisode.feedUrl] : null;
    
        if (
            'mediaSession' in window.navigator &&
            currentEpisode
        ) {
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

        if (
            currentEpisode &&
            (
                props.currentEpisode === null ||
                (
                    props.currentEpisode &&
                    currentEpisode.guid !== props.currentEpisode.guid
                )
            )
        ) {
            // TODO it would be good if update returned the props, then I could pass them into the next function
            update({
                ...props,
                currentEpisode
            });
            getSrc(currentEpisode, props, update);
        }
    
        return html`
            <style>
                .pc-player-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    background-color: white;
                    box-shadow: inset 0px 5px 5px -5px grey;
                }
    
                .pc-player-play-icon {
                    font-size: calc(50px + 1vmin);
                }

                .pc-player-backward-icon {
                    font-size: ${pxXLarge};
                    margin-right: ${pxXXLarge};
                    margin-left: ${pxXXLarge};
                }

                .pc-player-forward-icon {
                    font-size: ${pxXLarge};
                    margin-left: ${pxXLarge};
                    margin-right: ${pxXLarge};
                }
            </style>
    
            <div class="pc-player-container">

                <div style="padding: calc(10px + 1vmin); display: flex">
                    <input @input=${(e: any) => timeSliderOnInput(e, element)} type="range" style="width: 100%; position: absolute; top: 0; height: 0" min="0" max="${getDuration(element)}" .value=${currentEpisode ? currentEpisode.progress : '0'}>
                    <div style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1;"></div>
                    <div style="width: ${getProgressPercentage(element)}%; position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(1, 1, 1, .1); z-index: -1"></div>
                    <!-- <i 
                        class="material-icons pc-player-play-icon"
                    >
                        skip_previous
                    </i> -->

                    <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center; flex: 1">
                        <div style="font-size: calc(10px + 1vmin);">${currentEpisode ? secondsToHoursMinutesSeconds(currentEpisode.progress) : ''}</div>
                        <div><hr style="width: 100%"></div>
                        <div style="font-size: calc(10px + 1vmin);">${getDuration(element) ? secondsToHoursMinutesSeconds(getDuration(element)) : ''}</div>
                    </div>

                    <div style="flex: 2; display: flex; align-items: center; justify-content: center">
                        <i 
                            class="material-icons pc-player-backward-icon"
                            @click=${() => skipBack(element)}
                        >
                            replay_10
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
                            class="material-icons pc-player-forward-icon"
                            @click=${() => skipForward(element)}
                        >
                            forward_10
                        </i>

                        <!-- <i 
                            class="material-icons pc-player-play-icon"
                        >
                            skip_next
                        </i> -->
                    </div>

                    <div style="flex: 1; display: flex; justify-content: center; align-items: center">
                        <select @change=${playbackRateChanged} style="border: none; background-color: transparent">
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


            </div>

            <audio
                src="${props.src}"
                preload="metadata"
                @ended=${audioEnded}
                @timeupdate=${timeUpdated}
                @loadstart=${() => loadStarted(currentEpisode, element)}
                .playbackRate=${parseInt(Store.getState().playbackRate)}
            ></audio>
        `;
    });

    async function getSrc(currentEpisode: Readonly<Episode>, props: any, update: any) {
        if (currentEpisode) {
            // TODO I do not know if the types are correct here
            const arrayBuffer: Uint8Array = await get(`${currentEpisode.guid}-audio-file-array-buffer`);

            if (arrayBuffer) {
                window.URL.revokeObjectURL(props.src);

                const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

                update({
                    ...props,
                    currentEpisode,
                    src: window.URL.createObjectURL(blob)
                });
            }
            else {
                update({
                    ...props,
                    currentEpisode,
                    src: currentEpisode.src
                });
            }
        }
    }

    function timeSliderOnInput(e: any, element: any) {
        const progress = e.target.value;

        // TODO it would be nice to do this all through redux, as well as skipping forward and backward
        const audioElement = element.querySelector('audio');
        if (audioElement) {
            audioElement.currentTime = progress;
        }

        Store.dispatch({
            type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
            progress: new BigNumber(progress).toString()
        });
    }

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
            return audioElement.duration;
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
    
    // TODO the counter is a hacky way of doing this bit it helps for now
    // We only update the progress about once every second instead of 4 times per second
    // Dispatching an action 4 times per second was really slowing things down
    let counter = 1;
    function timeUpdated(e: any) {
        const progress = e.target.currentTime;
    
        if (progress === 0) {
            return;
        }

        if (e.target.paused) {
            return;
        }

        if (counter % 4 !== 0) {
            counter = counter + 1;
            return;
        }
        else {
            counter = 1;
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
