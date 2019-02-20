import { customElement, html } from 'functional-element';

customElement('pc-playlist', () => {
    return html`
        <style>
            .pc-playlist-container {
                height: 100%;
                background-color: blue;
            }
        </style>

        <div class="pc-playlist-container">
            pc-playlist
        </div>
    `;
})