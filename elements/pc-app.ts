import { customElement, html } from 'functional-element';
import './pc-router';
import './pc-menu';

customElement('pc-app', () => {
    return html`
        <style>
            
        </style>

        <pc-menu></pc-menu>
        <pc-router></pc-router>
    `;
});