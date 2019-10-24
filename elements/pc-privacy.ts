import { customElement, html } from "functional-element";
import './pc-loading';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

customElement('pc-privacy', ({ constructing, connecting, update, loaded }) => {

    if (constructing) {
        return {
            loaded: false
        };
    }

    if (connecting) {
        setTimeout(() => {
            update({
                loaded: true
            });
        });
    }

    return html`
        <style>
            .pc-privacy-container {
                ${pcContainerStyles}
            }

            .pc-privacy-title-text-x-large {
                ${titleTextXLarge}
            }

            .pc-privacy-secondary-text {
                ${standardTextContainer}
            }
        </style>

        <div class="pc-privacy-container">
            <pc-loading
                .hidden=${true}
                .prename=${"pc-privacy-"}
            ></pc-loading>

            <div class="pc-privacy-title-text-x-large">Privacy</div>

            <br>

            <div class="pc-privacy-secondary-text">Podcrypt's privacy philosophy is to collect as little personal data from its users as is feasible.</div>

            <br>

            <div class="pc-privacy-secondary-text">Podcrypt essentially collects and records nothing through the app directly. All Ethereum transactions sent from Podcrypt are pseudonymous. It may be possible for you to be identified by your transactions, but not without extra information not found within the transactions themselves.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">Your IP address may be recorded by third-party APIs that Podcrypt utilizes. Cookies may also be set on your client by these third-party APIs.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">You can see a list of most of Podcrypt's third-party APIs in the <a href="credits">Credits</a> section.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">Cookies are used to collect data in conjunction with Google Analytics, with the anonymize_ip option set to true.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">Click <a href="https://policies.google.com/technologies/partner-sites" target="_blank">here</a> to see how Google Analytics collects and processes data.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">Podcrypt may eventually stop using Google Analytics, to increase privacy while using the app.</div>
        </div>
    `;
});