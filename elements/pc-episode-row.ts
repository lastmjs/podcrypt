import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { 
    pxXSmall,
    pxSmall,
    pxXXXSmall,
    normalShadow,
    colorBlackMedium,
    color1Full,
    pxXXSmall,
    pxXXLarge,
    colorBlackVeryLight
 } from '../services/css';
import { 
    navigate,
    addEpisodeToPlaylist,
    corsAnywhereProxy
} from '../services/utilities';
import { set } from 'idb-keyval';

StorePromise.then((Store) => {
    customElement('pc-episode-row', ({ constructing, props }) => {

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
                    white-space: nowrap;
                    overflow: hidden;
                    width: 60vw; /*TODO I want this width to be based on its container*/
                    margin-bottom: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-episode-row-text-container {
                    flex: 1;
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
                }

                .pc-episode-row-controls-container {
                    display: flex;
                    padding-left: ${pxSmall};
                    align-items: center;
                    justify-content: center;
                }

                .pc-episode-row-control {
                    font-size: ${pxXXLarge};
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

                .pc-episode-row-currently-playing {
                    background-color: ${colorBlackVeryLight};
                }
            </style>

            <div class="pc-episode-row-main-container${props.podcast && props.episode && props.currentlyPlaying ? ' pc-episode-row-currently-playing' : ''}">
                ${
                    props.podcast && props.episode ?
                        html`
                            ${
                                props.arrows ?
                                html`
                                    <div class="pc-episode-row-arrows-container">
                                        <i 
                                            class="material-icons pc-playlist-item-arrow"
                                            @click=${() => moveEpisodeUp(props.episode.guid)}
                                        >
                                            keyboard_arrow_up
                                        </i>

                                        <i 
                                            class="material-icons pc-playlist-item-arrow"
                                            @click=${() => moveEpisodeDown(props.episode.guid)}
                                        >
                                            keyboard_arrow_down
                                        </i>
                                    </div>                                    
                                ` :
                                html``
                            }

                            <div 
                                class="pc-episode-row-text-container"
                                @click=${() => navigate(Store, `/episode-overview?feedUrl=${props.podcast.feedUrl}&episodeGuid=${props.episode.guid}`)}
                            >
                                ${
                                    props.podcastTitle ?
                                    html`
                                        <div class="pc-episode-row-podcast-title">${props.podcast.title}</div>
                                    ` :
                                    html``
                                }

                                <div class="pc-episode-row-episode-title${props.episode.finishedListening ? ' pc-episode-row-episode-title-finished-listening' : ''}">${props.episode.title}</div>

                                ${
                                    props.date ?
                                    html`<div class="pc-episode-row-date">${new Date(props.episode.isoDate).toLocaleDateString()}</div>`:
                                    html``
                                }
                            </div>

                            ${
                                props.play || props.playlist ?
                                    html`
                                        <div class="pc-episode-row-controls-container">
                                            
                                            ${
                                                props.playlist ? 
                                                    html`
                                                        <i 
                                                            class="material-icons pc-episode-row-control"
                                                             @click=${() => addEpisodeToPlaylist(Store, props.podcast, props.episode)}
                                                        >
                                                            playlist_add
                                                        </i>
                                                    ` : html``
                                            }
                                            
                                            ${
                                                props.play && props.episode.playing ? 
                                                html`<i class="material-icons pc-episode-row-control" @click=${() => pauseEpisode(props.episode.guid)} title="Pause episode">pause</i>` : 
                                                html`<i class="material-icons pc-episode-row-control" @click=${() => playEpisode(props.podcast, props.episode)} title="Resume episode">play_arrow</i>`
                                            }
                                        </div>
                                    ` : html``
                            }

                            ${
                                props.options ?
                                html`
                                    <select
                                        @change=${(e: any) => optionsChange(e, props.episode)}
                                        class="pc-episode-row-options-select"
                                    >
                                        <option>...</option>
                                        <option>Download</option>
                                        <option>Remove from playlist</option>
                                    </select>
                                ` :
                                html``
                            }
                        ` : 
                        html`<div>No episode found</div>`
                }
            </div>
        `;
    });

    function playEpisode(podcast: Readonly<Podcast>, item: any) {
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

    async function optionsChange(e: any, episode: Readonly<Episode>) {

        // TODO constantize each of the options in the dropdown

        if (e.target.value === 'Remove from playlist') {
            removeEpisodeFromPlaylist(episode.guid);
        }

        if (e.target.value === 'Download') {
            try {
                const confirmed = confirm('Downloads are experimental. Do you want to go for it anyway?');
    
                if (confirmed) {
                    const audioFileResponse = await fetch(`${corsAnywhereProxy}${episode.src}`);
    
                    const audioFileBlob = await audioFileResponse.blob();
                 
                    await set(`${episode.guid}-audio-file-blob`, audioFileBlob);
                }
            }
            catch(error) {
                alert(error);
            }
        }

        e.target.value = '...';
    }

    function removeEpisodeFromPlaylist(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'REMOVE_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }
});