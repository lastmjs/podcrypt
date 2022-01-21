import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {
  normalShadow,
  pxXSmall,
  color1Full,
  pxSmall,
  color1Medium
} from "../services/css.js";
customElement("pc-button", ({constructing, text}) => {
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
                cursor: pointer;
            }

            .pc-button:active {
                background-color: ${color1Medium};
            }
        </style>

        <button class="pc-button">${text || "Text not set"}</button>
    `;
});
