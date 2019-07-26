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

        mediaSource: MediaSource = new MediaSource();
        sourceBuffer: SourceBuffer | null = null;
        episodeAudioInfo: EpisodeAudioInfo | null = null;

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

        async currentTimeChanged(
            newCurrentTime: number,
            currentEpisode: Readonly<Episode>,
            audio1Element: HTMLAudioElement,
            audio2Element: HTMLAudioElement
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
    
                    audio1Element.currentTime = newCurrentTime;
    
                    Store.dispatch({
                        type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                        progress: new BigNumber(audio1Element.currentTime).toString()
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

            audio1Element.currentTime = newCurrentTime;

            Store.dispatch({
                type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER',
                progress: new BigNumber(audio1Element.currentTime).toString()
            });
        }

        skipBack(
            currentEpisode: Readonly<Episode>,
            audio1Element: HTMLAudioElement,
            audio2Element: Readonly<HTMLAudioElement>
        ) {
            const newCurrentTime = audio1Element.currentTime = audio1Element.currentTime - 10;
            this.currentTimeChanged(newCurrentTime, currentEpisode, audio1Element, audio2Element);
        }

        skipForward(
            currentEpisode: Readonly<Episode>,
            audio1Element: HTMLAudioElement,
            audio2Element: Readonly<HTMLAudioElement>
        ) {
            const newCurrentTime = audio1Element.currentTime = audio1Element.currentTime + 10;
            this.currentTimeChanged(newCurrentTime, currentEpisode, audio1Element, audio2Element);
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

        async timeUpdated(currentEpisode: Readonly<Episode>, audioElement: Readonly<HTMLAudioElement>) {
           
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

        async handlePlayback(
            currentEpisode: Readonly<Episode>,
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

                Store.dispatch({
                    type: 'SET_AUDIO_1_SRC',
                    audio1Src: ''
                });

                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                    currentEpisodeDownloadIndex: 0
                });

                if (currentEpisode.downloadState === 'DOWNLOADED') {
                    this.episodeAudioInfo = await getEpisodeAudioInfo(currentEpisode);

                    this.mediaSource = new MediaSource();

                    Store.dispatch({
                        type: 'SET_AUDIO_1_SRC',
                        audio1Src: window.URL.createObjectURL(this.mediaSource)
                    });

                    await new Promise((resolve) => this.mediaSource.addEventListener('sourceopen', resolve));

                    this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');

                    await addArrayBufferToSourceBuffer(currentEpisode, Store.getState().currentEpisodeDownloadIndex, this.sourceBuffer);
        
                    this.mediaSource.duration = this.episodeAudioInfo.duration;
                }
                else {
                    Store.dispatch({
                        type: 'SET_AUDIO_1_SRC',
                        audio1Src: currentEpisode.src
                    });
                }

                // Store.dispatch({
                //     type: 'SET_AUDIO_1_SRC',
                //     audio1Src: ''
                // });

                // TODO we'll have to change the indeces when trying to get a downloaded episode to play at a given position
                // TODO we really need a way to make current time/progress to an index...I think we'll need to load up all of the episode info into an index
                // TODO on first load unfortunately
                // const audioSources: Readonly<AudioSources> = await getInitialAudioSources(currentEpisode, 0);

                // TODO I need to add the check for iOS, in case mediasource is not supported. In that case just grab the blob and do createObjectUrl from that
                // if (currentEpisode.downloadState === 'DOWNLOADED') {

                //     const mediaSource: Readonly<MediaSource> = new MediaSource();
    
                //     Store.dispatch({
                //         type: 'SET_AUDIO_1_SRC',
                //         audio1Src: window.URL.createObjectURL(mediaSource)
                //     });
    
                //     await new Promise((resolve) => {
                //         mediaSource.addEventListener('sourceopen', async () => {
                //             // window.URL.revokeObjectURL(audio1Element.src);
        
                //             // const sourceBuffer: Readonly<SourceBuffer> = mediaSource.addSourceBuffer('audio/mpeg');
                        
                //             await addArrayBuffersToSourceBuffer(currentEpisode, mediaSource);
        
                //             resolve();
                //             // const blob = await new Response().arrayBuffer();
                //         });
                //     });
                // }
                // else {
                //     audio1Element.src = currentEpisode.src;
                // }

                // // TODO these probably need to be atomic
                // Store.dispatch({
                //     type: 'SET_AUDIO_1_SRC',
                //     audio1Src: audioSources.audio1Src
                // });

                // Store.dispatch({
                //     type: 'SET_AUDIO_2_SRC',
                //     audio2Src: audioSources.audio2Src
                // });

                // Store.dispatch({
                //     type: 'SET_AUDIO_1_PLAYING',
                //     audio1Playing: true
                // });

                // Store.dispatch({
                //     type: 'SET_AUDIO_2_PLAYING',
                //     audio2Playing: false
                // });

                // Store.dispatch({
                //     type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX',
                //     currentEpisodeDownloadIndex: 2
                // });

                audio1Element.currentTime = parseFloat(currentEpisode.progress);
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

        setupMediaNotification(
            currentPodcast: Readonly<Podcast>,
            currentEpisode: Readonly<Episode>,
            audio1Element: Readonly<HTMLAudioElement>,
            audio2Element: Readonly<HTMLAudioElement>
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
                    this.skipBack(currentEpisode, audio1Element, audio2Element);
                });
    
                navigator.mediaSession.setActionHandler('seekforward', () => {
                    this.skipForward(currentEpisode, audio1Element, audio2Element);                
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

        render(state: Readonly<State>): Readonly<TemplateResult> {
                        
            const audio1Element: HTMLAudioElement | null = this.querySelector('#audio-1');
            const audio2Element: HTMLAudioElement | null = this.querySelector('#audio-2');
            const currentEpisode: Readonly<Episode> | undefined | null = state.episodes[state.currentEpisodeGuid];
            const currentPodcast: Readonly<Podcast> | undefined | null = currentEpisode ? state.podcasts[currentEpisode.feedUrl] : null;
            const duration: number | 'UNKNOWN' = currentEpisode && audio1Element && audio2Element ? getDuration(currentEpisode, audio1Element, audio2Element) : 'UNKNOWN';            
            const progressPercentage: number | 'UNKNOWN' = currentEpisode && duration !== 'UNKNOWN' ? getProgressPercentage(currentEpisode, duration) : 'UNKNOWN';
            const progress: number | 'UNKNOWN' = currentEpisode && !isNaN(parseFloat(currentEpisode.progress)) ? parseFloat(currentEpisode.progress) : 'UNKNOWN';
            const formattedDuration: string | 'UNKNOWN' = duration !== 'UNKNOWN' ? secondsToHoursMinutesSeconds(duration) : 'UNKNOWN';
            const formattedProgress: string =  progress !== 'UNKNOWN' ? secondsToHoursMinutesSeconds(progress) : 'UNKNOWN';
            const currentEpisodeDownloadIndex: number = state.currentEpisodeDownloadIndex;

            const handlePlaybackParamsDefined: boolean = (
                currentEpisode !== null &&
                currentEpisode !== undefined &&
                currentPodcast !== null &&
                currentPodcast !== undefined &&
                audio1Element !== null &&
                audio1Element !== undefined &&
                audio2Element !== null &&
                audio2Element !== undefined
            );

            if (handlePlaybackParamsDefined && audio1Element !== null && audio2Element !== null && currentPodcast !== null) {
                this.handlePlayback(
                    currentEpisode,
                    state.previousEpisodeGuid,
                    state.currentEpisodeGuid,
                    audio1Element,
                    audio2Element,
                    state.audio1Playing,
                    state.audio2Playing
                );
                this.setupMediaNotification(currentPodcast, currentEpisode, audio1Element, audio2Element);
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
                                        this.currentTimeChanged(parseFloat((e.target as any).value), currentEpisode, audio1Element, audio2Element);
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

        // if (currentEpisode.downloadState === 'DOWNLOADED') {
            // TODO not sure how we're going to get this duration...we could calculate perhaps based on file type, byte length, and bitrate, but that sounds complicated
            // TODO we might also be able to load up ephemeral audio elements and grab their durations, summing them up and letting them get immediately garbage collected
            // return 'UNKNOWN';
        // }

        // if (
            // currentEpisode.downloadState === 'NOT_DOWNLOADED' ||
            // currentEpisode.downloadState === 'DOWNLOADING'
        // ) {
            if (!isNaN(audio1Element.duration)) {
                return audio1Element.duration;
            }
            else {
                return 'UNKNOWN';
            }   
        // }

        // return 'UNKNOWN';
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
    ): Promise<'CHUNK_APPENDED' | 'NO_MORE_CHUNKS'> {
        const chunk: ArrayBuffer | null | undefined = await get(`${episode.guid}-audio-file-array-buffer-${chunkIndex}`);

        if (
            chunk === null ||
            chunk === undefined
        ) {
            // sourceBuffer.addEventListener('updateend', () => {
                // mediaSource.endOfStream();
            // });
            return 'NO_MORE_CHUNKS';
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

    async function getEpisodeChunk(episode: Episode, chunkIndex: number) {
        const chunk: ArrayBuffer | null | undefined = await get(`${episode.guid}-audio-file-array-buffer-${chunkIndex}`);

        return chunk;
    }
});
