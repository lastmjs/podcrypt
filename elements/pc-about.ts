import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import './pc-loading';

customElement('pc-about', ({ constructing, connecting, update, props }) => {

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
            .pc-about-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-about-container">
            <pc-loading
                .hidden=${props.loaded}
                .prefix=${"pc-about-"}
            ></pc-loading>

            <h2>About Podcrypt</h2>

            <p>
                Podcrypt allows you to donate back to podcasts automatically, fairly, and peer-to-peer.
            </p>

            <h3>Podcast listeners</h3>

            <p>
                To start donating:
                <ul>
                    <li>Create a Podcrypt wallet</li>
                    <li>Send your Podcrypt wallet some ETH</li>
                    <li>Choose a donation amount</li>
                    <li>Choose a payout interval</li>
                    <li>Get listening</li>
                </ul>
            </p>

            <h3>Podcast creators</h3>

            <p>
                To start receiving donations, put your Ethereum address into the main description of your podcast.
            </p>
            
        </div>
    `;
});