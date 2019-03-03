import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-podcasts.ts';
import './pc-playlist';
import './pc-wallet';
import './pc-podcast-overview';
import './pc-podcast-search-results';
import './pc-open-source';
import './pc-privacy';
import './pc-contact';
import './pc-about';
import { parseQueryString } from '../services/utilities';

StorePromise.then((Store) => {

    // this listens for browser navigation through the forward and backward navigation arrows, I believe
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
    
    // this listens for anchor tag clicks
    window.addEventListener('click', (e: any) => {

        if (e.target.nodeName === 'A') {

            // allow absolute urls to go through...this might not be thorough
            if (
                !e.target.href.startsWith('http://localhost') &&
                !e.target.href.startsWith('https://deploy-preview') &&
                !e.target.href.startsWith('https://podcrypt')
            ) {
                return;
            }

            e.preventDefault();
    
            // TODO replace this with the navigate function
            Store.dispatch({
                type: 'CHANGE_CURRENT_ROUTE',
                currentRoute: {
                    pathname: e.target.pathname,
                    search: e.target.search,
                    query: parseQueryString(e.target.search.slice(1))
                }
            });
    
            history.pushState({}, '', `${(Store.getState() as any).currentRoute.pathname}${(Store.getState() as any).currentRoute.search ? `${(Store.getState() as any).currentRoute.search}` : ''}`);
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
    
        const currentRoute = (Store.getState() as any).currentRoute;
        // await loadRouteModules(Store.getState().currentRoute);
    
        return html`
            <pc-podcasts ?hidden=${currentRoute.pathname !== '/'}></pc-podcasts>
            <pc-playlist ?hidden=${currentRoute.pathname !== '/playlist'}></pc-playlist>
            <pc-wallet ?hidden=${currentRoute.pathname !== '/wallet'}></pc-wallet>
            <pc-podcast-overview
                ?hidden=${currentRoute.pathname !== '/podcast-overview'}
                .podcast=${decodeURIComponent((Store.getState() as any).currentRoute.query.podcast)}
            ></pc-podcast-overview>
            <pc-podcast-search-results
                ?hidden=${currentRoute.pathname !== '/podcast-search-results'}
                .term=${(Store.getState() as any).currentRoute.query.term}
            ></pc-podcast-search-results>
            <pc-open-source ?hidden=${currentRoute.pathname !== '/open-source'}></pc-open-source>
            <pc-privacy ?hidden=${currentRoute.pathname !== '/privacy'}></pc-privacy>
            <pc-contact ?hidden=${currentRoute.pathname !== '/contact'}></pc-contact>
            <pc-about ?hidden=${currentRoute.pathname !== '/about'}></pc-about>
        `;
    });
    
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