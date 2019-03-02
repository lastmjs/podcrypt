import { customElement, html } from "functional-element";
import { pcContainerStyles } from '../services/css';

customElement('pc-privacy', () => {
    return html`
        <style>
            .pc-privacy-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-privacy-container">
            <h2>Privacy</h2>

            <p>Podcrypt's privacy philosophy is to collect as little personal data from its users as is feasible.</p>
            <p>Podcrypt essentially collects and records nothing through the app directly.</p>
            <p>Cookies are used to collect data in conjunction with Google Analytics, with the anonymize_ip option set to true.</p>
            <p>Click <a href="https://policies.google.com/technologies/partner-sites" target="_blank">here</a> to see how Google Analytics collects and processes data.</p>
        </div>
    `;
});