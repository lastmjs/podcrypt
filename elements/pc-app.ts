// TODO figure out service workers...nothing I am doing is working
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

import { 
    customElement,
    html 
} from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-router';
import './pc-main-menu';
import './pc-player';
import {
    bottomShadow,
    one,
    pxSmall,
    pxLarge,
    pxXLarge
} from '../services/css';

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
                    display: flex;
                    align-items: center;
                    padding-top: ${pxSmall};
                    padding-left: ${pxSmall};
                    padding-bottom: ${pxSmall};
                    width: 100%;
                    box-shadow: ${bottomShadow};
                    z-index: ${one};
                    background-color: white;
                }

                .pc-app-menu-icon {
                    font-size: ${pxLarge};
                    cursor: pointer;
                }

                .pc-app-payout-problem-icon-container {
                    margin-left: auto;
                    margin-right: ${pxLarge};
                }

                .pc-app-payout-problem-icon {
                    color: red;
                    font-size: ${pxXLarge};
                }
            </style>
    
            <div class="pc-app-top-bar">

                <i 
                    class="material-icons pc-app-menu-icon"
                    @click=${mainMenuToggle}
                >
                    menu
                </i>

                <div
                    ?hidden=${Store.getState().payoutProblem === 'NO_PROBLEM'}
                    class="pc-app-payout-problem-icon-container"
                >
                    <i 
                        class="material-icons pc-app-payout-problem-icon"
                        @click=${() => alert(getPayoutProblemMessage(Store.getState().payoutProblem))}
                    >
                        error_outline
                    </i>  
                </div>
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

    function getPayoutProblemMessage(payoutProblem: PayoutProblem) {
        if (payoutProblem === 'BALANCE_0') {
            return `There is a problem with your next payout: You have a balance of 0`;
        }

        if (payoutProblem === 'PAYOUT_TARGET_0') {
            return `There is a problem with your next payout: Your payout target is $0`;
        }

        if (payoutProblem === 'BALANCE_LESS_THAN_PAYOUT_TARGET') {
            return `There is a problem with your next payout: Your balance is less than your payout target`;
        }
    }
});