import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';

customElement('pc-about', () => {
    return html`
        <style>
            .pc-about-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-about-container">
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