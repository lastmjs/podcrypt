import { customElement, html } from 'functional-element';

customElement('pc-wallet', () => {
    return html`
        <style>
            .pc-wallet-container {
                height: 100%;
                background-color: purple;
            }
        </style>

        <div class="pc-wallet-container">
            pc-wallet
        </div>
    `;
})