import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

// TODO we might be repeating a lot of code, think about making a component for the episode items
customElement('pc-playlist', ({ update }) => {
    Store.subscribe(update);

    return html`
        <style>
            .pc-playlist-container {
                height: 100%;
            }
        </style>

        <div class="pc-playlist-container">
            ${Store.getState().playlist.map((episodeGuid, index) => {
                const episode = Store.getState().episodes[episodeGuid];
                const currentPlaylistIndex = Store.getState().currentPlaylistIndex;
                const currentlyPlaying = currentPlaylistIndex === index;

                return html`
                    <div style="${currentlyPlaying ? 'background-color: grey' : ''}">
                        ${episode.finishedListening ? '*' : ''} ${episode.title}
                        <button @click=${() => playEpisode(index)}>Play</button>
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