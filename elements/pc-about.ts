import { customElement, html } from 'functional-element';
import './pc-loading';
import {
    pcContainerStyles,
    titleTextMedium,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';
import '../podcrypt-button';

customElement('pc-about', ({ constructing, connecting, update, loaded }) => {

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
            .pc-about-container {
                ${pcContainerStyles}
            }

            .pc-about-title-text-x-large {
                ${titleTextXLarge}
            }

            .pc-about-title-text-large {
                ${titleTextLarge}
            }

            .pc-about-title-text-medium {
                ${titleTextMedium}
            }

            .pc-about-secondary-text {
                ${standardTextContainer}
            }
        </style>

        <div class="pc-about-container">
            <pc-loading
                .hidden=${loaded}
                .prename=${"pc-about-"}
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

            <div class="pc-about-secondary-text">
                Once verified, encourage your audience to listen to the show on Podcrypt. Navigate to the ... menu of your podcast on Podcrypt to copy a shareable URL. Navigate to the ... menu of your episodes on Podcrypt to copy a shareable URL. You can place these URLs into your main and episode descriptions for your podcast.
            </div>

            <br>

            <podcrypt-button></podcrypt-button>

            <br>
            <br>

            <div class="pc-about-secondary-text">You can embed a "Donate With Podcrypt" button on your website. Just put the following script element into the head or body of your website:</div>
            
            <br>

            <div class="pc-about-secondary-text">
                &#x3C;script type=&#x22;module&#x22; src=&#x22;https://podcrypt.app/podcrypt-button.js&#x22;&#x3E;&#x3C;/script&#x3E;
            </div>

            <br>

            <div class="pc-about-secondary-text">
                Then place the button anywhere you like:
            </div>

            <br>

            <div class="pc-about-secondary-text">
                &#x3C;podcrypt-button href=&#x22;the-url-to-your-podcast-or-episode&#x22;&#x3E;&#x3C;/podcrypt-button&#x3E;
            </div>

        </div>
    `;
});