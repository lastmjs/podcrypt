// TODO figure out service workers...nothing I am doing is working
// TODO put the service worker back in once we figure out caching, 206, Range header, and playback issues
// This must come first because some dependencies might depend on dependencies imported in index.html,which is cached
if ('serviceWorker' in window.navigator) {
    // window.addEventListener('load', async () => {
    (async () => {
        try {     
            await window.navigator.serviceWorker.register('/service-worker.ts', {
                // type: 'module' // TODO The module type is not supported yet...so we cannot use modules in the service worker, which is a crying shame
            });
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
import { StorePromise } from '../state/store';
import './pc-router';
import './pc-main-menu';
import './pc-player';
import {
    normalShadow,
    one,
    two,
    pxSmall,
    pxLarge,
    pxXLarge,
    color1Full,
    color2Full,
    alertPadding
} from '../services/css';
import '../services/listeners';
import { pcAlert } from './pc-modal';
import { createWallet } from '../services/balance-calculations';
import '../services/listeners';

// TODO I do not like how we have to do this to get the store...top level await would be really nice
StorePromise.then((Store) => {
    
    customElement('pc-app', ({ constructing, update }) => {

        if (constructing) {
            Store.subscribe(update);

            if (Store.getState().walletCreationState === 'NOT_CREATED') {
                createWallet(Store);
            }
        }

        const state: Readonly<State> = Store.getState();
        const currentEpisode: Readonly<Episode> | 'NOT_FOUND' = state.episodes[state.currentEpisodeGuid] || 'NOT_FOUND';

        return html`
            <style>
                html {
                    height: 100%;
                    font-family: sans-serif;
                }

                body {
                    height: 100%;
                    margin: 0;
                    background-color: white;
                }

                .pc-app-container {
                    width: ${state.screenType === 'DESKTOP' ? '50vw' : '100vw'};
                    margin-left: ${state.screenType === 'DESKTOP' ? 'auto' : '0px'};
                    margin-right: ${state.screenType === 'DESKTOP' ? 'auto' : '0px'};
                    box-shadow: ${state.screenType === 'DESKTOP' ? normalShadow : 'none'};
                    height: 100%;
                    box-sizing: border-box;
                }

                .pc-app-top-bar {
                    position: fixed;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    width: ${state.screenType === 'DESKTOP' ? '50vw' : '100vw'};
                    box-shadow: ${normalShadow};
                    z-index: ${two};
                    background-color: white;
                }

                .pc-app-menu-icon {
                    font-size: ${pxLarge};
                    cursor: pointer;
                    background-color: white;
                    z-index: ${one};
                    padding-top: ${pxSmall};
                    padding-left: ${pxSmall};
                    padding-bottom: ${pxSmall};
                }

                .pc-app-payout-problem-icon-container {
                    padding-right: ${pxSmall};
                    z-index: ${one};
                    background-color: white;
                }

                .pc-app-payout-problem-icon {
                    color: red;
                    font-size: ${pxXLarge};
                    cursor: pointer;
                }

                .pc-app-scrolling-title {
                    white-space: nowrap;
                    font-weight: bold;
                    animation: marquee 30s linear infinite;
                }

                @keyframes marquee {
                    0% {
                        transform: translateX(100%);
                    }

                    100% {
                        transform: translateX(-100%);
                    }
                }

                a:link {
                    color: ${color2Full};
                }

                a:visited {
                    color: ${color1Full}
                }

            </style>

            <div class="pc-app-container">
                <div class="pc-app-top-bar">

                    <i 
                        class="material-icons pc-app-menu-icon"
                        @click=${mainMenuToggle}
                    >
                        menu
                    </i>

                    ${currentEpisode !== 'NOT_FOUND' ? html`
                        <div style="overflow: hidden; width: 100%">
                            <div class="pc-app-scrolling-title">${currentEpisode.title}</div>
                        </div>
                    ` : html`
                        <div style="color: grey; font-weight: bold; margin-left: auto; margin-right: calc(10px + 1vmin); font-size: calc(15px + 1vmin)">Podcrypt Beta</div>
                    `}

                    <div
                        ?hidden=${Store.getState().payoutProblem === 'NO_PROBLEM'}
                        class="pc-app-payout-problem-icon-container"
                    >
                        <i 
                            class="material-icons pc-app-payout-problem-icon"
                            @click=${() => {
                                pcAlert(getPayoutProblemMessage(Store.getState().payoutProblem), state.screenType);
                            }}
                        >
                            error_outline
                        </i>  
                    </div>
                </div>
        
                <pc-main-menu></pc-main-menu>
                <pc-router></pc-router>
                <pc-player></pc-player>
            </div>
    
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
            return html`
                <div style="${alertPadding}">
                    <div>There is a problem with your next payout:</div>
                    <br>
                    <div>You have a balance of 0</div>
                </div>
            `;
        }

        if (payoutProblem === 'PAYOUT_TARGET_0') {
            return html`
                <div style="${alertPadding}">
                    <div>There is a problem with your next payout:</div>
                    <br>
                    <div>Your payout target is $0</div>
                </div>
            `;
        }

        if (payoutProblem === 'BALANCE_LESS_THAN_PAYOUT_TARGET') {
            return html`
                <div style="${alertPadding}">
                    <div>There is a problem with your next payout:</div>
                    <br>
                    <div>Your balance is less than your payout target</div>
                </div>
            `;
        }

        return html`<div style="${alertPadding}">There is no problem with your next payout</div>`;
    }
});