import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { 
    pxXSmall,
    pxSmall,
    pxXXXSmall,
    normalShadow,
    colorBlackMedium,
    color1Full,
    pxXXSmall,
    pxXXLarge,
    colorBlackVeryLight,
    zero,
    one
 } from '../services/css';
import { 
    navigate,
    addEpisodeToPlaylist,
    getAudioFileResponse,
    copyTextToClipboard,
    podcryptProxy
} from '../services/utilities';
import { 
    set,
    del,
    keys
} from 'idb-keyval';
import './pc-loading';

StorePromise.then((Store) => {
    customElement('pc-episode-row', ({ 
        constructing,
        podcast,
        episode,
        arrows,
        options,
        play,
        playlist,
        date,
        podcastTitle,
        currentlyPlaying
     }) => {

        if (constructing) {
            return {
                podcast: null,
                episode: null,
                arrows: false,
                options: false,
                play: false,
                playlist: false,
                date: false,
                podcastTitle: false,
                currentlyPlaying: false
            };
        }

        return html`
            <style>
                .pc-episode-row-main-container {
                    box-shadow: ${normalShadow};
                    display: flex;
                    position: relative;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                }

                .pc-episode-row-podcast-title {
                    font-size: ${pxXSmall};
                    color: ${color1Full};
                    text-overflow: ellipsis;
                    white-space: wrap;
                    overflow: hidden;
                    margin-bottom: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-episode-row-text-container {
                    flex: 1;
                    cursor: pointer;
                }

                .pc-episode-row-episode-title {
                    font-size: ${pxSmall};
                    font-weight: bold;
                }

                .pc-episode-row-episode-title-finished-listening {
                    font-weight: normal;
                    color: ${colorBlackMedium};
                }

                .pc-episode-row-arrows-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: ${pxXXSmall};
                    justify-content: center;
                    cursor: pointer;
                }

                .pc-episode-row-controls-container {
                    display: flex;
                    padding-left: ${pxSmall};
                    align-items: center;
                    justify-content: center;
                }

                .pc-episode-row-control {
                    font-size: ${pxXXLarge};
                    cursor: pointer;
                }

                .pc-episode-row-date {
                    font-size: ${pxXSmall};
                    color: grey;
                    margin-top: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-episode-row-options-select {
                    border: none;
                    background-color: transparent;
                    width: 35px;
                    cursor: pointer;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    z-index: ${one};
                }

                .pc-episode-row-downloaded-container {
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    position: absolute;
                    bottom: 5px;
                    right: 10px;
                    z-index: ${zero};
                }

                .pc-episode-row-downloaded-icon {
                    font-size: ${pxSmall};
                    color: green;
                }

                .pc-episode-row-currently-playing {
                    background-color: ${colorBlackVeryLight};
                }
            </style>

            <div class="pc-episode-row-main-container${podcast && episode && currentlyPlaying ? ' pc-episode-row-currently-playing' : ''}">
                <pc-loading
                    .hidden=${
                        !episode ||
                        !Store.getState().episodes[episode.guid] ||
                        Store.getState().episodes[episode.guid].downloadState !== 'DOWNLOADING'
                    }
                    .prename=${`pc-episode-row-${episode ? episode.guid : ''}`}
                    .message=${'Downloading'}
                    .spinnerWidth=${'25px'}
                    .spinnerHeight=${'25px'}
                    .spinnerMarginTop=${'10px'}
                ></pc-loading>
                
                ${
                    podcast && episode ?
                        html`
                            ${
                                arrows ?
                                html`
                                    <div class="pc-episode-row-arrows-container">
                                        <i 
                                            class="material-icons pc-playlist-item-arrow"
                                            @click=${() => moveEpisodeUp(episode.guid)}
                                        >
                                            keyboard_arrow_up
                                        </i>

                                        <i 
                                            class="material-icons pc-playlist-item-arrow"
                                            @click=${() => moveEpisodeDown(episode.guid)}
                                        >
                                            keyboard_arrow_down
                                        </i>
                                    </div>                                    
                                ` :
                                html``
                            }

                            <div 
                                class="pc-episode-row-text-container"
                                @click=${() => navigate(Store, `/episode-overview?feedUrl=${podcast.feedUrl}&episodeGuid=${episode.guid}`)}
                            >
                                ${
                                    podcastTitle ?
                                    html`
                                        <div class="pc-episode-row-podcast-title">${podcast.title}</div>
                                    ` :
                                    html``
                                }

                                <div class="pc-episode-row-episode-title${episode.finishedListening ? ' pc-episode-row-episode-title-finished-listening' : ''}">${episode.title}</div>

                                ${
                                    date ?
                                    html`<div class="pc-episode-row-date">${new Date(episode.isoDate).toLocaleDateString()}</div>`:
                                    html``
                                }
                            </div>

                            ${
                                play || playlist ?
                                    html`
                                        <div class="pc-episode-row-controls-container">
                                            
                                            ${
                                                playlist ? 
                                                    html`
                                                        <i 
                                                            class="material-icons pc-episode-row-control"
                                                             @click=${() => {
                                                                 Store.dispatch({
                                                                    type: 'ADD_EPISODE_TO_PLAYLIST',
                                                                    episode,
                                                                    podcast
                                                                });
                                                             }}
                                                        >
                                                            playlist_add
                                                        </i>
                                                    ` : html``
                                            }
                                            
                                            ${
                                                play && episode.playing ? 
                                                html`<i class="material-icons pc-episode-row-control" @click=${() => pauseEpisode(episode.guid)} title="Pause episode">pause</i>` : 
                                                html`<i class="material-icons pc-episode-row-control" @click=${() => playEpisode(podcast, episode)} title="Resume episode">play_arrow</i>`
                                            }
                                        </div>
                                    ` : html``
                            }

                            ${
                                options ?
                                html`
                                    <select
                                        @change=${(e: any) => optionsChange(e, podcast, episode)}
                                        class="pc-episode-row-options-select"
                                    >
                                        <option>...</option>
                                        <option>Copy episode URL</option>
                                        <option>Download</option>
                                        <option>Mark listened</option>
                                        <option>Mark unlistened</option>
                                        <option>Remove from playlist</option>
                                        <option>Delete</option>
                                    </select>
                                ` :
                                html``
                            }

                            ${
                                Store.getState().episodes[episode.guid] && (Store.getState().episodes[episode.guid].downloadState === 'DOWNLOADED' || Store.getState().episodes[episode.guid].downloadState === 'DOWNLOADING') ?
                                html`
                                    <div class="pc-episode-row-downloaded-container">
                                        ${
                                            Store.getState().episodes[episode.guid].downloadState === 'DOWNLOADED' ?
                                            html`
                                                <i 
                                                    class="material-icons pc-episode-row-downloaded-icon"
                                                >
                                                    done
                                                </i>
                                            ` :
                                            html`<div>Downloading...${Store.getState().episodes[episode.guid].downloadProgressPercentage}%</div>`
                                        }
                                    </div>
                                ` :
                                html``
                            }
                        ` : 
                        html`<div>No episode found</div>`
                }
            </div>
        `;
    });

    function playEpisode(podcast: Readonly<Podcast>, item: Readonly<FeedItem>) {
        addEpisodeToPlaylist(Store, podcast, item);
       
        const episodeGuid: EpisodeGuid = item.guid;

        // TODO this action type should be changed, same as in the playlist
        Store.dispatch({
            type: 'PLAY_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }

    function pauseEpisode(episodeGuid: EpisodeGuid) {
        // TODO this action type should be changed, same as in the playlist
        Store.dispatch({
            type: 'PAUSE_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }

    function moveEpisodeUp(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'MOVE_EPISODE_UP',
            episodeGuid
        });
    }

    function moveEpisodeDown(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'MOVE_EPISODE_DOWN',
            episodeGuid
        });
    }

    async function optionsChange(e: any, podcast: Readonly<Podcast>, episode: Readonly<Episode>) {

        // TODO constantize each of the options in the dropdown

        const value = e.target.value;

        e.target.value = '...';

        if (value === 'Remove from playlist') {
            removeEpisodeFromPlaylist(episode.guid);
        }

        if (value === 'Download') {
            try {
                const confirmed = !['iPad', 'iPhone', 'iPod', 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator'].includes(navigator.platform) || confirm('Downloads are experimental. Do you want to go for it anyway?');
    
                if (confirmed) {
                    Store.dispatch({
                        type: 'ADD_OR_UPDATE_EPISODE',
                        podcast,
                        episode
                    });

                    Store.dispatch({
                        type: 'SET_EPISODE_DOWNLOAD_STATE',
                        episodeGuid: episode.guid,
                        downloadState: 'DOWNLOADING'
                    });

                    // TODO sometime we may want to chunk up the download again, but for now we are doing straight downloads
                    // TODO the problem might come with doing multiple downloads at once. If we chunk, we might be able to handle
                    // TODO many more downloads concurrently. Might though, I am not sure on the mechanics of how the browser
                    // TODO is going to handle multiple download requests versus many chunked requests. http2 might help us here
                    // const resourceLengthInBytes: number = await fetchResourceLengthInBytes(`${corsAnywhereProxy}${episode.src}`);
                    // console.log('resourceLengthInBytes', resourceLengthInBytes);
                    // const audioFileBlob: Blob = await fetchFileBlob(resourceURL, resourceLengthInBytes);
                    // const audioFileBlob: Blob = await fetchFileBlob(`https://yacdn.org/proxy/${episode.src}`);
                    
                    // const resourceURL: string = `${podcryptProxy}${episode.src}`;
                    // const response = await window.fetch(resourceURL);

                    // const response = await getAudioFileResponse(episode.src);
                    
                    // if (
                    //     response.ok === false
                    //     // TODO I am not sure if checking the ok property or the status code will be best here
                    //     // response.status.toString().startsWith('4') ||
                    //     // response.status.toString().startsWith('5')
                    // ) {
                    //     // TODO perhaps make a very easy way for people to get in contact with the Podcrypt team
                    //     throw new Error(`The file could not be downloaded. The response status was ${response.status}`);
                    // }

                    // const audioFileArrayBuffer = await response.arrayBuffer();

                    await fetchAndSaveAudioFileArrayBuffer(episode);

                    // TODO somewhere in this process iOS Safari fails with a null exception, and I believe it is while saving to indexedDB
                    // TODO I believe iOS indexeddb does not support storing blobs. try an arraybuffer instead
                    // await set(`${episode.guid}-audio-file-array-buffer`, audioFileArrayBuffer);

                    // const audioFileResponse = await fetch(`${podcryptProxy}${episode.src}`);

                    // console.log('audioFileResponse', audioFileResponse);

                    // const cache = await window.caches.open('EPISODE_AUDIO_CACHE');

                    // await cache.put(`${podcryptProxy}${episode.src}`, audioFileResponse);

                    Store.dispatch({
                        type: 'SET_EPISODE_DOWNLOAD_STATE',
                        episodeGuid: episode.guid,
                        downloadState: 'DOWNLOADED'
                    });

                    // Store.dispatch({
                    //     type: 'SET_PREVIOUS_EPISODE_GUID',
                    //     previousEpisodeGuid: 'NOT_SET'
                    // });
                }
            }
            catch(error) {
                alert(error);
            }
        }

        if (value === 'Delete') {
            try {
                for (let i=0; i < episode.downloadChunkData.length; i++) {
                    const downloadChunkDatum: Readonly<DownloadChunkDatum> = episode.downloadChunkData[i];

                    await del(downloadChunkDatum.key);
                }

                Store.dispatch({
                    type: 'SET_EPISODE_DOWNLOAD_CHUNK_DATA',
                    episodeGuid: episode.guid,
                    downloadChunkData: []
                });

                Store.dispatch({
                    type: 'SET_EPISODE_DOWNLOAD_STATE',
                    episodeGuid: episode.guid,
                    downloadState: 'NOT_DOWNLOADED'
                });

                Store.dispatch({
                    type: 'SET_DOWNLOAD_PROGRESS_PERCENTAGE_FOR_EPISODE',
                    episodeGuid: episode.guid,
                    downloadProgressPercentage: 0
                });
            }
            catch(error) {
                alert(error);
            }
        }

        if (value === 'Mark listened') {
            Store.dispatch({
                type: 'ADD_OR_UPDATE_EPISODE',
                podcast,
                episode
            });

            Store.dispatch({
                type: 'MARK_EPISODE_LISTENED',
                episodeGuid: episode.guid
            })
        }

        if (value === 'Mark unlistened') {
            Store.dispatch({
                type: 'ADD_OR_UPDATE_EPISODE',
                podcast,
                episode
            });

            Store.dispatch({
                type: 'MARK_EPISODE_UNLISTENED',
                episodeGuid: episode.guid
            })
        }

        if (value === 'Copy episode URL') {
            copyTextToClipboard(`${window.location.origin}/episode-overview?feedUrl=${podcast.feedUrl}&episodeGuid=${episode.guid}`);
        }
    }

    function removeEpisodeFromPlaylist(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'REMOVE_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }

    // async function fetchResourceLengthInBytes(url: string): Promise<number> {
    //     const audioFileHeadResponse = await fetch(url, {
    //         method: 'HEAD'
    //     });

    //     return audioFileHeadResponse.headers.get('Content-Length');
    // }

    // TODO add in not going straight to the podcrypt proxy
    async function fetchAndSaveAudioFileArrayBuffer(
        episode: Readonly<Episode>,
        index: number=0,
        rangeStart: number=0,
        rangeEnd: number=5242879,
        arrayBuffer: ArrayBuffer=new ArrayBuffer(0)
    ): Promise<ArrayBuffer> {
                
        const audioFileResponse = await fetch(`${podcryptProxy}${episode.src}`, {
            headers: {
                'Range': `bytes=${rangeStart}-${rangeEnd}`
            }
        });

        if (
            audioFileResponse.ok === false
            // TODO I am not sure if checking the ok property or the status code will be best here
            // response.status.toString().startsWith('4') ||
            // response.status.toString().startsWith('5')
        ) {
            // TODO perhaps make a very easy way for people to get in contact with the Podcrypt team
            throw new Error(`The file could not be downloaded. The response status was ${audioFileResponse.status}`);
        }

        const audioFileBlob = await audioFileResponse.blob();

        console.log(audioFileResponse.headers.get('Content-Range'));

        const contentRangeHeaderValue = audioFileResponse.headers.get('Content-Range');

        // const bytes = contentRangeHeaderValue.match(/bytes ((\d*)-(\d*)|\*)\/(\d*\*?)/);

        // console.log(bytes);

        // TODO we might have to deal with bytes=1- or */ or something weird like that, make sure to handle everything
        // const bytes = contentRangeHeaderValue.replace('bytes=', '').split('-');

        // const start = parseInt(bytes[0]);
        // const end = parseInt(bytes[1]);

        const responseContentLength: string | null = audioFileResponse.headers.get('Content-Length');

        if (
            responseContentLength === null
        ) {
            throw new Error('The file could not be downloaded. The Content-Length header was not set');
        }

        console.log(`audioFileResponse.headers.get('Content-Length')`, audioFileResponse.headers.get('Content-Length'));

        // TODO add a property for download progress
        const { 
            start,
            end,
            total
        } = getStartAndEndAndTotalFromContentRangeHeader(contentRangeHeaderValue, parseInt(responseContentLength));

        const idbKey = `${episode.guid}-${start}-${end}`;

        // TODO well, iOS only just started in 12.4 to allow blobs to be saved in IndexedDB...should I just store as arraybuffers and do the conversion in the service worker?
        await set(idbKey, audioFileBlob);

        Store.dispatch({
            type: 'ADD_DOWNLOAD_CHUNK_DATUM_TO_EPISODE',
            episodeGuid: episode.guid,
            downloadChunkDatum: {
                startByte: start,
                endByte: end,
                key: idbKey
            }
        });

        const downloadProgressPercentage: number = Math.ceil((end / total) * 100);

        Store.dispatch({
            type: 'SET_DOWNLOAD_PROGRESS_PERCENTAGE_FOR_EPISODE',
            episodeGuid: episode.guid,
            downloadProgressPercentage
        })

        if (
            parseInt(responseContentLength) < 5242880
        ) {
            return arrayBuffer;
        }

        return await fetchAndSaveAudioFileArrayBuffer(episode, index + 1, rangeStart + 5242879, rangeEnd + 5242879, arrayBuffer);
    }

    function getStartAndEndAndTotalFromContentRangeHeader(
        contentRangeHeader: string | null,
        contentLength: number
    ): { start: number; end: number; total: number } {

        if (contentRangeHeader === null) {
            return {
                start: 0,
                end: contentLength - 1,
                total: contentLength
            };
        }
        else {
            const bytes: Readonly<RegExpMatchArray> | null = contentRangeHeader.match(/bytes ((\d*)-(\d*)|\*)\/(\d*\*?)/);
            
            if (bytes === null) {
                throw new Error('The file could not be downloaded. Faulty mach on Content-Range header');
            }
    
            if (bytes[1] === '*') {
                return {
                    start: 0,
                    end: parseInt(bytes[4]),
                    total: parseInt(bytes[4])
                };
            }
            else {
                return {
                    start: parseInt(bytes[2]),
                    end: parseInt(bytes[3]),
                    total: parseInt(bytes[4])
                }
            }
        }

    }
});