import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';

StorePromise.then((Store) => {
    // TODO we might be repeating a lot of code, think about making a component for the episode items
    customElement('pc-playlist', ({ constructing, update }) => {
        if (constructing) {
            Store.subscribe(update);
        }


        return html`
            <style>
                .pc-playlist-container {
                    ${pcContainerStyles}
                    padding-left: 0;
                    padding-right: 0;
                }

                .pc-playlist-item {
                    display: flex;
                    position: relative;
                    box-shadow: 0 4px 2px -2px grey;
                    padding: 2%;
                }

                .pc-playlist-item-arrows-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .pc-playlist-item-arrow {
                    font-size: calc(25px + 1vmin);
                    cursor: pointer;
                }

                .pc-playlist-item-title {
                    text-overflow: ellipsis;
                    flex: 1;
                    font-size: calc(12px + 1vmin);
                    padding: 2%;
                    font-weight: bold;
                }

                .pc-playlist-item-controls-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pc-playlist-item-audio-control {
                    font-size: calc(35px + 1vmin);
                    cursor: pointer;
                }
            </style>

            <div class="pc-playlist-container">
                ${(Store.getState() as any).playlist.map((episodeGuid: any, index: any) => {
                    const episode = (Store.getState() as any).episodes[episodeGuid];
                    const currentPlaylistIndex = (Store.getState() as any).currentPlaylistIndex;
                    const currentlyPlaying = currentPlaylistIndex === index;

                    return html`
                        <div
                            class="pc-playlist-item" style="${currentlyPlaying ? 'background-color: rgba(0, 0, 0, .05)' : ''}"
                        >
                            <div class="pc-playlist-item-arrows-container">
                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeUp(index)}
                                    title="Move episode up"
                                >keyboard_arrow_up</i>

                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeDown(index)}
                                    title="Move episode down"
                                >keyboard_arrow_down</i>
                            </div>
                            <div class="pc-playlist-item-title">${episode.finishedListening ? '*' : ''} ${episode.title}</div>
                            <div class="pc-playlist-item-controls-container">
                                ${
                                    episode.playing ? 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${pauseEpisode} title="Pause episode">pause</i>` : 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => playEpisode(index)} title="Resume episode">play_arrow</i>`
                                }

                                <!--TODO we need a three dots menu for the extra stuff here, like deleting-->
                                <i 
                                    class="material-icons"
                                    style="font-size: 15px; cursor: pointer; position: absolute; top: 5px; right: 5px"
                                    @click=${() => removeEpisodeFromPlaylist(index)}
                                    title="Remove episode from playlist"
                                >delete
                                </i>                                
                            </div>
                        </div>
                    `;
                })}
            </div>
        `;
    });

    function playEpisode(playlistIndex: number) {
        Store.dispatch({
            type: 'PLAY_EPISODE_FROM_PLAYLIST',
            playlistIndex
        });
    }

    function pauseEpisode() {
        Store.dispatch({
            type: 'PAUSE_EPISODE_FROM_PLAYLIST'
        });
    }

    function moveEpisodeUp(playlistIndex: number) {
        Store.dispatch({
            type: 'MOVE_EPISODE_UP',
            playlistIndex
        });
    }

    function moveEpisodeDown(playlistIndex: number) {
        Store.dispatch({
            type: 'MOVE_EPISODE_DOWN',
            playlistIndex
        });
    }

    function removeEpisodeFromPlaylist(playlistIndex: number) {
        Store.dispatch({
            type: 'REMOVE_EPISODE_FROM_PLAYLIST',
            playlistIndex
        });
    }
});