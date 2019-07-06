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
    customElement('pc-player', async ({ constructing, update, element }) => {
    
        if (constructing) {
            Store.subscribe(update);
        }

        const state: Readonly<State> = Store.getState();
        const audioElement: HTMLAudioElement | null = element.querySelector('audio');
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const currentPodcast: Readonly<Podcast> = state.podcasts[currentEpisode.feedUrl];

        setupMediaNotification(currentPodcast, currentEpisode, audioElement);
        await handleEpisodeSwitching(state, audioElement, currentEpisode);
        await playOrPause(audioElement, currentEpisode);

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
                    <div style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1;">
                        <input @input=${(e: any) => timeSliderOnInput(e, element)} type="range" style="width: 100%; position: absolute; top: 0; height: 0" min="0" max="${getDuration(element)}" .value=${currentEpisode ? currentEpisode.progress : '0'}>
                    </div>
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
                            @click=${() => skipBack(audioElement)}
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
                            @click=${() => skipForward(audioElement)}
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
                preload="metadata"
                @loadeddata=${() => loadedData(audioElement, currentEpisode)}
                @ended=${audioEnded}
                @timeupdate=${timeUpdated}
                .playbackRate=${parseInt(Store.getState().playbackRate)}
            ></audio>
        `;
    });

    function setupMediaNotification(
        currentPodcast: Readonly<Podcast>,
        currentEpisode: Readonly<Episode>,
        audioElement: HTMLAudioElement | null
    ): void {

        const navigator = window.navigator as any;

        if (
            navigator.mediaSession !== null &&
            navigator.mediaSession !== undefined
        ) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentEpisode.title,
                artist: currentPodcast.artistName,
                album: currentPodcast.title,
                artwork: [
                    {
                        src: currentPodcast.imageUrl
                    }
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                Store.dispatch({
                    type: 'CURRENT_EPISODE_PLAYED'
                });
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                Store.dispatch({
                    type: 'CURRENT_EPISODE_PAUSED'
                });
            });

            navigator.mediaSession.setActionHandler('seekbackward', () => {
                skipBack(audioElement);
            });

            navigator.mediaSession.setActionHandler('seekforward', () => {
                skipForward(audioElement);                
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                Store.dispatch({
                    type: 'PLAY_PREVIOUS_EPISODE'
                });
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                Store.dispatch({
                    type: 'PLAY_NEXT_EPISODE'
                });
            });
        }
    }

    async function handleEpisodeSwitching(state: Readonly<State>, audioElement: HTMLAudioElement | null, currentEpisode: Readonly<Episode>): Promise<void> {
        const currentEpisodeGuid: EpisodeGuid = state.currentEpisodeGuid;
        const previousEpisodeGuid: EpisodeGuid = state.previousEpisodeGuid;
        const episodeChanged: boolean = currentEpisodeGuid !== previousEpisodeGuid;
        
        if (episodeChanged) {
            if (audioElement) {
                audioElement.pause();
                audioElement.src = ''; // TODO not sure if this is necessary, but it works for now. Try getting rid of it and see if the previous episode plays while switching episodes

                Store.dispatch({
                    type: 'SET_PREVIOUS_EPISODE_GUID',
                    previousEpisodeGuid: currentEpisodeGuid
                });

                const audioSrc: string = await getAudioSrc(currentEpisode);

                audioElement.src = audioSrc;
                audioElement.currentTime = parseInt(currentEpisode.progress);
            }
        }
    }

    function loadedData(audioElement: Readonly<HTMLAudioElement> | null, currentEpisode: Readonly<Episode>) {
        playOrPause(audioElement, currentEpisode);
    }

    async function playOrPause(audioElement: Readonly<HTMLAudioElement> | null, currentEpisode: Readonly<Episode>) {
        try {
            if (
                audioElement &&
                currentEpisode.playing === true
            ) {
                await audioElement.play();
                
            }
    
            if (
                audioElement &&
                currentEpisode.playing === false
            ) {
                audioElement.pause();
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    async function getAudioSrc(episode: Readonly<Episode>): Promise<string> {

        // TODO I do not know if the types are correct here
        const arrayBuffer: Uint8Array = await get(`${episode.guid}-audio-file-array-buffer`);

        if (arrayBuffer) {
            // TODO I think we are going to want to release these blobs eventaully...it doesn't seem to be making a difference currently though
            // window.URL.revokeObjectURL(previousSrc);

            const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

            return window.URL.createObjectURL(blob);
        }
        else {
            return episode.src;
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
            type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
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

    function skipBack(audioElement: HTMLAudioElement | null): void {
        if (audioElement) {
            audioElement.currentTime = audioElement.currentTime - 10;
        }
    }

    function skipForward(audioElement: HTMLAudioElement | null): void {
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
});
    
        // if (
        //     'mediaSession' in window.navigator &&
        //     theCurrentEpisode
        // ) {

        //     (window.navigator as any).mediaSession.setActionHandler('seekbackward', () => {
        //         const audioElement = element.querySelector('audio');
        //         if (audioElement) {
        //             audioElement.currentTime = audioElement.currentTime - 10;
        //         }
        //     });
            
        //     (window.navigator as any).mediaSession.setActionHandler('seekforward', () => {
        //         const audioElement = element.querySelector('audio');
        //         if (audioElement) {
        //             audioElement.currentTime = audioElement.currentTime + 10;
        //         }
        //     });
        //     // navigator.mediaSession.setActionHandler('previoustrack', () => {
        //     //     Store.dispatch({
        //     //         type: 'PLAY_EPISODE_FROM_PLAYLIST',
        //     //         playlistIndex: Store.getState().playlistIndex + 1
        //     //     });
        //     // });
        //     // navigator.mediaSession.setActionHandler('nexttrack', () => {
        //     //     Store.dispatch({
        //     //         type: 'PLAY_EPISODE_FROM_PLAYLIST',
        //     //         playlistIndex: Store.getState().playlistIndex - 1
        //     //     });
        //     // });
        // }