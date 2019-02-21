import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-player', ({ update }) => {
    Store.subscribe(update);

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
            <audio src="${Store.getState().currentEpisode.src}" controls autoplay></audio>
        </div>
    `;
})