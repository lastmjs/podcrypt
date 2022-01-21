import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {pcContainerStyles} from "../services/css.js";
let logs = [];
customElement("pc-logs", ({constructing, update}) => {
  if (constructing) {
    const originalConsoleLog = window.console.log;
    window.console.log = (...args) => {
      if (logs.length > 100) {
        logs = [];
      }
      logs.push(args);
      originalConsoleLog(...args);
      update();
    };
  }
  return html`
        <style>
            .pc-log-container {
                ${pcContainerStyles}
            }
        </style>

        <div class="pc-log-container">
            ${logs.map((args) => {
    return html`
                    <div style="word-wrap: break-word">${args[0]} ${JSON.stringify(args[1], null, 2)}</div>
                    <br>
                `;
  })}
        </div>
    `;
});
