import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { parseQueryString } from '../services/utilities';
import './pc-podcasts.ts';
import './pc-playlist';
import './pc-wallet';
import './pc-podcast-overview';
import './pc-episode-overview';
import './pc-credits';
import './pc-privacy';
import './pc-contact';
import './pc-about';
import './pc-not-verified-help';
import './pc-receive-eth';
import './pc-restore-with-phrase';
import './pc-backup-and-restore';
import './pc-downloads';

// TODO we can use URLSearchParams instead of parseQueryString...native and seems to handle nested query parameters
// TODO I would love to use the route /credits instead of /credit, but there is a strange issues with /credits: https://github.com/lastmjs/podcrypt/issues/169

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
    
        // await loadRouteModules(Store.getState().currentRoute);
        
        const currentRoute = Store.getState().currentRoute;
        
        // TODO get rid of the use of undefined and null completely, they cause strange issues like the issue
        // TODO i was having with the playlist never loading because of null versus undefined checks
        const feedUrl: FeedUrl | undefined = new URLSearchParams(Store.getState().currentRoute.search).get('feedUrl') || undefined;
        const episodeGuid: EpisodeGuid | undefined = new URLSearchParams(Store.getState().currentRoute.search).get('episodeGuid') || undefined;
        
        const podcastEmail: string | null = new URLSearchParams(Store.getState().currentRoute.search).get('podcastEmail');

        return html`
            <pc-podcasts
                ?hidden=${currentRoute.pathname !== '/' && currentRoute.pathname !== '/index.html'}
            ></pc-podcasts>
            <pc-playlist
                ?hidden=${currentRoute.pathname !== '/playlist'}
                .feedUrl=${feedUrl}
                .episodeGuid=${episodeGuid}
            ></pc-playlist>
            <pc-wallet
                ?hidden=${currentRoute.pathname !== '/wallet'}
            ></pc-wallet>
            <pc-podcast-overview
                ?hidden=${currentRoute.pathname !== '/podcast-overview'}
                .feedUrl=${feedUrl}
            ></pc-podcast-overview>
            <pc-episode-overview
                ?hidden=${currentRoute.pathname !== '/episode-overview'}
                .feedUrl=${feedUrl}
                .episodeGuid=${episodeGuid}
            ></pc-episode-overview>
            <pc-credits
                ?hidden=${currentRoute.pathname !== '/credit'}
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
                .podcastEmail=${podcastEmail}
                .feedUrl=${feedUrl}
            ></pc-not-verified-help>
            <pc-receive-eth
                ?hidden=${currentRoute.pathname !== '/receive-eth'}
            ></pc-receive-eth>
            <pc-restore-with-phrase
                ?hidden=${currentRoute.pathname !== '/restore-with-phrase'}
            ></pc-restore-with-phrase>
            <pc-backup-and-restore
                ?hidden=${currentRoute.pathname !== '/backup-and-restore'}
            >
            </pc-backup-and-restore>
            <pc-downloads
                ?hidden=${currentRoute.pathname !== '/downloads'}
            ></pc-downloads>
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