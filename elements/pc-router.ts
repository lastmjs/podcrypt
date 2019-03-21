import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-podcasts.ts';
import './pc-playlist';
import './pc-wallet';
import './pc-podcast-overview';
import './pc-episode-overview';
import './pc-podcast-search-results';
import './pc-credits';
import './pc-privacy';
import './pc-contact';
import './pc-about';
import './pc-not-verified-help';
import './pc-receive-eth';
import './pc-logs';
import './pc-restore-with-phrase';
import { parseQueryString } from '../services/utilities';

StorePromise.then((Store) => {

    // this listens for browser navigation through the forward and backward navigation arrows, I believe
    window.addEventListener('popstate', (e) => {

        // If we are going back to the playlist, and the playlist has changed since we were there
        // then we do not want the url that we were at to be honored. So, just set ignore the feedUrl and episodeGuid and go to the playlist proper
        if (window.location.pathname === '/playlist') {
            Store.dispatch({
                type: 'CHANGE_CURRENT_ROUTE',
                currentRoute: {
                    pathname: window.location.pathname,
                    search: ``,
                    query: {}
                }
            });

            history.replaceState({}, '', `/playlist`);
        }
        else {
            Store.dispatch({
                type: 'CHANGE_CURRENT_ROUTE',
                currentRoute: {
                    pathname: window.location.pathname,
                    search: window.location.search,
                    query: parseQueryString(window.location.search.slice(1))
                }
            });
        }
    });
    
    // TODO maybe we just do not want to use anchor tags to navigate within our app, consider getting rid of this
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
    
    // This loads the current route from the address bar when the app first loads
    Store.dispatch({
        type: 'CHANGE_CURRENT_ROUTE',
        currentRoute: {
            pathname: window.location.pathname,
            search: window.location.search,
            query: parseQueryString(window.location.search.slice(1))
        }
    });
    
    customElement('pc-router', async ({ constructing, update }) => {
    
        if (constructing) {
            Store.subscribe(update);
        }
    
        const currentRoute = (Store.getState() as any).currentRoute;
        // await loadRouteModules(Store.getState().currentRoute);
    
        return html`
            <pc-podcasts
                ?hidden=${currentRoute.pathname !== '/'}
            ></pc-podcasts>
            <pc-playlist
                ?hidden=${currentRoute.pathname !== '/playlist'}
                .feedUrl=${currentRoute.query.feedUrl}
                .episodeGuid=${currentRoute.query.episodeGuid}
            ></pc-playlist>
            <pc-wallet
                ?hidden=${currentRoute.pathname !== '/wallet'}
            ></pc-wallet>
            <pc-podcast-overview
                ?hidden=${currentRoute.pathname !== '/podcast-overview'}
                .feedUrl=${Store.getState().currentRoute.query.feedUrl}
            ></pc-podcast-overview>
            <pc-episode-overview
                ?hidden=${currentRoute.pathname !== '/episode-overview'}
                .feedUrl=${Store.getState().currentRoute.query.feedUrl}
                .episodeGuid=${Store.getState().currentRoute.query.episodeGuid}
            ></pc-episode-overview>
            <pc-podcast-search-results
                ?hidden=${currentRoute.pathname !== '/podcast-search-results'}
                .term=${Store.getState().currentRoute.query.term}
            ></pc-podcast-search-results>
            <pc-credits
                ?hidden=${currentRoute.pathname !== '/credits'}
            ></pc-credits>
            <pc-privacy
                ?hidden=${currentRoute.pathname !== '/privacy'}
            ></pc-privacy>
            <pc-contact
                ?hidden=${currentRoute.pathname !== '/contact'}
            ></pc-contact>
            <pc-about
                ?hidden=${currentRoute.pathname !== '/about'}
            ></pc-about>
            <pc-not-verified-help
                ?hidden=${currentRoute.pathname !== '/not-verified-help'}
                .podcastEmail=${Store.getState().currentRoute.query.podcastEmail}
                .feedUrl=${Store.getState().currentRoute.query.feedUrl}
            ></pc-not-verified-help>
            <pc-receive-eth
                ?hidden=${currentRoute.pathname !== '/receive-eth'}
            ></pc-receive-eth>
            <pc-logs
                ?hidden=${currentRoute.pathname !== '/logs'}
            ></pc-logs>
            <pc-restore-with-phrase
                ?hidden=${currentRoute.pathname !== '/restore-with-phrase'}
            ></pc-restore-with-phrase>
        `;
    });
    
    // TODO figure out lazy loading later...perhaps we should not do our own router in that case
    // TODO I am having issues with property settings when lazy loading -- I think I know what to do, load the import and create the html all at the same time, otherwise we have that binding to the prototype issue before the element is upgraded
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