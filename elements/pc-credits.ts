import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';

customElement('pc-credits', async () => {
    const attributionResponse = await window.fetch('oss-attribution/attribution.txt');
    const attribution = await attributionResponse.text();

    return html`
        <style>
            .pc-credits-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-credits-container">
            <h2>Credits</h2>

            <h3>APIs</h3>

            <p>Podcrypt uses a variety of APIs to make itself awesome. Some of them are listed below:</p>
            <p>Powered by Etherscan.io APIs</p>

            <h3>Open Source</h3>
            <p>Podcrypt itself is distributed under the terms of the MIT license. Podcrypt uses many other open source libraries, distributed under the following terms:</p>
            ${attribution}
        </div>
    `;
});