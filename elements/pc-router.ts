import { 
    render, 
    html,
    TemplateResult
} from 'lit-html';
import {
    cache
} from 'lit-html/directives/cache';
import { StorePromise } from '../state/store';
import { parseQueryString } from '../services/utilities';

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

    class PCRouter extends HTMLElement {
        constructor() {
            super();
            Store.subscribe(async () => render(await this.render(Store.getState()), this));
        }

        async render(state: Readonly<State>): Promise<Readonly<TemplateResult>> {
            const templateResult: Readonly<TemplateResult> = await getTemplateResultForRoute(state.currentRoute.pathname, state.currentRoute.search);
            return html`${cache(templateResult)}`;
        }
    }

    async function getTemplateResultForRoute(
        pathname: string,
        search: string
    ): Promise<Readonly<TemplateResult>> {
        if (
            pathname === '/' ||
            pathname === '/index.html'
        ) {
            await import('./pc-podcasts.ts' as any);
            return html`<pc-podcasts></pc-podcasts>`;
        }

        if (pathname === '/playlist') {        
            const feedUrl: FeedUrl | undefined = getSearchParam(search, 'feedUrl');
            const episodeGuid: EpisodeGuid | undefined = getSearchParam(search, 'episodeGuid');

            await import('./pc-playlist.ts' as any);
            return html`<pc-playlist .feedUrl=${feedUrl} .episodeGuid=${episodeGuid}></pc-playlist>`;
        }

        if (pathname === '/wallet') {
            await import('./pc-wallet.ts' as any);
            return html`<pc-wallet></pc-wallet>`;
        }

        if (pathname === '/podcast-overview') {
            const feedUrl: FeedUrl | undefined = getSearchParam(search, 'feedUrl');

            await import('./pc-podcast-overview.ts' as any);
            return html`<pc-podcast-overview .feedUrl=${feedUrl}></pc-podcast-overview>`;
        }

        if (pathname === '/episode-overview') {
            const feedUrl: FeedUrl | undefined = getSearchParam(search, 'feedUrl');
            const episodeGuid: EpisodeGuid | undefined = getSearchParam(search, 'episodeGuid');

            await import('./pc-episode-overview.ts' as any);
            return html`<pc-episode-overview .feedUrl=${feedUrl} .episodeGuid=${episodeGuid}></pc-episode-overview>`;
        }

        if (pathname === '/credit') {
            await import('./pc-credits.ts' as any);
            return html`<pc-credits></pc-credits>`;
        }

        if (pathname === '/privacy') {
            await import('./pc-privacy.ts' as any);
            return html`<pc-privacy></pc-privacy>`;
        }

        if (pathname === '/contact') {
            await import('./pc-contact.ts' as any);
            return html`<pc-contact></pc-contact>`;
        }

        if (pathname === '/about') {
            await import('./pc-about.ts' as any);
            return html`<pc-about></pc-about>`;
        }

        if (pathname === '/not-verified-help') {
            const feedUrl: FeedUrl | undefined = getSearchParam(search, 'feedUrl');
            const podcastEmail: string | undefined = getSearchParam(search, 'podcastEmail');

            await import('./pc-not-verified-help.ts' as any);
            return html`<pc-not-verified-help .feedUrl=${feedUrl} .podcastEmail=${podcastEmail}></pc-not-verified-help>`;
        }

        if (pathname === '/restore-with-phrase') {
            await import('./pc-restore-with-phrase.ts' as any);
            return html`<pc-restore-with-phrase></pc-restore-with-phrase>`;
        }

        if (pathname === '/backup-and-restore') {
            await import('./pc-backup-and-restore.ts' as any);
            return html`<pc-backup-and-restore></pc-backup-and-restore>`;
        }

        if (pathname === '/downloads') {
            await import('./pc-downloads.ts' as any);
            return html`<pc-downloads></pc-downloads>`;
        }

        if (pathname === '/blog') {
            await import('./pc-blog.ts' as any);
            return html`<pc-blog></pc-blog>`;
        }

        return html`<div>Not found</div>`;
    }
    
    window.customElements.define('pc-router', PCRouter);
    
    function getSearchParam(search: any, paramName: string): string | undefined {
        // TODO get rid of the use of undefined and null completely, they cause strange issues like the issue
        // TODO i was having with the playlist never loading because of null versus undefined checks
        const paramValue: FeedUrl | undefined = new URLSearchParams(search).get(paramName) || undefined;
        return paramValue;
    }
});