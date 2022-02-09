import {
    normalShadow,
    pxXSmall,
    color1Full,
    pxSmall,
    color1Medium
} from '../services/css';

import {
    html,
    render as litRender,
} from 'lit-html'

import {
    createObjectStore
} from 'reduxular'

type State = Readonly<{
    text:string;
}>;

const InitialState: State = {
    text: ''
};

class PCButton extends HTMLElement {
    

    readonly shadow = this.attachShadow({
        mode: 'open'
    })
    readonly store = createObjectStore(InitialState, (state) => litRender(this.render(state), this.shadowRoot), this);

    constructor() {
        super();
    }

    render(state:State) {
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
                cursor: pointer;
            }

            .pc-button:active {
                background-color: ${color1Medium};
            }
        </style>

        <button class="pc-button">${state.text || 'Text not set'}</button>
    `;
    }
}

customElements.define('pc-button', PCButton);