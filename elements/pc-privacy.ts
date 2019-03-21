import { customElement, html } from "functional-element";
import { pcContainerStyles } from '../services/css';
import './pc-loading';

customElement('pc-privacy', ({ constructing, connecting, update, props }) => {

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
            .pc-privacy-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-privacy-container">
            <pc-loading
                .hidden=${props.loaded}
                .prefix=${"pc-privacy-"}
            ></pc-loading>

            <h2>Privacy</h2>

            <p>Podcrypt's privacy philosophy is to collect as little personal data from its users as is feasible.</p>
            <p>Podcrypt essentially collects and records nothing through the app directly. All Ethereum transactions sent from Podcrypt are pseudonymous. It may be possible for you to be identified by your transactions, but not without extra information not found within the transactions themselves.</p>
            <p>Your IP address may be recorded by third-party APIs that Podcrypt utilizes. Cookies may also be set on your client by these third-party APIs.</p>
            <p>You can see a list of most of Podcrypt's third-party APIs in the <a href="credits">Credits</a> section.</p>
            <p>Cookies are used to collect data in conjunction with Google Analytics, with the anonymize_ip option set to true.</p>
            <p>Click <a href="https://policies.google.com/technologies/partner-sites" target="_blank">here</a> to see how Google Analytics collects and processes data.</p>
            <p>Podcrypt may eventually stop using Google Analytics, to increase privacy while using the app.</p>
        </div>
    `;
});