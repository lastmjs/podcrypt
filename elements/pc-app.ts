// TODO put the service worker back in once we figure out caching, 206, Range header, and playback issues
// This must come first because some dependencies might depend on dependencies imported in index.html,which is cached
if ('serviceWorker' in window.navigator) {
    // window.addEventListener('load', async () => {
    (async () => {
        try {     
            window.navigator.serviceWorker.register('/service-worker.ts');
            console.log('service worker registration successful');
        }
        catch(error) {
            console.log(error);
        }
    })();
    // });
}

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
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    font-size: calc(15px + 1vmin);
                    font-weight: bold;
                }
            </style>
    
            <div class="pc-app-top-bar">
                <pc-hamburger @click=${mainMenuToggle}></pc-hamburger>
                <div style="margin-left: 5%">Podcrypt Pre-alpha</div>
            </div>
    
            <pc-main-menu></pc-main-menu>
            <pc-router></pc-router>
            <pc-player></pc-player>
        `;
    });    

    function mainMenuToggle(e: any) {
        e.stopPropagation();
    
        Store.dispatch({
            type: 'TOGGLE_SHOW_MAIN_MENU'
        });
    }
});