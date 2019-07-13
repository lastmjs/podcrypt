import { StorePromise } from '../state/store';

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
});