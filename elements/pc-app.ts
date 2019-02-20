import { customElement, html } from 'functional-element';
import { Store } from '../services/store';
import './pc-router';
import './pc-main-menu';

customElement('pc-app', ({ constructing, update }) => {

    if (constructing) {
        Store.subscribe(update);
    }

    return html`
        <style>
            .pc-app-main-menu-toggle {
                position: absolute;
            }
        </style>

        <button class="pc-app-main-menu-toggle" @click=${mainMenuToggle}>Menu</button>
        <pc-main-menu ?hidden=${!Store.getState().showMainMenu}></pc-main-menu>
        <pc-router></pc-router>
    `;
});

function mainMenuToggle(e) {
    e.stopPropagation();

    Store.dispatch({
        type: 'TOGGLE_SHOW_MAIN_MENU'
    });
}