import { StorePromise } from '../state/store';
import { payout } from '../services/payout-calculations';
import {
    loadCurrentETHPriceInUSDCents,
    loadEthereumAccountBalance
} from '../services/balance-calculations';

// TODO figure out a place to store ephemeral state...we might need to just modify the Redux store persistance and remove certain properties
// TODO this needs to stay in memory only and not be persisted because we want the payout process to continue on a refresh
// TODO probably best to put this with redux somehow...just don't persist any ephemeral properties I guess...or make sure they reset every time the state reloads
export let ephemeralState = {
    payoutInProgress: false
};

StorePromise.then((Store) => {
    Store.dispatch({
        type: 'WINDOW_RESIZE_EVENT',
        screenType: window.matchMedia('(min-width: 1280px)').matches ? 'DESKTOP' : 'MOBILE'
        // desktopScreen: window.matchMedia('(min-width: 1024px)').matches,
        // mobileScreen: window.matchMedia('(max-width: 1024px)').matches
    });

    window.addEventListener('resize', () => {
        Store.dispatch({
            type: 'WINDOW_RESIZE_EVENT',
            screenType: window.matchMedia('(min-width: 1280px)').matches ? 'DESKTOP' : 'MOBILE'
            // desktopScreen: window.matchMedia('(min-width: 1024px)').matches,
            // mobileScreen: window.matchMedia('(max-width: 1024px)').matches
        });
    });

    setInterval(async () => {
        console.log('running 1')
        if (
            Store.getState().nextPayoutDate !== 'NEVER' &&
            ephemeralState.payoutInProgress === false &&
            new Date().getTime() >= Store.getState().nextPayoutDate
        ) {
            ephemeralState.payoutInProgress = true;
            await payout(Store, 500);
            ephemeralState.payoutInProgress = false;
        }
    }, 30000);

    setInterval(async () => {
        console.log('running 2')
        if (Store.getState().currentRoute.pathname === '/wallet') {
            await loadCurrentETHPriceInUSDCents(Store);
            await loadEthereumAccountBalance(Store);
        }
    }, 30000);

});