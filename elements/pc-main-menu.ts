import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { 
    navigate
} from '../services/utilities';

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
                    transition: .25s;
                    width: 80%;
                    left: ${Store.getState().showMainMenu ? '0' : '-90%'};
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
                    background-color: rgba(0, 0, 0, .5);
                    position: fixed;
                    z-index: ${Store.getState().showMainMenu ? '1' : '-1'};
                    opacity: ${Store.getState().showMainMenu ? '100%' : '0'};
                    transition: .25s;
                }
            </style>

            <div 
                class="pc-main-menu-overlay"
                @click=${closeMenu}
            ></div>
    
            <div class="pc-main-menu-container">
                <div 
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/')}
                >
                    Podcasts
                </div>
    
                <div
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/playlist')}
                >
                    Playlist
                </div>
        
                <div 
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/wallet')}
                >
                    Wallet
                </div>

                <div
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/privacy')}
                >
                    Privacy
                </div>

                <div
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/contact')}
                >
                    Contact
                </div>

                <div
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/about')}
                >
                    About
                </div>

                <div
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/credits')}
                >
                    Credits
                </div>

                <div
                    class="pc-main-menu-item"
                    @click=${() => menuItemClick(Store, '/logs')}
                >
                    Logs
                </div>
            </div>
        `;
    });

    function closeMenu() {
        Store.dispatch({
            type: 'TOGGLE_SHOW_MAIN_MENU'
        });
    }

    function menuItemClick(Store: any, path: string) {
        navigate(Store, path);
        Store.dispatch({
            type: 'TOGGLE_SHOW_MAIN_MENU'
        });
    }
});