import { customElement, html } from 'functional-element';
import {
    normalShadow,
    pxXSmall,
    color1Full,
    pxSmall,
    color1Medium
} from '../services/css';

customElement('pc-button', ({ constructing, props }) => {

    if (constructing) {
        return {
            text: null
        };
    }

    return html`
        <style>
            .pc-button {
                font-size: ${pxSmall};
                border: none;
                background-color: ${color1Full};
                box-shadow: ${normalShadow};
                padding:${pxXSmall};
                color: white;
                font-weight: bold;
                font-family: Ubuntu;
            }

            .pc-button:active {
                background-color: ${color1Medium};
            }
        </style>

        <button class="pc-button">${props.text || 'Text not set'}</button>
    `;
});