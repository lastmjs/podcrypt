// TODO everything needs to be chunked...downloading the files needs to be chunked,
// TODO saving the files to IndexedDB needs to be chunked, retrieving the files from IndexedDB needs to be chunked
// TODO Turning the retrieved files into object urls needs to be chunked
// TODO We need a smooth transition from one audio element to the next, I think 10mb chunks might be best
// TODO test releasing object urls, I think that might be ruining everything

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


StorePromise.then((Store) => {

    class PCPlayer extends HTMLElement {
        constructor() {
            super();
            Store.subscribe(() => litRender(this.render(Store.getState()), this));
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

        timeSliderOnInput(
            e: Readonly<Event>,
            currentEpisode: Readonly<Episode>,
            audio1Element: HTMLAudioElement,
            audio2Element: HTMLAudioElement
        ) {
            const sliderInput: Readonly<HTMLInputElement> = e.target as HTMLInputElement;

            if (
                currentEpisode.downloadState === 'DOWNLOADING' ||
                currentEpisode.downloadState === 'NOT_DOWNLOADED'
            ) {
                audio1Element.currentTime = parseFloat(sliderInput.value);

                Store.dispatch({
                    type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                    progress: new BigNumber(audio1Element.currentTime).toString()
                });
            }
        }

        skipBack(
            currentEpisode: Readonly<Episode>,
            audio1Element: HTMLAudioElement,
            audio2Element: Readonly<HTMLAudioElement>
        ) {
            if (
                currentEpisode.downloadState === 'DOWNLOADING' ||
                currentEpisode.downloadState === 'NOT_DOWNLOADED'
            ) {
                audio1Element.currentTime = audio1Element.currentTime - 10;

                Store.dispatch({
                    type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
                    progress: new BigNumber(audio1Element.currentTime).toString()
                });
            }
        }

        skipForward(
            currentEpisode: Readonly<Episode>,
            audio1Element: HTMLAudioElement,
            audio2Element: Readonly<HTMLAudioElement>
        ) {
            if (
                currentEpisode.downloadState === 'DOWNLOADING' ||
                currentEpisode.downloadState === 'NOT_DOWNLOADED'
            ) {
                audio1Element.currentTime = audio1Element.currentTime + 10;

                Store.dispatch({
                    type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
                    progress: new BigNumber(audio1Element.currentTime).toString()
                });
            }
        }

        async audio1Ended(currentEpisode: Readonly<Episode>, currentEpisodeDownloadIndex: number, audio2Src: string | 'NOT_SET') {

            if (audio2Src === 'NOT_SET') {
                Store.dispatch({
                    type: 'CURRENT_EPISODE_COMPLETED'
                });
            }

            if (currentEpisode.downloadState === 'DOWNLOADED') {
                Store.dispatch({
                    type: 'SET_AUDIO_1_PLAYING',
                    audio1Playing: false
                });
    
                Store.dispatch({
                    type: 'SET_AUDIO_2_PLAYING',
                    audio2Playing: true
                });
    
                const audio1Src: string | 'NOT_SET' = await getAudioSourceFromIndexedDB(currentEpisode, currentEpisodeDownloadIndex);
    
                Store.dispatch({
                    type: 'SET_AUDIO_1_SRC',
                    audio1Src
                });
    
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: currentEpisodeDownloadIndex + 1
                });
            }
        }

        async audio2Ended(currentEpisode: Readonly<Episode>, currentEpisodeDownloadIndex: number, audio1Src: string | 'NOT_SET') {
            
            if (audio1Src === 'NOT_SET') {
                Store.dispatch({
                    type: 'CURRENT_EPISODE_COMPLETED'
                });
            }

            if (currentEpisode.downloadState === 'DOWNLOADED') {
                Store.dispatch({
                    type: 'SET_AUDIO_1_PLAYING',
                    audio1Playing: true
                });
    
                Store.dispatch({
                    type: 'SET_AUDIO_2_PLAYING',
                    audio2Playing: false
                });
    
                const audio2Src: string | 'NOT_SET' = await getAudioSourceFromIndexedDB(currentEpisode, currentEpisodeDownloadIndex);
    
                Store.dispatch({
                    type: 'SET_AUDIO_2_SRC',
                    audio2Src
                });
    
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: currentEpisodeDownloadIndex + 1
                });
            }
        }

        timeUpdated(currentEpisode: Readonly<Episode>, audioElement: Readonly<HTMLAudioElement>) {
            const progress = parseFloat(currentEpisode.progress) > audioElement.currentTime ? audioElement.currentTime + currentEpisode.progress : audioElement.currentTime;
    
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

        // TODO we might want to make the transition between episodes even smoother, instead of restarting the audio sources
        // TODO for each episode, when an audio element ends it can just load the next episode into the next audio element
        // TODO actually, we might be able to get rid of the current episode switching nonsense entirely
        async handlePlayback(
            currentEpisode: Readonly<Episode>,
            currentEpisodeDownloadIndex: number,
            previousEpisodeGuid: EpisodeGuid,
            currentEpisodeGuid: EpisodeGuid,
            audio1Element: HTMLAudioElement,
            audio2Element: Readonly<HTMLAudioElement>,
            audio1Playing: boolean,
            audio2Playing: boolean
        ) {
            const episodeChanged: boolean = currentEpisodeGuid !== previousEpisodeGuid;

            if (episodeChanged) {
                Store.dispatch({
                    type: 'SET_PREVIOUS_EPISODE_GUID',
                    previousEpisodeGuid: currentEpisodeGuid
                });

                const audioSources: Readonly<AudioSources> = await getInitialAudioSources(currentEpisode, currentEpisodeDownloadIndex);

                // TODO these probably need to be atomic
                Store.dispatch({
                    type: 'SET_AUDIO_1_SRC',
                    audio1Src: audioSources.audio1Src
                });

                Store.dispatch({
                    type: 'SET_AUDIO_2_SRC',
                    audio2Src: audioSources.audio2Src
                });

                Store.dispatch({
                    type: 'SET_AUDIO_1_PLAYING',
                    audio1Playing: true
                });

                Store.dispatch({
                    type: 'SET_AUDIO_2_PLAYING',
                    audio2Playing: false
                });

                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: currentEpisodeDownloadIndex + 2
                });

                audio1Element.currentTime = currentEpisode.progress;
            }

            await this.playOrPause(currentEpisode, audio1Element, audio2Element, audio1Playing, audio2Playing);
        }

        async playOrPause(
            currentEpisode: Readonly<Episode>,
            audio1Element: Readonly<HTMLAudioElement>,
            audio2Element: Readonly<HTMLAudioElement>,
            audio1Playing: boolean,
            audio2Playing: boolean
        ) {
            try {
                if (currentEpisode.playing === true) {
                    if (audio1Playing) {
                        audio2Element.pause();
                        await audio1Element.play();
                    }

                    if (audio2Playing) {
                        audio1Element.pause();
                        await audio2Element.play();
                    }
                }

                if (currentEpisode.playing === false) {
                    audio1Element.pause();
                    audio2Element.pause();
                }
            }
            catch(error) {
                console.log(error);
            }
        }

        render(state: Readonly<State>): Readonly<TemplateResult> {
            const audio1Element: HTMLAudioElement | null = this.querySelector('#audio-1');
            const audio2Element: HTMLAudioElement | null = this.querySelector('#audio-2');
            const currentEpisode: Readonly<Episode> | undefined | null = state.episodes[state.currentEpisodeGuid];
            const duration: number | 'UNKNOWN' = currentEpisode && audio1Element && audio2Element ? getDuration(currentEpisode, audio1Element, audio2Element) : 'UNKNOWN';            
            const progressPercentage: number | 'UNKNOWN' = currentEpisode && duration !== 'UNKNOWN' ? getProgressPercentage(currentEpisode, duration) : 'UNKNOWN';
            const progress: number | 'UNKNOWN' = currentEpisode && !isNaN(parseFloat(currentEpisode.progress)) ? parseFloat(currentEpisode.progress) : 'UNKNOWN';
            const formattedDuration: string | 'UNKNOWN' = duration !== 'UNKNOWN' ? secondsToHoursMinutesSeconds(duration) : 'UNKNOWN';
            const formattedProgress: string =  progress !== 'UNKNOWN' ? secondsToHoursMinutesSeconds(progress) : 'UNKNOWN';
            const currentEpisodeDownloadIndex: number = state.currentEpisodeDownloadIndex;

            const handlePlaybackParamsDefined: boolean = (
                currentEpisode !== null &&
                currentEpisode !== undefined &&
                audio1Element !== null &&
                audio1Element !== undefined &&
                audio2Element !== null &&
                audio2Element !== undefined
            );

            if (handlePlaybackParamsDefined && audio1Element !== null && audio2Element !== null) {
                this.handlePlayback(
                    currentEpisode,
                    currentEpisodeDownloadIndex,
                    state.previousEpisodeGuid,
                    state.currentEpisodeGuid,
                    audio1Element,
                    audio2Element,
                    state.audio1Playing,
                    state.audio2Playing
                );
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
                                        currentEpisode &&
                                        audio1Element &&
                                        audio2Element
                                    ) {
                                        this.timeSliderOnInput(e, currentEpisode, audio1Element, audio2Element);
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
                                        currentEpisode &&
                                        audio1Element &&
                                        audio2Element
                                    ) {
                                        this.skipBack(currentEpisode, audio1Element, audio2Element);
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
                                        currentEpisode &&
                                        audio1Element &&
                                        audio2Element
                                    ) {
                                        this.skipForward(currentEpisode, audio1Element, audio2Element);
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
                    id="audio-1"
                    src=${state.audio1Src}
                    preload="metadata"
                    @loadeddata=${() => {
                        if (handlePlaybackParamsDefined && audio1Element !== null && audio2Element !== null) {
                            this.handlePlayback(
                                currentEpisode,
                                currentEpisodeDownloadIndex,
                                state.previousEpisodeGuid,
                                state.currentEpisodeGuid,
                                audio1Element,
                                audio2Element,
                                state.audio1Playing,
                                state.audio2Playing
                            );
                        }
                    }}
                    @ended=${() => this.audio1Ended(currentEpisode, currentEpisodeDownloadIndex, state.audio2Src)}
                    @timeupdate=${(e: Readonly<Event>) => {
                        if (currentEpisode && audio1Element) {
                            this.timeUpdated(currentEpisode, audio1Element);
                        }
                    }}
                    .playbackRate=${parseFloat(state.playbackRate)}
                ></audio>

                <audio
                    id="audio-2"
                    src=${state.audio2Src}
                    preload="metadata"
                    @loadeddata=${() => {
                        if (handlePlaybackParamsDefined && audio1Element !== null && audio2Element !== null) {
                            this.handlePlayback(
                                currentEpisode,
                                currentEpisodeDownloadIndex,
                                state.previousEpisodeGuid,
                                state.currentEpisodeGuid,
                                audio1Element,
                                audio2Element,
                                state.audio1Playing,
                                state.audio2Playing
                            );
                        }
                    }}
                    @ended=${() => this.audio2Ended(currentEpisode, currentEpisodeDownloadIndex, state.audio1Src)}
                    @timeupdate=${(e: Readonly<Event>) => {
                        if (currentEpisode && audio2Element) {
                            this.timeUpdated(currentEpisode, audio2Element);
                        }
                    }}
                    .playbackRate=${parseFloat(state.playbackRate)}
                ></audio>
            `;
        }
    }
    
    window.customElements.define('pc-player', PCPlayer);

    function secondsToHoursMinutesSeconds(seconds: Seconds): string {
        
        const hours = Math.floor(seconds / 3600);
        const hoursRemainder = seconds % 3600;
        const minutes = Math.floor(hoursRemainder / 60);
        const totalSeconds = Math.floor(hoursRemainder % 60);

        return `${hours === 0 ? '' : `${hours}:`}${minutes < 10 ? `0${minutes}` : minutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`;
    }

    function getDuration(
        currentEpisode: Readonly<Episode>,
        audio1Element: Readonly<HTMLAudioElement>,
        audio2Element: Readonly<HTMLAudioElement>
    ): number | 'UNKNOWN' {

        if (currentEpisode.downloadState === 'DOWNLOADED') {
            // TODO not sure how we're going to get this duration...we could calculate perhaps based on file type, byte length, and bitrate, but that sounds complicated
            // TODO we might also be able to load up ephemeral audio elements and grab their durations, summing them up and letting them get immediately garbage collected
            return 'UNKNOWN';
        }

        if (
            currentEpisode.downloadState === 'NOT_DOWNLOADED' ||
            currentEpisode.downloadState === 'DOWNLOADING'
        ) {
            if (!isNaN(audio1Element.duration)) {
                return audio1Element.duration;
            }
            else {
                return 'UNKNOWN';
            }   
        }

        return 'UNKNOWN';
    }

    function getProgressPercentage(
        currentEpisode: Readonly<Episode>,
        duration: number
    ): number {
        return (parseFloat(currentEpisode.progress) / duration) * 100
    }

    async function getInitialAudioSources(currentEpisode: Readonly<Episode>, currentEpisodeDownloadIndex: number): Promise<Readonly<AudioSources>> {        
        if (currentEpisode.downloadState === 'DOWNLOADED') {
            const audio1SrcDownloadIndex: number = currentEpisodeDownloadIndex;
            const audio2SrcDownloadIndex: number = currentEpisodeDownloadIndex + 1;

            const audio1Src: string = await getAudioSourceFromIndexedDB(currentEpisode, audio1SrcDownloadIndex);
            const audio2Src: string = await getAudioSourceFromIndexedDB(currentEpisode, audio2SrcDownloadIndex);

            return {
                audio1Src,
                audio2Src
            };
        }
        else {
            return {
                audio1Src: currentEpisode.src,
                audio2Src: 'NOT_SET'
            };
        }
    }

    async function getAudioSourceFromIndexedDB(episode: Readonly<Episode>, episodeDownloadIndex: number): Promise<string | 'NOT_SET'> {
        const audioArrayBuffer: ArrayBuffer | 'NOT_FOUND' = (await get(`${episode.guid}-audio-file-array-buffer-${episodeDownloadIndex}`)) || 'NOT_FOUND';
        const audioBlob: Readonly<Blob> | 'NOT_CREATED' = audioArrayBuffer !== 'NOT_FOUND' ? new Blob([audioArrayBuffer], { type: 'audio/mpeg' }) : 'NOT_CREATED';        
        const audioObjectURL: string | 'NOT_SET' = audioBlob !== 'NOT_CREATED' ? window.URL.createObjectURL(audioBlob) : 'NOT_SET';
        return audioObjectURL;
    }
});
