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
                }

                .pc-playlist-item {
                    display: flex;
                    box-shadow: 0 2px 1px -1px grey;
                    padding: 2%;
                    height: 10vh;
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
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow-x: scroll;
                    flex: 1;
                    font-size: calc(12px + 1vmin);
                    text-align: center;
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
                ${Store.getState().playlist.map((episodeGuid, index) => {
                    const episode = Store.getState().episodes[episodeGuid];
                    const currentPlaylistIndex = Store.getState().currentPlaylistIndex;
                    const currentlyPlaying = currentPlaylistIndex === index;

                    return html`
                        <div
                            class="pc-playlist-item" style="${currentlyPlaying ? 'background-color: grey' : ''}"
                        >
                            <div class="pc-playlist-item-arrows-container">
                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeUp(index)}
                                >keyboard_arrow_up</i>

                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeDown(index)}
                                >keyboard_arrow_down</i>
                            </div>
                            <div class="pc-playlist-item-title">${episode.finishedListening ? '*' : ''} ${episode.title}</div>
                            <div class="pc-playlist-item-controls-container">
                                ${
                                    episode.playing ? 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${pauseEpisode}>pause</i>` : 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => playEpisode(index)}>play_arrow</i>`
                                }

                                <!-- <i 
                                    class="material-icons"
                                    style="font-size: 50px; cursor: pointer"
                                    @click=${() => removeEpisodeFromPlaylist(index)}
                                >clear
                                </i>                                 -->
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