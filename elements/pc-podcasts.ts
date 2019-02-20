import { customElement, html } from 'functional-element';

customElement('pc-podcasts', () => {
    return html`
        <style>
            .pc-podcasts-container {
                height: 100%;
                background-color: red;
            }
        </style>

        <div class="pc-podcasts-container">
            pc-podcasts
        </div>
    `;
})