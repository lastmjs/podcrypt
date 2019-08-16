// TODO look into using a local redux store to get rid of the mutations

import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import { StorePromise } from '../state/store';
import {
    pxXXLarge,
    pxXLarge
} from '../services/css';
import BigNumber from 'bignumber.js';
import { get } from 'idb-keyval';
import {
    podcryptDownloadURL
} from '../services/utilities';

StorePromise.then((Store) => {

    class PCPlayer extends HTMLElement {

        constructor() {
            super();

            Store.subscribe(async () => {
                litRender(await this.render(Store.getState()), this);
            });
        }

        async connectedCallback() {
            
            Store.dispatch({
                type: 'RENDER'
            });

            // TODO this is just to make sure that the current episode shows up nicely in the player...do this in a faster and more deterministic way
            setTimeout(() => {
                Store.dispatch({
                    type: 'RENDER'
                })
            }, 5000);
        }

        async audioEnded(currentEpisode: Readonly<Episode>, audioElement: HTMLAudioElement) {

            Store.dispatch({
                type: 'CURRENT_EPISODE_COMPLETED'
            });

            // await this.playOrPause(currentEpisode, audioElement);
        }

        playbackRateChanged(e: Readonly<Event>) {

            if (
                e.target === null ||
                e.target === undefined
            ) {
                const message: string = 'Could not set the playback rate';
                alert(message);
                throw new Error(message);
            }

            const playbackSelect: HTMLSelectElement = e.target as HTMLSelectElement;

            Store.dispatch({
                type: 'SET_PLAYBACK_RATE',
                playbackRate: playbackSelect.value
            });
        }

        async currentTimeChanged(
            newCurrentTime: number,
            audioElement: HTMLAudioElement
        ) {
            Store.dispatch({
                type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                progress: new BigNumber(audioElement.currentTime).toString()
            });

            audioElement.currentTime = newCurrentTime;
        }

        async skipBack(
            audioElement: HTMLAudioElement
        ) {
            const newCurrentTime = audioElement.currentTime - 10 < 0 ? 0 : audioElement.currentTime - 10;
            audioElement.currentTime = newCurrentTime;
        }

        async skipForward(
            audioElement: HTMLAudioElement
        ) {
            const newCurrentTime = audioElement.currentTime + 10 >= audioElement.duration ? audioElement.duration - 1 : audioElement.currentTime + 10;
            audioElement.currentTime = newCurrentTime;
        }

        // TODO I think we need to use the lock mechanism on anything that is updating the buffer...so this funciton and currentTimeChanged, because these events are messing with that sometimes
        async timeUpdated(
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            const progress = audioElement.currentTime;
    
            if (progress === 0) {
                return;
            }
    
            if (audioElement.paused) {
                return;
            }
            
            Store.dispatch({
                type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
                progress: new BigNumber(progress).toString()
            });
        }

        played() {
            Store.dispatch({
                type: 'CURRENT_EPISODE_PLAYED'
            });
        }
        
        paused() {
            Store.dispatch({
                type: 'CURRENT_EPISODE_PAUSED'
            });
        }

        async playOrPause(
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            if (this.changingEpisodes === true) {
                return;
            }

            try {
                if (currentEpisode.playing === true) {
                    await audioElement.play();
                }

                if (currentEpisode.playing === false) {
                    audioElement.pause();
                }
            }
            catch(error) {

                // TODO I do not like having to do this, but for now it works
                // TODO switching between streaming episodes does not remember the current time without this, there is an exception thrown every time for some reason
                audioElement.currentTime = parseFloat(currentEpisode.progress);

                console.log(error);
            }
        }

        setupMediaNotification(
            currentPodcast: Readonly<Podcast>,
            currentEpisode: Readonly<Episode>,
            audioElement: Readonly<HTMLAudioElement>
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
                    this.skipBack(audioElement);
                });
    
                navigator.mediaSession.setActionHandler('seekforward', () => {
                    this.skipForward(audioElement);                
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

        async render(state: Readonly<State>): Promise<Readonly<TemplateResult>> {
                        
            const audioElement: HTMLAudioElement | null = this.querySelector('audio');
            const currentEpisode: Readonly<Episode> | undefined | null = state.episodes[state.currentEpisodeGuid];
            const currentPodcast: Readonly<Podcast> | undefined | null = currentEpisode ? state.podcasts[currentEpisode.feedUrl] : null;
            const duration: number | 'UNKNOWN' = currentEpisode && audioElement ? getDuration(audioElement) : 'UNKNOWN';            
            const progressPercentage: number | 'UNKNOWN' = currentEpisode && duration !== 'UNKNOWN' ? getProgressPercentage(currentEpisode, duration) : 'UNKNOWN';
            const progress: number | 'UNKNOWN' = currentEpisode && !isNaN(parseFloat(currentEpisode.progress)) ? parseFloat(currentEpisode.progress) : 'UNKNOWN';
            const formattedDuration: string | 'UNKNOWN' = duration !== 'UNKNOWN' ? secondsToHoursMinutesSeconds(duration) : 'UNKNOWN';
            const formattedProgress: string =  progress !== 'UNKNOWN' ? secondsToHoursMinutesSeconds(progress) : 'UNKNOWN';

            if (
                state.currentEpisodeChangedManually &&
                currentPodcast !== null &&
                currentPodcast !== undefined &&
                currentEpisode !== null &&
                currentEpisode !== undefined &&
                audioElement !== null
            ) {      
                this.changingEpisodes = true;
                
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_CHANGED_MANUALLY',
                    currentEpisodeChangedManually: false
                });
    
                audioElement.currentTime = parseFloat(currentEpisode.progress);
                this.setupMediaNotification(currentPodcast, currentEpisode, audioElement);    

                this.changingEpisodes = false;
            }
            
            if (
                currentEpisode &&
                audioElement
            ) {
                await this.playOrPause(currentEpisode, audioElement);
            }

            return html`
                <style>
                    .pc-player-container {
                        position: fixed;
                        bottom: 0;
                        width: ${state.screenType === 'DESKTOP' ? '50vw' : '100vw'};
                        background-color: white;
                        box-shadow: inset 0px 5px 5px -5px grey;
                    }
        
                    .pc-player-play-icon {
                        font-size: calc(50px + 1vmin);
                        cursor: pointer;
                    }

                    .pc-player-backward-icon {
                        font-size: ${pxXLarge};
                        margin-right: ${pxXXLarge};
                        margin-left: ${pxXXLarge};
                        cursor: pointer;
                    }

                    .pc-player-forward-icon {
                        font-size: ${pxXLarge};
                        margin-left: ${pxXLarge};
                        margin-right: ${pxXLarge};
                        cursor: pointer;
                    }
                </style>
        
                <div class="pc-player-container">

                    <div style="padding: calc(10px + 1vmin); display: flex">
                        <div 
                            style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1;"
                        >
                            <input 
                                @input=${(e: Readonly<Event>) => {
                                    if (
                                        audioElement
                                    ) {
                                        this.currentTimeChanged(parseFloat((e.target as any).value), audioElement);
                                    }
                                }}
                                type="range"
                                style="width: 100%; position: absolute; top: 0; height: 0"
                                min="0"
                                max="${duration}"
                                .value=${progress.toString()}
                                ?hidden=${formattedDuration === 'UNKNOWN' || formattedProgress === 'UNKNOWN'}
                            >
                        </div>
                        <div style="width: ${progressPercentage}%; position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(1, 1, 1, .1); z-index: -1"></div>
                        <!-- <i 
                            class="material-icons pc-player-play-icon"
                        >
                            skip_previous
                        </i> -->

                        <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center; flex: 1">
                            ${
                                formattedDuration !== 'UNKNOWN' && formattedProgress !== 'UNKNOWN' ? html`
                                    <div style="font-size: calc(10px + 1vmin);">${formattedProgress === 'UNKNOWN' ? '' : formattedProgress}</div>
                                    <div><hr style="width: 100%"></div>
                                    <div style="font-size: calc(10px + 1vmin);">${formattedDuration === 'UNKNOWN' ? '' : formattedDuration}</div>                                
                                ` : ''
                            }
                        </div>

                        <div style="flex: 2; display: flex; align-items: center; justify-content: center">
                            <i 
                                class="material-icons pc-player-backward-icon"
                                @click=${() => {
                                    if (
                                        audioElement
                                    ) {
                                        this.skipBack(audioElement);
                                    }
                                }}
                            >
                                replay_10
                            </i>

                            ${
                                state.playerPlaying ? 
                                html`
                                    <i 
                                        class="material-icons pc-player-play-icon"
                                        @click=${() => this.paused()}
                                    >
                                        pause
                                    </i>
                                ` :
                                html`
                                    <i 
                                        class="material-icons pc-player-play-icon"
                                        @click=${() => this.played()}
                                    >
                                        play_arrow
                                    </i>
                                `
                            }

                            <i 
                                class="material-icons pc-player-forward-icon"
                                @click=${() => {
                                    if (
                                        audioElement
                                    ) {
                                        this.skipForward(audioElement);
                                    }
                                }}
                            >
                                forward_10
                            </i>

                            <!-- <i 
                                class="material-icons pc-player-play-icon"
                            >
                                skip_next
                            </i> -->
                        </div>

                        <div style="flex: 1; display: flex; justify-content: center; align-items: center;">
                            <select @change=${(e: Readonly<Event>) => this.playbackRateChanged(e)} style="border: none; background-color: transparent">
                                <option value=".25" ?selected=${state.playbackRate === '.25'}>.25x</option>
                                <option value=".5" ?selected=${state.playbackRate === '.5'}>.5x</option>
                                <option value=".75" ?selected=${state.playbackRate === '.75'}>.75x</option>
                                <option value="1" ?selected=${state.playbackRate === '1'}>1x</option>
                                <option value="1.25" ?selected=${state.playbackRate === '1.25'}>1.25x</option>
                                <option value="1.5" ?selected=${state.playbackRate === '1.5'}>1.5x</option>
                                <option value="1.75" ?selected=${state.playbackRate === '1.75'}>1.75x</option>
                                <option value="2" ?selected=${state.playbackRate === '2'}>2x</option>
                            </select>
                        </div>
                    </div>


                </div>

                <audio
                    src=${getSrc(currentEpisode, this)}
                    preload="metadata"
                    @ended=${() => {
                        if (
                            currentEpisode !== null &&
                            currentEpisode !== undefined &&
                            audioElement !== null &&
                            audioElement !== undefined
                        ) {
                            this.audioEnded(currentEpisode, audioElement);
                        }
                    }}
                    @loadeddata=${() => {
                        if (
                            currentEpisode &&
                            audioElement
                        ) {
                            audioElement.currentTime = parseFloat(currentEpisode.progress);
                            this.playOrPause(currentEpisode, audioElement);
                        }
                    }}
                    @timeupdate=${(e: Readonly<Event>) => {
                        if (
                            currentEpisode &&
                            audioElement
                        ) {
                            this.timeUpdated(currentEpisode, audioElement);
                        }
                    }}
                    .playbackRate=${parseFloat(state.playbackRate)}
                ></audio>
            `;
        }
    }
    
    window.customElements.define('pc-player', PCPlayer);

    function getSrc(currentEpisode: Readonly<Episode> | null | undefined, pcPlayer: PCPlayer) {
        if (
            currentEpisode === null ||
            currentEpisode === undefined
        ) {
            return '';
        }

        if (currentEpisode.downloadState === 'DOWNLOADED') {
            return `${podcryptDownloadURL}${currentEpisode.src}`;
        }
        else {
            return currentEpisode.src;
        }
    }

    function secondsToHoursMinutesSeconds(seconds: Seconds): string {
        
        const hours = Math.floor(seconds / 3600);
        const hoursRemainder = seconds % 3600;
        const minutes = Math.floor(hoursRemainder / 60);
        const totalSeconds = Math.floor(hoursRemainder % 60);

        return `${hours === 0 ? '' : `${hours}:`}${minutes < 10 ? `0${minutes}` : minutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`;
    }

    function getDuration(audioElement: Readonly<HTMLAudioElement>): number | 'UNKNOWN' {
        if (!isNaN(audioElement.duration)) {
            return audioElement.duration;
        }
        else {
            return 'UNKNOWN';
        }   
    }

    function getProgressPercentage(
        currentEpisode: Readonly<Episode>,
        duration: number
    ): number {
        return (parseFloat(currentEpisode.progress) / duration) * 100;
    }
});
