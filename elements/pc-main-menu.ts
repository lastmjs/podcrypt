import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';

StorePromise.then((Store) => {    
    customElement('pc-main-menu', ({ element, update, constructing }) => {

        if (constructing) {
            Store.subscribe(update);
        }

        return html`
            <style>
                .pc-main-menu-container {
                    position: fixed;
                    background-color: white;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0px 0px 1px black;
                    z-index: 1;
                    transition: .5s;
                    width: 75%;
                    left: ${Store.getState().showMainMenu ? '0' : '-80%'};
                }
    
                .pc-main-menu-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    font-size: calc(25px + 1vmin);
                    cursor: pointer;
                    padding: calc(25px + 1vmin);
                }
    
                .pc-main-menu-item a {
                    color: inherit;
                    text-decoration: none;
                }

                .pc-main-menu-overlay {
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0, 0, 0, .25);
                    position: fixed;
                    z-index: 1;
                    right: ${Store.getState().showMainMenu ? '0' : '-100%'};
                    transition: .5s;
                }
            </style>

            <div 
                class="pc-main-menu-overlay"
                @click=${closeMenu}
            ></div>
    
            <div class="pc-main-menu-container">
                <div class="pc-main-menu-item">
                    <a href="/">Podcasts</a>
                </div>
    
                <div class="pc-main-menu-item">
                    <a href="/playlist">Playlist</a>
                </div>
    
                <!-- <div class="pc-main-menu-item">
                    <a href="/player">Player</a>
                </div> -->
    
                <div class="pc-main-menu-item">
                    <a href="/wallet">Wallet</a>
                </div>
            </div>
        `;
    });

    function closeMenu() {
        Store.dispatch({
            type: 'TOGGLE_SHOW_MAIN_MENU'
        });
    }
});