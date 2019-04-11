import { customElement, html } from 'functional-element';
import './pc-loading';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

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

            .pc-about-title-text-x-large {
                ${titleTextXLarge}
            }

            .pc-about-title-text-large {
                ${titleTextLarge}
            }

            .pc-about-secondary-text {
                ${standardTextContainer}
            }
        </style>

        <div class="pc-about-container">
            <pc-loading
                .hidden=${props.loaded}
                .prefix=${"pc-about-"}
            ></pc-loading>

            <div class="pc-about-title-text-x-large">About Podcrypt</div>

            <br>

            <div class="pc-about-secondary-text">
                Podcrypt allows you to listen to and optionally donate back to podcasts automatically, fairly, and peer-to-peer.
            </div>

            <br>

            <div class="pc-about-title-text-large">Podcast listeners</div>

            <br>

            <div class="pc-about-secondary-text">
                You can listen to podcasts for free, just search for your favorites in the Podcasts section.
            </div>

            <br>

            <div class="pc-about-secondary-text">
                <div>If you want to start donating:</div>
                <ul>
                    <li>Create a Podcrypt wallet</li>
                    <li>Send your Podcrypt wallet some ETH</li>
                    <li>Choose a donation amount</li>
                    <li>Choose a payout interval</li>
                    <li>Get listening</li>
                </ul>
            </div>

            <br>

            <div class="pc-about-title-text-large">Podcasters</div>

            <br>

            <div class="pc-about-secondary-text">
                To start receiving donations, put your Ethereum address or ENS name into the main description of your podcast (not into episode descriptions).
            </div>

            <br>

            <div class="pc-about-secondary-text">That's all it takes to get verified on Podcrypt and start receiving donations.</div>
            
        </div>
    `;
});