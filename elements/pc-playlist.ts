import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-playlist', ({ update }) => {
    Store.subscribe(update);

    return html`
        <style>
            .pc-playlist-container {
                height: 100%;
                background-color: blue;
            }
        </style>

        <div class="pc-playlist-container">
            ${Store.getState().playlist.map((episode) => {
                return html`<div>${episode.title}</div>`;
            })}
        </div>
    `;
});