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

        mediaSource: MediaSource = new MediaSource();
        objectURL: string = window.URL.createObjectURL(this.mediaSource);
        sourceBuffer: SourceBuffer | null = null;
        episodeAudioInfo: EpisodeAudioInfo | null = null;

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

            // TODO if the current episode is not downloaded, this promise will not resolve until a downloaded episode is played
            await new Promise((resolve) => this.mediaSource.addEventListener('sourceopen', resolve));
            this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');
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
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {

            if (currentEpisode.downloadState === 'DOWNLOADED') {
                if (this.episodeAudioInfo === null) {
                    alert('this.episodeAudioInfo is null');
                    return;
                }
    
                const episodeChunkInfo: EpisodeChunkInfo | undefined = this.episodeAudioInfo.episodeChunkInfos.find((episodeChunkInfo) => {
                    return newCurrentTime >= episodeChunkInfo.startTime && newCurrentTime < episodeChunkInfo.endTime;
                });
    
                if (episodeChunkInfo === undefined) {
                    alert('episodeChunkInfo is undefined');
                    return;
                }
    
                const chunkIndex = episodeChunkInfo.chunkIndex;
    
                if (chunkIndex === Store.getState().currentEpisodeDownloadIndex) {
    
                    audioElement.currentTime = newCurrentTime;
    
                    Store.dispatch({
                        type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                        progress: new BigNumber(audioElement.currentTime).toString()
                    });    
    
                    return;
                }
    
                if (this.sourceBuffer === null) {
                    alert('this.sourceBuffer is null');
                    return;
                }
                
                this.sourceBuffer.abort();
    
                this.sourceBuffer.timestampOffset = episodeChunkInfo.startTime;
                
                // TODO i am still trying to figure out the time range thing...I was using Infinity
                this.sourceBuffer.remove(0, this.sourceBuffer.buffered.end(0));
                
                await addArrayBufferToSourceBuffer(currentEpisode, chunkIndex, this.sourceBuffer);
                
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: chunkIndex
                });
            }

            audioElement.currentTime = newCurrentTime;

            Store.dispatch({
                type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                progress: new BigNumber(audioElement.currentTime).toString()
            });
        }

        skipBack(
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            const newCurrentTime = audioElement.currentTime = audioElement.currentTime - 10;
            this.currentTimeChanged(newCurrentTime, currentEpisode, audioElement);
        }

        skipForward(
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            const newCurrentTime = audioElement.currentTime = audioElement.currentTime + 10;
            this.currentTimeChanged(newCurrentTime, currentEpisode, audioElement);
        }

        async audio1Ended(currentEpisode: Readonly<Episode>, currentEpisodeDownloadIndex: number, audio2Src: string | 'NOT_SET') {
            
            Store.dispatch({
                type: 'CURRENT_EPISODE_COMPLETED'
            });

            // if (audio2Src === 'NOT_SET') {
            //     Store.dispatch({
            //         type: 'CURRENT_EPISODE_COMPLETED'
            //     });
            // }

            // if (currentEpisode.downloadState === 'DOWNLOADED') {
            //     Store.dispatch({
            //         type: 'SET_AUDIO_1_PLAYING',
            //         audio1Playing: false
            //     });
    
            //     Store.dispatch({
            //         type: 'SET_AUDIO_2_PLAYING',
            //         audio2Playing: true
            //     });
    
            //     const audio1Src: string | 'NOT_SET' = await getAudioSourceFromIndexedDB(currentEpisode, currentEpisodeDownloadIndex);
    
            //     Store.dispatch({
            //         type: 'SET_AUDIO_1_SRC',
            //         audio1Src
            //     });
    
            //     Store.dispatch({
            //         type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
            //         currentEpisodeDownloadIndex: currentEpisodeDownloadIndex + 1
            //     });
            // }
        }

        async audio2Ended(currentEpisode: Readonly<Episode>, currentEpisodeDownloadIndex: number, audio1Src: string | 'NOT_SET') {
            
            // if (audio1Src === 'NOT_SET') {
            //     Store.dispatch({
            //         type: 'CURRENT_EPISODE_COMPLETED'
            //     });
            // }

            // if (currentEpisode.downloadState === 'DOWNLOADED') {
            //     Store.dispatch({
            //         type: 'SET_AUDIO_1_PLAYING',
            //         audio1Playing: true
            //     });
    
            //     Store.dispatch({
            //         type: 'SET_AUDIO_2_PLAYING',
            //         audio2Playing: false
            //     });
    
            //     const audio2Src: string | 'NOT_SET' = await getAudioSourceFromIndexedDB(currentEpisode, currentEpisodeDownloadIndex);
    
            //     Store.dispatch({
            //         type: 'SET_AUDIO_2_SRC',
            //         audio2Src
            //     });
    
            //     Store.dispatch({
            //         type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
            //         currentEpisodeDownloadIndex: currentEpisodeDownloadIndex + 1
            //     });
            // }
        }

        async timeUpdated(
            currentEpisode: Readonly<Episode>,
            audioElement: Readonly<HTMLAudioElement>
        ) {
           
            if (currentEpisode.downloadState === 'DOWNLOADED') {
                if (this.episodeAudioInfo === null) {
                    return;
                }
    
                const currentEpisodeChunkInfo = this.episodeAudioInfo.episodeChunkInfos[Store.getState().currentEpisodeDownloadIndex];
                const nextEpisodeChunkInfo = this.episodeAudioInfo.episodeChunkInfos[Store.getState().currentEpisodeDownloadIndex + 1];
        
                // TODO comment everything that is crazy
                if (
                    nextEpisodeChunkInfo &&
                    parseFloat(currentEpisode.progress) >= (currentEpisodeChunkInfo.endTime - 10)
                ) {
                    if (this.sourceBuffer === null) {
                        return;
                    }
    
                    this.sourceBuffer.abort();
    
                    this.sourceBuffer.timestampOffset = nextEpisodeChunkInfo.startTime;
    
                    this.sourceBuffer.remove(0, this.sourceBuffer.buffered.end(0) - 10);
                
                    await addArrayBufferToSourceBuffer(currentEpisode, Store.getState().currentEpisodeDownloadIndex + 1, this.sourceBuffer);
                    
                    Store.dispatch({
                        type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                        currentEpisodeDownloadIndex: Store.getState().currentEpisodeDownloadIndex + 1
                    });    
                }

                if (
                    !nextEpisodeChunkInfo &&
                    parseFloat(currentEpisode.progress) >= (currentEpisodeChunkInfo.endTime - 10)
                ) {

                }
            }

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

        async playOrPause(
            currentEpisode: Readonly<Episode>,
            audioElement: Readonly<HTMLAudioElement>
        ) {
            try {
                if (currentEpisode.playing === true) {
                    await audioElement.play();
                }

                if (currentEpisode.playing === false) {
                    audioElement.pause();
                }
            }
            catch(error) {
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
                    this.skipBack(currentEpisode, audioElement);
                });
    
                navigator.mediaSession.setActionHandler('seekforward', () => {
                    this.skipForward(currentEpisode, audioElement);                
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

        async handleManualEpisodeChange(
            currentPodcast: Readonly<Podcast>,
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            Store.dispatch({
                type: 'SET_CURRENT_EPISODE_CHANGED_MANUALLY',
                currentEpisodeChangedManually: false
            });

            this.setupMediaNotification(currentPodcast, currentEpisode, audioElement);

            if (currentEpisode.downloadState === 'DOWNLOADED') {
                this.episodeAudioInfo = await getEpisodeAudioInfo(currentEpisode);

                const episodeChunkInfo: Readonly<EpisodeChunkInfo> | 'NOT_FOUND' = getEpisodeChunkInfoForTime(this.episodeAudioInfo, parseFloat(currentEpisode.progress));

                if (episodeChunkInfo === 'NOT_FOUND') {
                    throw new Error('episodeChunkInfo not found');
                }

                if (
                    this.sourceBuffer === null ||
                    this.sourceBuffer === undefined
                ) {
                    throw new Error('this.sourceBuffer is not defined');
                }

                this.sourceBuffer.abort();

                this.sourceBuffer.timestampOffset = episodeChunkInfo.startTime;
                
                if (this.sourceBuffer.buffered.length !== 0) {
                    // TODO i am still trying to figure out the time range thing...I was using Infinity
                    this.sourceBuffer.remove(0, Infinity);    
                }

                await addArrayBufferToSourceBuffer(currentEpisode, episodeChunkInfo.chunkIndex, this.sourceBuffer);
    
                this.mediaSource.duration = this.episodeAudioInfo.duration;
            }

            audioElement.currentTime = parseFloat(currentEpisode.progress);
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
            const currentEpisodeDownloadIndex: number = state.currentEpisodeDownloadIndex;
            const currentEpisodeManuallyChanged: boolean = (
                state.currentEpisodeChangedManually &&
                audioElement !== null &&
                audioElement !== undefined &&
                currentPodcast !== null &&
                currentPodcast !== undefined &&
                currentEpisode !== null &&
                currentEpisode !== undefined
            );

            if (
                currentEpisodeManuallyChanged &&
                currentPodcast !== null &&
                audioElement !== null
            ) {
                await this.handleManualEpisodeChange(currentPodcast, currentEpisode, audioElement);
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
                                        currentEpisode &&
                                        audioElement
                                    ) {
                                        this.currentTimeChanged(parseFloat((e.target as any).value), currentEpisode, audioElement);
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
                                        audioElement
                                    ) {
                                        this.skipBack(currentEpisode, audioElement);
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
                                        audioElement
                                    ) {
                                        this.skipForward(currentEpisode, audioElement);
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
                    @ended=${() => this.audio1Ended(currentEpisode, currentEpisodeDownloadIndex, state.audio2Src)}
                    @timeupdate=${(e: Readonly<Event>) => {
                        if (currentEpisode && audioElement) {
                            this.timeUpdated(currentEpisode, audioElement);
                        }
                    }}
                    .playbackRate=${parseFloat(state.playbackRate)}
                ></audio>
            `;
        }
    }

    // @loadeddata=${() => {
    //     if (handlePlaybackParamsDefined && audioElement !== null) {
    //         this.handlePlayback(
    //             currentEpisode,
    //             audioElement
    //         );
    //     }
    // }}
    
    window.customElements.define('pc-player', PCPlayer);

    function getSrc(currentEpisode: Readonly<Episode> | null | undefined, pcPlayer: PCPlayer) {
        if (
            currentEpisode === null ||
            currentEpisode === undefined
        ) {
            return '';
        }

        if (currentEpisode.downloadState === 'DOWNLOADED') {
            return pcPlayer.objectURL;
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
        return (parseFloat(currentEpisode.progress) / duration) * 100
    }

    async function getInitialAudioSources(currentEpisode: Readonly<Episode>, currentEpisodeDownloadIndex: number): Promise<Readonly<AudioSources>> {        
        if (currentEpisode.downloadState === 'DOWNLOADED') {
            const audio1SrcDownloadIndex: number = currentEpisodeDownloadIndex;
            const audio2SrcDownloadIndex: number = currentEpisodeDownloadIndex + 1;

            const audio1Src: string = await getAudioSourceFromIndexedDB(currentEpisode, audio1SrcDownloadIndex);
            const audio2Src: string = await getAudioSourceFromIndexedDB(currentEpisode, audio2SrcDownloadIndex);

            console.log('currentEpisode', currentEpisode);
            console.log('audio1Src', audio1Src);
            console.log('audio2Src', audio2Src);

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
       
        console.log(`${episode.guid}-audio-file-array-buffer-${episodeDownloadIndex}`)
        const audioArrayBuffer: ArrayBuffer | 'NOT_FOUND' = (await get(`${episode.guid}-audio-file-array-buffer-${episodeDownloadIndex}`)) || 'NOT_FOUND';
        console.log('audioArrayBuffer', audioArrayBuffer);
        const audioBlob: Readonly<Blob> | 'NOT_CREATED' = audioArrayBuffer !== 'NOT_FOUND' ? new Blob([audioArrayBuffer], { type: 'audio/mpeg' }) : 'NOT_CREATED';        
        const audioObjectURL: string | 'NOT_SET' = audioBlob !== 'NOT_CREATED' ? window.URL.createObjectURL(audioBlob) : 'NOT_SET';
        return audioObjectURL;
    }

    async function addArrayBufferToSourceBuffer(
        episode: Readonly<Episode>,
        chunkIndex: number,
        sourceBuffer: SourceBuffer
    ): Promise<'CHUNK_APPENDED' | 'CHUNK_NOT_FOUND'> {
        const chunk: ArrayBuffer | null | undefined = await get(`${episode.guid}-audio-file-array-buffer-${chunkIndex}`);

        if (
            chunk === null ||
            chunk === undefined
        ) {
            // sourceBuffer.addEventListener('updateend', () => {
                // mediaSource.endOfStream();
            // });
            return 'CHUNK_NOT_FOUND';
        }

        sourceBuffer.appendBuffer(chunk);

        await new Promise((resolve) => sourceBuffer.addEventListener('updateend', resolve));

        return 'CHUNK_APPENDED';
    }

    // TODO I will have to deal with calculating the length, adding new buffers to the buffer, and seeking on my own
    // TODO media source extensions at least gives me a way of updating the audio live I believe, without changing audio elements
    // TODO it will take some more work but hopefully will function properly
    async function addArrayBuffersToSourceBuffer(
        currentEpisode: Readonly<Episode>,
        mediaSource: Readonly<MediaSource>,
        // sourceBuffer: Readonly<SourceBuffer>,
        chunkIndex: number = 0
    ): Promise<void> {

        console.log('chunkIndex', chunkIndex);

        const chunk: ArrayBuffer | null | undefined = await get(`${currentEpisode.guid}-audio-file-array-buffer-${chunkIndex}`);

        if (
            chunk === null ||
            chunk === undefined
        ) {
            // sourceBuffer.addEventListener('updateend', () => {
                mediaSource.endOfStream();
            // });
            return;
        }

        // const middleIndex: number = Math.floor(chunk.byteLength / 2);

        // const chunk1: ArrayBuffer = chunk.slice(0, middleIndex);
        // const chunk2: ArrayBuffer = chunk.slice(middleIndex, chunk.byteLength);

        const sourceBuffer: Readonly<SourceBuffer> = mediaSource.addSourceBuffer('audio/mpeg');

        sourceBuffer.appendBuffer(chunk);
        
        await new Promise((resolve) => {
            sourceBuffer.addEventListener('updateend', resolve);
        });

        // mediaSource.addEventListener('')
        
        // sourceBuffer.addEventListener('')
        // sourceBuffer.remove

        // sourceBuffer.appendBuffer(chunk2);

        // await new Promise((resolve) => {
        //     sourceBuffer.addEventListener('updateend', resolve);
        // });

        // await new Promise((resolve) => setTimeout(resolve, 5000));

        addArrayBuffersToSourceBuffer(currentEpisode, mediaSource, chunkIndex + 1);
    }

    type EpisodeAudioInfo = {
        duration: number;
        episodeChunkInfos: ReadonlyArray<EpisodeChunkInfo>;
    }

    type EpisodeChunkInfo = {
        chunkIndex: number;
        startTime: Seconds;
        endTime: Seconds;
    }

    async function getEpisodeAudioInfo(
        episode: Readonly<Episode>,
        chunkIndex: number = 0,
        episodeAudioInfo: Readonly<EpisodeAudioInfo> = {
            duration: 0,
            episodeChunkInfos: []
        }
    ): Promise<EpisodeAudioInfo> {

        const chunk: ArrayBuffer | null | undefined = await get(`${episode.guid}-audio-file-array-buffer-${chunkIndex}`);

        if (
            chunk === null ||
            chunk === undefined
        ) {
            return episodeAudioInfo;
        }

        const audioElement: HTMLAudioElement = document.createElement('audio');
        const mediaSource = new MediaSource();
        audioElement.src = window.URL.createObjectURL(mediaSource);

        await new Promise((resolve) => mediaSource.addEventListener('sourceopen', resolve));

        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

        sourceBuffer.appendBuffer(chunk);
        
        await new Promise((resolve) => sourceBuffer.addEventListener('updateend', resolve));

        mediaSource.endOfStream();
        
        // TODO the start times and end times might need to be changed to not ever overlap, we'll see
        const previousEpisodeChunkInfo: Readonly<EpisodeChunkInfo> | undefined = episodeAudioInfo.episodeChunkInfos[episodeAudioInfo.episodeChunkInfos.length - 1];
        const duration: Seconds = mediaSource.duration;
        const startTime: Seconds = previousEpisodeChunkInfo ? previousEpisodeChunkInfo.endTime : 0; // TODO this should be the end time of the previous episodeChunkInfo
        const endTime: Seconds = startTime + duration;
        const episodeChunkInfo: Readonly<EpisodeChunkInfo> = {
            chunkIndex,
            startTime,
            endTime
        };

        return await getEpisodeAudioInfo(episode, chunkIndex + 1, {
            ...episodeAudioInfo,
            duration: episodeAudioInfo.duration + duration,
            episodeChunkInfos: [...episodeAudioInfo.episodeChunkInfos, episodeChunkInfo]
        });
    }

    function getEpisodeChunkInfoForTime(episodeAudioInfo: Readonly<EpisodeAudioInfo>, time: number): Readonly<EpisodeChunkInfo> | 'NOT_FOUND' {
        const episodeChunkInfo: EpisodeChunkInfo | undefined = episodeAudioInfo.episodeChunkInfos.find((episodeChunkInfo) => {
            return time >= episodeChunkInfo.startTime && time < episodeChunkInfo.endTime;
        });

        if (episodeChunkInfo === undefined) {
            return 'NOT_FOUND'
        }
        else {
            return episodeChunkInfo;
        }
    }

});
