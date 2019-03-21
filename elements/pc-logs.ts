import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';

let logs: any = [];

customElement('pc-logs', ({ constructing, update }) => {

    if (constructing) {
        const originalConsoleLog = window.console.log;
        window.console.log = (...args: any) => {
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
            ${logs.map((args: any) => {
                return html`
                    <div style="word-wrap: break-word">${args[0]} ${JSON.stringify(args[1], null, 2)}</div>
                    <br>
                `;
            })}
        </div>
    `;
});