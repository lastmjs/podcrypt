import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-router';
import './pc-main-menu';
import './pc-player';
import './pc-hamburger';

// TODO I do not like how we have to do this to get the store...top level await would be really nice
StorePromise.then((Store) => {
    customElement('pc-app', async ({ constructing, update }) => {

        if (constructing) {
            Store.subscribe(update);
        }
    
        return html`
            <style>
                .pc-app-top-bar {
                    position: fixed;
                    padding-top: 5%;
                    padding-left: 3%;
                    padding-bottom: 5%;
                    width: 100%;
                    background-color: white;
                    box-shadow: -5px 5px 5px -5px grey;
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
});