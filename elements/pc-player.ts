// TODO consider intelligent locking for tasks that could happen concurrently...the way I am doing it or thinking of doing it seems a bit naive, because all tasks fired during a lock or forgotten, I might want to implement a queue or semaphore thing so that the events are not forgotten
// TODO add protections against exceptions when skipping backward a bunch or forward a bunch, over chunkindex lines

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

        mediaSource: MediaSource | null = mediaSourceExtensionsSupported() ? new MediaSource() : null;
        objectURL: string = '';
        sourceBuffer: SourceBuffer | null = null;
        currentEpisodeAudioInfo: EpisodeAudioInfo | null = null;
        nextCurrentEpisodeAudioInfo: EpisodeAudioInfo | null = null;
        timeUpdateLock = false;

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

            if (
                currentEpisode.downloadState !== 'DOWNLOADED' ||
                (
                    currentEpisode.downloadState === 'DOWNLOADED' &&
                    !mediaSourceExtensionsSupported()
                )
            ) {
                Store.dispatch({
                    type: 'CURRENT_EPISODE_COMPLETED'
                });

                await this.playOrPause(currentEpisode, audioElement);
            }
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
            await obtainTimeUpdateLock(this);

            if (
                currentEpisode.downloadState === 'DOWNLOADED' &&
                mediaSourceExtensionsSupported()
            ) {
                if (this.currentEpisodeAudioInfo === null) {
                    alert('this.episodeAudioInfo is null');
                    releaseTimeUpdateLock(this);
                    return;
                }
    
                const episodeChunkInfo: EpisodeChunkInfo | undefined = this.currentEpisodeAudioInfo.episodeChunkInfos.find((episodeChunkInfo: Readonly<EpisodeChunkInfo>) => {
                    return newCurrentTime >= episodeChunkInfo.startTime && newCurrentTime < episodeChunkInfo.endTime;
                });
    
                if (episodeChunkInfo === undefined) {
                    alert('episodeChunkInfo is undefined');
                    releaseTimeUpdateLock(this);
                    return;
                }
    
                const chunkIndex = episodeChunkInfo.chunkIndex;
    
                if (chunkIndex === Store.getState().currentEpisodeDownloadIndex) {
    
                    Store.dispatch({
                        type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                        progress: new BigNumber(audioElement.currentTime).toString()
                    }); 

                    audioElement.currentTime = newCurrentTime;  

                    releaseTimeUpdateLock(this);
    
                    return;
                }
    
                if (this.sourceBuffer === null) {
                    alert('this.sourceBuffer is null');
                    releaseTimeUpdateLock(this);
                    return;
                }
                                
                await addArrayBufferToSourceBuffer(
                    currentEpisode,
                    chunkIndex,
                    this.sourceBuffer,
                    episodeChunkInfo.startTime,
                    0,
                    this.sourceBuffer.buffered.end(0)
                );
                
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: chunkIndex
                });
            }

            Store.dispatch({
                type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                progress: new BigNumber(audioElement.currentTime).toString()
            });

            audioElement.currentTime = newCurrentTime;

            releaseTimeUpdateLock(this);
        }

        async skipBack(
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            const newCurrentTime = audioElement.currentTime - 10 < 0 ? 0 : audioElement.currentTime - 10;
            await this.currentTimeChanged(newCurrentTime, currentEpisode, audioElement);
        }

        async skipForward(
            currentEpisode: Readonly<Episode>,
            audioElement: HTMLAudioElement
        ) {
            const newCurrentTime = audioElement.currentTime + 10 >= audioElement.duration ? audioElement.duration - 1 : audioElement.currentTime + 10;
            await this.currentTimeChanged(newCurrentTime, currentEpisode, audioElement);
        }

        async transitionToNextChunkInCurrentEpisode(episode: Readonly<Episode>, nextChunkInfo: Readonly<EpisodeChunkInfo>) {

            if (this.sourceBuffer === null) {
                return;
            }
            
            await addArrayBufferToSourceBuffer(
                episode,
                nextChunkInfo.chunkIndex,
                this.sourceBuffer,
                nextChunkInfo.startTime,
                0,
                this.sourceBuffer.buffered.end(0) - 10
            );

            Store.dispatch({
                type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                currentEpisodeDownloadIndex: nextChunkInfo.chunkIndex
            });
        }

        async transitionToNextChunkInNextEpisode(progress: number) {
            const state: Readonly<State> = Store.getState();

            const nextCurrentPlaylistIndex: number = state.currentPlaylistIndex + 1;
            const nextCurrentEpisodeGuid: EpisodeGuid | undefined = state.playlist[nextCurrentPlaylistIndex];
            const nextCurrentEpisode: Readonly<Episode> | undefined = state.episodes[nextCurrentEpisodeGuid];

            if (
                nextCurrentEpisode !== undefined &&
                nextCurrentEpisode.downloadState === 'DOWNLOADED' &&
                this.nextCurrentEpisodeAudioInfo === null
            ) {
                this.nextCurrentEpisodeAudioInfo = await getEpisodeAudioInfo(nextCurrentEpisode);

                const episodeChunkInfo: Readonly<EpisodeChunkInfo> | 'NOT_FOUND' = getEpisodeChunkInfoForTime(this.nextCurrentEpisodeAudioInfo, parseFloat(nextCurrentEpisode.progress));

                if (episodeChunkInfo === 'NOT_FOUND') {
                    throw new Error('episodeChunkInfo not found');
                }

                // TODO I think we might want to remove this and put it in the complete transition function, otherwise seeking and such might get messed up
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: episodeChunkInfo.chunkIndex
                });

                if (
                    this.sourceBuffer === null ||
                    this.sourceBuffer === undefined
                ) {
                    throw new Error('this.sourceBuffer is not defined');
                }
            
                // const originalDuration = this.mediaSource.duration;

                await addArrayBufferToSourceBuffer(
                    nextCurrentEpisode,
                    episodeChunkInfo.chunkIndex,
                    this.sourceBuffer,
                    // this.mediaSource.duration,
                    // episodeChunkInfo.startTime,
                    // progress,
                    // 0, // TODO I think the timestampOffset is breaking transitions between episodes
                    // parseFloat(nextCurrentEpisode.progress),
                    // 0,
                    // this.sourceBuffer.buffered.length > 0 ? this.sourceBuffer.buffered.end(0) : 0,
                    0,
                    0,
                    // this.sourceBuffer.buffered.end(0) - 10,
                    Infinity
                );

                // this.mediaSource.duration = originalDuration;
            }
        }

        async completeTransitionToNextEpisode(audioElement: HTMLAudioElement) {
            Store.dispatch({
                type: 'CURRENT_EPISODE_COMPLETED'
            });

            const currentEpisode: Readonly<Episode> | undefined | null = Store.getState().episodes[Store.getState().currentEpisodeGuid];
            const currentPodcast: Readonly<Podcast> | undefined | null = currentEpisode ? Store.getState().podcasts[currentEpisode.feedUrl] : null;

            if (currentPodcast && currentEpisode) {
                this.setupMediaNotification(currentPodcast, currentEpisode, audioElement);
            }

            if (
                currentEpisode === null ||
                currentEpisode === undefined
            ) {
                return;
            }

            audioElement.currentTime = parseFloat(currentEpisode.progress);

            if (this.nextCurrentEpisodeAudioInfo === null) {
                return;
            }

            this.currentEpisodeAudioInfo = {
                ...this.nextCurrentEpisodeAudioInfo
            };
            this.nextCurrentEpisodeAudioInfo = null;

            if (this.currentEpisodeAudioInfo === null) {
                return;
            }

            if (this.mediaSource === null) {
                return;
            }

            this.mediaSource.duration = this.currentEpisodeAudioInfo.duration; 
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

            if (mediaSourceExtensionsSupported()) {
                await obtainTimeUpdateLock(this);
                const currentEpisode: Readonly<Episode> | undefined | null = Store.getState().episodes[Store.getState().currentEpisodeGuid];
                
                if (currentEpisode !== null && currentEpisode !== undefined) {
                    await this.handleChunkTransitions(currentEpisode, audioElement, progress);
                }
                
                releaseTimeUpdateLock(this);
            }
        }

        async handleChunkTransitions(currentEpisode: Readonly<Episode>, audioElement: HTMLAudioElement, progress: number) {
            if (currentEpisode.downloadState === 'DOWNLOADED') {
                if (this.currentEpisodeAudioInfo === null) {
                    return;
                }
    
                const currentChunkInfo: Readonly<EpisodeChunkInfo> = this.currentEpisodeAudioInfo.episodeChunkInfos[Store.getState().currentEpisodeDownloadIndex];
                const nextChunkInfo: Readonly<EpisodeChunkInfo> = this.currentEpisodeAudioInfo.episodeChunkInfos[Store.getState().currentEpisodeDownloadIndex + 1];

                console.log('currentChunkInfo.chunkIndex', currentChunkInfo.chunkIndex);
                console.log('parseFloat(currentEpisode.progress)', parseFloat(currentEpisode.progress));
                console.log('currentChunkInfo.endTime - 10', currentChunkInfo.endTime - 10);

                const shouldTransitionToNextChunkInCurrentEpisode: boolean = nextChunkInfo && parseFloat(currentEpisode.progress) >= (currentChunkInfo.endTime - 10);
                const shouldTransitionToNextChunkInNextEpisode: boolean = !nextChunkInfo && parseFloat(currentEpisode.progress) >= (currentChunkInfo.endTime - 10);
                const shouldCompleteTransitionToNextEpisode: boolean = !nextChunkInfo && parseFloat(currentEpisode.progress) >= (currentChunkInfo.endTime - 1);

                if (shouldTransitionToNextChunkInCurrentEpisode) {
                    console.log('this.transitionToNextChunkInCurrentEpisode');
                    await this.transitionToNextChunkInCurrentEpisode(currentEpisode, nextChunkInfo);
                }

                if (shouldTransitionToNextChunkInNextEpisode) {
                    // this.transitionToNextChunkInNextEpisode(progress);
                }

                if (shouldCompleteTransitionToNextEpisode) {
                    await this.transitionToNextChunkInNextEpisode(progress);
                    await this.completeTransitionToNextEpisode(audioElement);    
                }
            }
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

            if (
                currentEpisode.downloadState === 'DOWNLOADED' &&
                mediaSourceExtensionsSupported()
            ) {

                if (this.mediaSource === null) {
                    return;
                }

                this.objectURL = window.URL.createObjectURL(this.mediaSource)

                // TODO if the current episode is not downloaded, this promise will not resolve until a downloaded episode is played
                await new Promise((resolve) => this.mediaSource.addEventListener('sourceopen', resolve));
                this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');

                this.currentEpisodeAudioInfo = await getEpisodeAudioInfo(currentEpisode);

                const episodeChunkInfo: Readonly<EpisodeChunkInfo> | 'NOT_FOUND' = getEpisodeChunkInfoForTime(this.currentEpisodeAudioInfo, parseFloat(currentEpisode.progress));

                if (episodeChunkInfo === 'NOT_FOUND') {
                    throw new Error('episodeChunkInfo not found');
                }

                if (
                    this.sourceBuffer === null ||
                    this.sourceBuffer === undefined
                ) {
                    throw new Error('this.sourceBuffer is not defined');
                }
    
                await addArrayBufferToSourceBuffer(
                    currentEpisode,
                    episodeChunkInfo.chunkIndex,
                    this.sourceBuffer,
                    episodeChunkInfo.startTime,
                    this.sourceBuffer.buffered.length !== 0 ? 0 : 'DO_NOT_REMOVE',
                    this.sourceBuffer.buffered.length !== 0 ? Infinity : 'DO_NOT_REMOVE'
                );

                if (this.mediaSource === null) {
                    return;
                }

                this.mediaSource.duration = this.currentEpisodeAudioInfo.duration;

                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: episodeChunkInfo.chunkIndex
                });
            }

            if (
                currentEpisode.downloadState === 'DOWNLOADED' &&
                !mediaSourceExtensionsSupported()
            ) {

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

            if (
                state.currentEpisodeChangedManually &&
                currentPodcast !== null &&
                currentPodcast !== undefined &&
                currentEpisode !== null &&
                currentEpisode !== undefined &&
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
        return (parseFloat(currentEpisode.progress) / duration) * 100;
    }

    async function addArrayBufferToSourceBuffer(
        episode: Readonly<Episode>,
        chunkIndex: number,
        sourceBuffer: SourceBuffer,
        timestampOffset: number,
        removeStart: number | 'DO_NOT_REMOVE',
        removeEnd: number | 'DO_NOT_REMOVE'
    ): Promise<'CHUNK_APPENDED' | 'CHUNK_NOT_FOUND'> {

        sourceBuffer.abort();
        sourceBuffer.timestampOffset = timestampOffset;

        if (
            removeStart !== 'DO_NOT_REMOVE' &&
            removeEnd !== 'DO_NOT_REMOVE'
        ) {
            sourceBuffer.remove(removeStart, removeEnd);
            await new Promise((resolve) => sourceBuffer.addEventListener('updateend', resolve));
        }

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

        // TODO sequence mode may help me get rid of having to use timestampOffset
        // sourceBuffer.mode = 'sequence';

        return 'CHUNK_APPENDED';
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

        window.URL.revokeObjectURL(audioElement.src);

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

    // TODO this is meant only to be used by platforms that do not support media source extensions (iOS!!!)
    // TODO once media source extensions are supported, remove this stuff
    function mediaSourceExtensionsSupported() {
        return (window as any).MediaSource;
    }

    // TODO this is meant only to be used by platforms that do not support media source extensions (iOS!!!)
    // TODO once media source extensions are supported, remove this stuff
    async function getEntireEpisodeBlob() {
        // TODO go in here and grab all of the chunks and return the blob...
    }

    async function obtainTimeUpdateLock(pcPlayer: PCPlayer) {
        if (pcPlayer.timeUpdateLock === false) {
            pcPlayer.timeUpdateLock = true;
            console.log('lock obtained');
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 100));
            await obtainTimeUpdateLock(pcPlayer);
        }
    }

    function releaseTimeUpdateLock(pcPlayer: PCPlayer) {
        pcPlayer.timeUpdateLock = false;
        console.log('lock released');
    }

});
