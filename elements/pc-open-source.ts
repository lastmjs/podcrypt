import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';

customElement('pc-open-source', async () => {
    const attributionResponse = await window.fetch('oss-attribution/attribution.txt');
    const attribution = await attributionResponse.text();

    return html`
        <style>
            .pc-open-source-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-open-source-container">
            <h2>Open Source</h2>
            <p style="font-weight: bold">Podcrypt itself is distributed under the terms of the MIT license. Podcrypt uses many other open source libraries, distributed under the following terms:</p>
            ${attribution}
        </div>
    `;
});