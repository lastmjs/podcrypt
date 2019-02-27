import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-podcasts.ts';
import './pc-playlist';
import './pc-wallet';
import './pc-podcast-overview';

StorePromise.then((Store) => {
    window.addEventListener('popstate', (e) => {
        Store.dispatch({
            type: 'CHANGE_CURRENT_ROUTE',
            currentRoute: {
                pathname: window.location.pathname,
                search: window.location.search,
                query: parseQueryString(window.location.search.slice(1))
            }
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.nodeName === 'A') {
            e.preventDefault();
    
            Store.dispatch({
                type: 'CHANGE_CURRENT_ROUTE',
                currentRoute: {
                    pathname: e.target.pathname,
                    search: e.target.search,
                    query: parseQueryString(e.target.search.slice(1))
                }
            });
    
            history.pushState({}, '', `${Store.getState().currentRoute.pathname}${Store.getState().currentRoute.search ? `${Store.getState().currentRoute.search}` : ''}`);
        }
    });
    
    window.addEventListener('load', () => {
        Store.dispatch({
            type: 'CHANGE_CURRENT_ROUTE',
            currentRoute: {
                pathname: window.location.pathname,
                search: window.location.search,
                query: parseQueryString(window.location.search.slice(1))
            }
        });
    });
    
    customElement('pc-router', async ({ constructing, update }) => {
    
        if (constructing) {
            Store.subscribe(update);
        }
    
        const currentRoute = Store.getState().currentRoute;
        // await loadRouteModules(Store.getState().currentRoute);
    
        return html`
            <pc-podcasts ?hidden=${currentRoute.pathname !== '/'}></pc-podcasts>
            <pc-playlist ?hidden=${currentRoute.pathname !== '/playlist'}></pc-playlist>
            <pc-wallet ?hidden=${currentRoute.pathname !== '/wallet'}></pc-wallet>
            <pc-podcast-overview
                ?hidden=${currentRoute.pathname !== '/podcast-overview'}
                .podcast=${decodeURIComponent(Store.getState().currentRoute.query.podcast)}
            ></pc-podcast-overview>
        `;
    });
    
    function parseQueryString(queryString: string) {
        return queryString.split('&').reduce((result, keyAndValue) => {
            const keyAndValueArray = keyAndValue.split('=');
            const key = keyAndValueArray[0];
            const value = keyAndValueArray[1];
            return {
                ...result,
                [key]: value
            };
        }, {});
    }
    // TODO figure out lazy loading later...perhaps we should not do our own router in that case
    // TODO I am having issues with property settings when lazy loading
    // async function loadRouteModules(currentRoute): Promise<void> {
    //     const routes = {
    //         '/': async () => {
    //             await import('./pc-podcasts.ts');
    //         },
    //         '/podcasts': async () => {
    //             await import('./pc-podcasts.ts');
    //         },
    //         '/playlist': async () => {
    //             await import('./pc-playlist.ts');
    //         },
    //         '/player': async () => {
    //             await import('./pc-player.ts');
    //         },
    //         '/wallet': async () => {
    //             await import('./pc-wallet.ts');
    //         },
    //         '/podcast-overview': async () => {
    //             await import('./pc-podcast-overview.ts');
    //         }
    //     };
    
    //     await routes[currentRoute.pathname]();
    // }
});