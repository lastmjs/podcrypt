import { customElement, html } from 'functional-element';
import { Store } from '../services/store';
import { pcContainerStyles } from '../services/css';

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
                font-size: calc(15px + 1vmin);
                padding: 5%;
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
                        @click=${() => playEpisode(index)}
                    >
                        <div>${episode.finishedListening ? '*' : ''} ${episode.title}</div>
                    </div>

                    <hr>
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