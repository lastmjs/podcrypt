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
            .pc-app-top-bar {
                position: fixed;
                padding-top: 2%;
                padding-left: 2%;
                padding-bottom: 2%;
                width: 100%;
                background-color: white;
            }
        </style>

        <div class="pc-app-top-bar">
            <pc-hamburger @click=${mainMenuToggle}></pc-hamburger>
        </div>

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