import { customElement, html } from 'functional-element';

customElement('pc-hamburger', () => {
    return html`
        <style>
            .pc-hamburger-container {
                font-size: 10px;
                cursor: pointer;
                text-align: center;
                vertical-align: middle;
            }

            .pc-hamburger-row {
                height: .5em;
                width: 3.5em;
                background-color: black;
            }
        </style>
        <div class="pc-hamburger-container">
            <div class="pc-hamburger-row" style="margin-bottom: .5em"></div>
            <div class="pc-hamburger-row" style="margin-bottom: .5em"></div>
            <div class="pc-hamburger-row"></div>
        </div>
    `;
});