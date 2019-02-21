import { customElement, html } from 'functional-element';
import { Store } from '../services/store';
import './pc-router';
import './pc-main-menu';
import './pc-player';
import './pc-hamburger';

customElement('pc-app', ({ constructing, update }) => {

    if (constructing) {
        Store.subscribe(update);
    }

    return html`
        <style>
            .pc-app-main-menu-toggle {
                position: absolute;
                top: 1%;
                left: 1%;
            }
        </style>

        <pc-hamburger class="pc-app-main-menu-toggle" @click=${mainMenuToggle}></pc-hamburger>
        <pc-main-menu ?hidden=${!Store.getState().showMainMenu}></pc-main-menu>
        <pc-router></pc-router>
        <pc-player></pc-player>
    `;
});

function mainMenuToggle(e) {
    e.stopPropagation();

    Store.dispatch({
        type: 'TOGGLE_SHOW_MAIN_MENU'
    });
}