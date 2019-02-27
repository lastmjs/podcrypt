import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';

StorePromise.then((Store) => {
    window.addEventListener('click', (e) => {
        if (Store.getState().showMainMenu) {
            const cameFromMenu = e.path.reduce((result, element) => {
                if (element.nodeName === 'PC-MAIN-MENU') {
                    return true;
                }
                
                return result;
            }, false);
        
            if (!cameFromMenu) {
                Store.dispatch({
                    type: 'TOGGLE_SHOW_MAIN_MENU'
                });
            }    
        }
    });
    
    customElement('pc-main-menu', () => {
        return html`
            <style>
                .pc-menu-container {
                    position: absolute;
                    background-color: white;
                    height: 100%;
                    width: 75%;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0px 0px 1px black;
                }
    
                .pc-menu-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    font-size: calc(25px + 1vmin);
                    cursor: pointer;
                    padding: calc(25px + 1vmin);
                }
    
                .pc-menu-item a {
                    color: inherit;
                    text-decoration: none;
                }
            </style>
    
            <div class="pc-menu-container">
                <div class="pc-menu-item">
                    <a href="/">Podcasts</a>
                </div>
    
                <div class="pc-menu-item">
                    <a href="/playlist">Playlist</a>
                </div>
    
                <!-- <div class="pc-menu-item">
                    <a href="/player">Player</a>
                </div> -->
    
                <div class="pc-menu-item">
                    <a href="/wallet">Wallet</a>
                </div>
            </div>
        `;
    });
});