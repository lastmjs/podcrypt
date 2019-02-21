import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-player', ({ update }) => {
    Store.subscribe(update);

    const state = Store.getState();
    const currentEpisode = state.episodes[state.currentEpisodeGuid] || {};

    return html`
        <style>
            .pc-player-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                position: fixed;
                bottom: 0;
                background-color: grey;
                width: 100%;
            }
        </style>

        <div class="pc-player-container">
            <audio src="${currentEpisode.src}" @ended=${audioEnded} controls autoplay></audio>
        </div>
    `;
})

function audioEnded(e) {
    Store.dispatch({
        type: 'CURRENT_EPISODE_COMPLETED'
    });
}