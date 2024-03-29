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
    one,
    alertPadding
 } from '../services/css';
import { 
    navigate,
    addEpisodeToPlaylist,
    copyTextToClipboard,
    podcryptProxy,
    deleteDownloadedEpisode,
    fiveMegabytesInBytes
} from '../services/utilities';
import { 
    set,
    del,
    keys
} from 'idb-keyval';
import './pc-loading';
import { 
    pcAlert,
    PCModal
} from './pc-modal';

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
                    .hidden=${true}
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
                                    <i
                                        class="material-icons pc-podcast-row-options-icon"
                                        @click=${() => pcAlert(html`
                                            <div style="display: flex; flex-direction: column; align-items: center">
                                                <div 
                                                    class="pc-podcast-row-options-item"
                                                    @click=${() => {
                                                        copyEpisodeURLOption(podcast, episode);
                                                        (document.querySelector('pc-modal') as Readonly<PCModal>).closeClick();
                                                    }}
                                                >
                                                    Copy episode URL
                                                </div>
                                                <div
                                                    class="pc-podcast-row-options-item"
                                                    @click=${() => {
                                                        downloadOption(podcast, episode);
                                                        (document.querySelector('pc-modal') as Readonly<PCModal>).closeClick();
                                                    }}
                                                >
                                                    Download
                                                </div>
                                                <div 
                                                    class="pc-podcast-row-options-item"
                                                    @click=${() => {
                                                        markListenedOption(podcast, episode);
                                                        (document.querySelector('pc-modal') as Readonly<PCModal>).closeClick();
                                                    }}
                                                >
                                                    Mark listened
                                                </div>
                                                <div 
                                                    class="pc-podcast-row-options-item"
                                                    @click=${() => {
                                                        markUnlistenedOption(podcast, episode);
                                                        (document.querySelector('pc-modal') as Readonly<PCModal>).closeClick();
                                                    }}
                                                >
                                                    Mark unlistened
                                                </div>
                                                <div 
                                                    class="pc-podcast-row-options-item"
                                                    @click=${() => {
                                                        removeFromPlaylistOption(episode);
                                                        (document.querySelector('pc-modal') as Readonly<PCModal>).closeClick();
                                                    }}
                                                >
                                                    Remove from playlist
                                                </div>
                                                <div 
                                                    class="pc-podcast-row-options-item"
                                                    @click=${() => {
                                                        deleteOption(episode);
                                                        (document.querySelector('pc-modal') as Readonly<PCModal>).closeClick();
                                                    }}
                                                >
                                                    Delete
                                                </div>
                                            </div>
                                        `, Store.getState().screenType)}
                                    >
                                        more_horiz
                                    </i>
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

    function copyEpisodeURLOption(podcast: Readonly<Podcast>, episode: Readonly<Episode>) {
        copyTextToClipboard(`${window.location.origin}/episode-overview?feedUrl=${podcast.feedUrl}&episodeGuid=${episode.guid}`);
    }

    async function downloadOption(podcast: Readonly<Podcast>, episode: Readonly<Episode>) {
        try {
            Store.dispatch({
                type: 'ADD_OR_UPDATE_EPISODE',
                podcast,
                episode
            });

            // this is to ensure we have a clean slate before overwriting the data
            await deleteDownloadedEpisode(Store, episode);

            Store.dispatch({
                type: 'SET_EPISODE_DOWNLOAD_STATE',
                episodeGuid: episode.guid,
                downloadState: 'DOWNLOADING'
            });

            await fetchAndSaveAudioFile(episode);

            Store.dispatch({
                type: 'SET_EPISODE_DOWNLOAD_STATE',
                episodeGuid: episode.guid,
                downloadState: 'DOWNLOADED'
            });

            // TODO this is so that when switching between episodes, the episode will play
            // TODO this could probably be in a more elegant way
            Store.dispatch({
                type: 'RENDER'
            });
        }
        catch(error) {
            await deleteDownloadedEpisode(Store, episode);
            
            if (error.toString().includes('QuotaExceededError')) {
                pcAlert(html`
                    <div style="${alertPadding}">
                        <div>You have run out of storage space.</div>
                        <br>
                        <div>Go to podcrypt.app/downloads for more information</div>
                    </div>
                `, Store.getState().screenType);
            }
            else {
                pcAlert(html`
                    <div style="${alertPadding}">${error}</div>
                `, Store.getState().screenType);
            }
        }
    }

    async function markListenedOption(podcast: Readonly<Podcast>, episode: Readonly<Episode>) {
        Store.dispatch({
            type: 'ADD_OR_UPDATE_EPISODE',
            podcast,
            episode
        });

        Store.dispatch({
            type: 'MARK_EPISODE_LISTENED',
            episodeGuid: episode.guid
        });
    }

    async function markUnlistenedOption(podcast: Readonly<Podcast>, episode: Readonly<Episode>) {
        Store.dispatch({
            type: 'ADD_OR_UPDATE_EPISODE',
            podcast,
            episode
        });

        Store.dispatch({
            type: 'MARK_EPISODE_UNLISTENED',
            episodeGuid: episode.guid
        });
    }

    async function removeFromPlaylistOption(episode: Readonly<Episode>) {
        removeEpisodeFromPlaylist(episode.guid);
    }

    async function deleteOption(episode: Readonly<Episode>) {
        try {
            await deleteDownloadedEpisode(Store, episode);
        }
        catch(error) {
            pcAlert(html`
                <div style="${alertPadding}">${error}</div>
            `, Store.getState().screenType);
        }
    }

    function removeEpisodeFromPlaylist(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'REMOVE_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }

    async function fetchAndSaveAudioFile(
        episode: Readonly<Episode>,
        attempt: number=0,
        rangeStart: number=0,
        rangeEnd: number=fiveMegabytesInBytes - 1
    ): Promise<void> {
                
        try {
            const audioFileResponse = await fetch(`${attempt === 0 ? '' : podcryptProxy}${episode.src}`, {
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
                // if (attempt === 0) {
                //     return await fetchAndSaveAudioFile(episode, attempt + 1);
                // }
                // else {
                    // TODO perhaps make a very easy way for people to get in contact with the Podcrypt team
                    throw new Error(`The file could not be downloaded. The response status was ${audioFileResponse.status}`);
                // }
            }
    
            const audioFileBlob = await audioFileResponse.blob();
    
            const contentRangeHeaderValue: string | null = audioFileResponse.headers.get('Content-Range');
    
            if (contentRangeHeaderValue === null) {
                console.log('No Content-Range header');
                throw new Error('The file could not be downloaded. No Content-Range header');
            }

            const contentLengthHeaderValue: string | null = audioFileResponse.headers.get('Content-Length');
    
            if (
                contentLengthHeaderValue === null
            ) {
                console.log('The file could not be downloaded. No Content-Length header');
                throw new Error('The file could not be downloaded. No Content-Length header');
            }
    
            const { 
                start,
                end,
                total
            } = getStartAndEndAndTotalFromContentRangeHeader(contentRangeHeaderValue);
    
            console.log('start', start);
            console.log('end', end);
            console.log('total', total);

            const idbKey = `${episode.guid}-${start}-${end}`;
    
            console.log('idbKey', idbKey);

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
                parseInt(contentLengthHeaderValue) < fiveMegabytesInBytes
            ) {
                return;
            }
    
            await fetchAndSaveAudioFile(episode, attempt, rangeStart + fiveMegabytesInBytes, rangeEnd + fiveMegabytesInBytes);

        }
        catch(error) {
            if (attempt === 0) {
                await fetchAndSaveAudioFile(episode, attempt + 1);
            }
            else {
                throw new Error(error);
            }
        }
    }

    function getStartAndEndAndTotalFromContentRangeHeader(
        contentRangeHeader: string
    ): { start: number; end: number; total: number } {

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
});
