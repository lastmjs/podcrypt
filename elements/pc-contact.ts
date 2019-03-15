import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import './pc-loading';

customElement('pc-contact', ({ constructing, connecting, props, update}) => {

    if (constructing) {
        return {
            loaded: false
        };
    }

    if (connecting) {
        setTimeout(() => {
            update({
                ...props,
                loaded: true
            });
        });
    }

    return html`
        <style>
            .pc-contact-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-contact-container">
            <pc-loading
                .hidden=${props.loaded}
                .prefix=${"pc-contact-"}
            ></pc-loading>

            <h2>Contact</h2>

            <p>Reach out if you need something:</p>

            <div>
                <a href="https://t.me/podcrypt" target="_blank">Telegram</a>
            </div>

            <br>

            <div>
                <a href="https://twitter.com/lastmjs" target="_blank">Twitter</a>
            </div>
            
        </div>
    `;
});