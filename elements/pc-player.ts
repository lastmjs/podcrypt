import { customElement, html } from 'functional-element';

customElement('pc-player', ({ constructing }) => {
    return html`
        <style>
            .pc-player-container {
                height: 100%;
                background-color: green;
            }
        </style>

        <div class="pc-player-container">
            pc-player
        </div>
    `;
})