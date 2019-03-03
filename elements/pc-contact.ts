import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';

customElement('pc-contact', () => {
    return html`
        <style>
            .pc-contact-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-contact-container">
            <h2>Contact</h2>

            <p>Reach out if you need something:</p>

            <div>
                <a href="https://t.me/podcrypt" target="_blank">Telegram</a>
            </div>

            <div>
                <a href="https://twitter.com/lastmjs" target="_blank">Twitter</a>
            </div>
            
        </div>
    `;
});