import { customElement, html } from 'functional-element';
import './pc-loading';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

customElement('pc-credits', async ({ constructing, connecting, update, loaded, attribution }) => {

    if (constructing) {
        return {
            loaded: false,
            attribution: ''
        };
    }

    if (connecting) {
        update();
        return {
            attribution: await loadOSSAttribution(),
            loaded: true
        };
    }

    return html`
        <style>
            .pc-credits-container {
                ${pcContainerStyles}
            }

            .pc-credits-title-text-x-large {
                ${titleTextXLarge}
            }

            .pc-credits-title-text-large {
                ${titleTextLarge}
            }

            .pc-credits-secondary-text {
                ${standardTextContainer}
            }
        </style>

        <div class="pc-credits-container">
            <pc-loading
                .hidden=${loaded}
                .prename=${"pc-credits-"}
            ></pc-loading>

            <div class="pc-credits-title-text-x-large">Credits</div>

            <br>

            <div class="pc-credits-title-text-large">APIs</div>

            <br>

            <div class="pc-credits-secondary-text">Podcrypt uses a variety of APIs to make itself awesome. Some of them are listed below:</div>

            <br>

            <div class="pc-credits-secondary-text">
                <p>Powered by <a href="https://etherscan.io/apis" target="_blank">Etherscan.io APIs</a></p>
                <p><a href="https://ethgasstation.info" target="_blank">ETH Gas Station</a></p>
                <p><a href="https://cors-anywhere.herokuapp.com" target="_blank">CORS Anywhere</a></p>
                <p><a href="https://jsonp.afeld.me" target="_blank">JSONProxy</a></p>
                <p><a href="https://www.cryptonator.com/api" target="_blank">Cryptonator</a></p>
            </div>

            <br>

            <div class="pc-credits-title-text-large">Open Source</div>
            
            <br>

            <div class="pc-credits-secondary-text">Podcrypt itself is distributed under the terms of the MIT license. Podcrypt uses many other open source libraries, distributed under the following terms:</div>

            <br>

            <div class="pc-credits-secondary-text">
                ${attribution}
            </div>
        </div>
    `;
});

async function loadOSSAttribution() {
    const attributionResponse = await window.fetch('oss-attribution/attribution.txt');
    const attribution = await attributionResponse.text();

    return attribution;
}