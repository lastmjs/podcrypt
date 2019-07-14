import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { 
    navigate
} from '../services/utilities';
import {
    colorBlackVeryLight,
    two,
    three
} from '../services/css';

StorePromise.then((Store) => {    
    customElement('pc-main-menu', ({ constructing, update }) => {

        if (constructing) {
            Store.subscribe(update);
        }

        const state: Readonly<State> = Store.getState();

        const desktopAndMenuClosed: boolean = !state.showMainMenu && state.screenType === 'DESKTOP';

        return html`
            <style>
                /*TODO I know this is a vendor prefix and is non-standard.
                * The scrollbars on FireFox look good, but on Chrome look really bad
                * I think it's worth it for now so that we don't have to use some huge library
                * or implement something ourselves
                */
               .pc-main-menu-container::-webkit-scrollbar {
                    display: none;
                }

                .pc-main-menu-container {
                    position: fixed;
                    background-color: white;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0px 0px 1px black;
                    z-index: ${three};
                    transition: .25s;
                    width: ${state.screenType === 'DESKTOP' ? desktopAndMenuClosed ? 'auto' : '15vw' : '80vw'};
                    left: ${state.screenType === 'DESKTOP' ? '0' : state.showMainMenu ? 'unset' : '-90%'};
                    overflow-y: scroll;
                }
    
                .pc-main-menu-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    cursor: pointer;
                    padding: calc(15px + 1vmin);
                }

                .pc-main-menu-overlay {
                    height: 100%;
                    width: ${state.screenType === 'DESKTOP' ? '0px' : '100%'};
                    background-color: rgba(0, 0, 0, .5);
                    position: fixed;
                    z-index: ${state.showMainMenu ? '1' : '-1'};
                    opacity: ${state.showMainMenu ? '100%' : '0'};
                    transition: .25s;
                }

                .pc-main-menu-item-icon {
                    flex: 1;
                    color: grey;
                    /* color: rgba(69, 181, 251, 1); */
                }

                .pc-main-menu-item-text {
                    flex: 6;
                    font-size: calc(12px + 1vmin);
                    font-family: Ubuntu;
                }

                .pc-main-menu-item-selected {
                    /* background-color: rgba(1, 1, 1, .1); */
                    /* background-color: #45b5fb; */
                    background-color: ${colorBlackVeryLight};
                    /* background-color: rgba(251, 133, 69, .1); */
                }

                .pc-main-menu-logo {
                    font-size: calc(25px + 1vmin);
                    flex: 1;
                    /* color: grey; */
                    /* color: rgba(69, 181, 251, 1); */
                    color: rgba(251, 133, 69, 1);
                }

                /* .pc-logo {
                    font-size: calc(25px + 1vmin);
                    padding-top: calc(5px + 1vmin);
                    padding-bottom: calc(5px + 1vmin);
                    padding-left: calc(10px + 1vmin);
                    padding-right: calc(10px + 1vmin);
                    background-color: rgba(1, 1, 1, .1);
                    color: white;
                    text-shadow: 0px 0px 5px grey;
                    border-radius: calc(25px + 1vmin);
                } */

                .pc-main-menu-divider {
                    width: 100%;
                    background-color: grey;
                    height: 1px;
                    border: none;
                    opacity: .25;
                }
            </style>

            <div 
                class="pc-main-menu-overlay"
                @click=${closeMenu}
            ></div>
    
            <div class="pc-main-menu-container">
                <div class="pc-main-menu-item">
                    <span class="pc-main-menu-logo">卩</span>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Podcrypt Alpha'}</span>
                </div>
                
                <hr class="pc-main-menu-divider">

                <div 
                    class="pc-main-menu-item${state.currentRoute.pathname === '/' || state.currentRoute.pathname === '/index.html' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        mic
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Podcasts'}</span>
                </div>
    
                <div
                    class="pc-main-menu-item${state.currentRoute.pathname === '/playlist' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/playlist')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        format_list_numbered
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Playlist'}</span>
                </div>
        
                <div 
                    class="pc-main-menu-item${state.currentRoute.pathname === '/wallet' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/wallet')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        payment
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Wallet'}</span>
                </div>

                <div 
                    class="pc-main-menu-item${state.currentRoute.pathname === '/backup-and-restore' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/backup-and-restore')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        backup
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Backup & Restore'}</span>
                </div>

                <div
                    class="pc-main-menu-item${state.currentRoute.pathname === '/privacy' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/privacy')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        security
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Privacy'}</span>
                </div>

                <div
                    class="pc-main-menu-item${state.currentRoute.pathname === '/contact' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/contact')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        call
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Contact'}</span>
                </div>

                <div
                    class="pc-main-menu-item${state.currentRoute.pathname === '/about' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/about')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        help
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'About'}</span>
                </div>

                <div
                    class="pc-main-menu-item${state.currentRoute.pathname === '/credit' ? ' pc-main-menu-item-selected' : ''}"
                    @click=${() => menuItemClick(Store, '/credit')}
                >
                    <i 
                        class="material-icons pc-main-menu-item-icon"
                    >
                        copyright
                    </i>
                    <span class="pc-main-menu-item-text">${desktopAndMenuClosed ? '' : 'Credits'}</span>
                </div>

                <hr class="pc-main-menu-divider">

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

        if (Store.getState().screenType === 'MOBILE') {
            Store.dispatch({
                type: 'TOGGLE_SHOW_MAIN_MENU'
            });
        }
    }
});