import { customElement, html } from 'functional-element';
import { TemplateResult } from 'lit-html';
import { Store } from '../services/store';

window.addEventListener('popstate', (e) => {
    Store.dispatch({
        type: 'CHANGE_CURRENT_ROUTE',
        currentRoute: {
            pathname: window.location.pathname,
            search: window.location.search
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
                search: e.target.search
            }
        });
    }
});

window.addEventListener('load', () => {
    Store.dispatch({
        type: 'CHANGE_CURRENT_ROUTE',
        currentRoute: {
            pathname: window.location.pathname,
            search: window.location.search
        }
    });
});

customElement('pc-router', async ({ constructing, props, update }) => {
    if (constructing) {
        let previousRoute = null;
        Store.subscribe(() => {
            const currentRoute = Store.getState().currentRoute;

            if (previousRoute === null || previousRoute.pathname !== currentRoute.pathname) {
                previousRoute = currentRoute;
                history.pushState({}, '', `${currentRoute.pathname}${currentRoute.search ? `${currentRoute.search}` : ''}`);
                update();
            }
        });
    }

    const currentRoute = Store.getState().currentRoute;
    const routeResult = await getRouteResult(Store.getState().currentRoute);

    return html`
        <pc-podcasts ?hidden=${currentRoute.pathname !== '/' && currentRoute.pathname !== '/podcasts'}></pc-podcasts>
        <pc-playlist ?hidden=${currentRoute.pathname !== '/playlist'}></pc-playlist>
        <pc-player ?hidden=${currentRoute.pathname !== '/player'}></pc-player>
        <pc-wallet ?hidden=${currentRoute.pathname !== '/wallet'}></pc-wallet>
        <pc-podcast-overview
            ?hidden=${currentRoute.pathname !== '/podcast-overview'}
            .feedUrl=${Store.getState().query.feedUrl}
        ></pc-podcast-overview>
    `;
});

async function getRouteResult(currentRoute): Promise<TemplateResult> {
    const routes: {
        [key: string]: () => Promise<TemplateResult>
    } = {
        '/': async () => {
            await import('./pc-podcasts.ts');
            return html`<pc-podcasts></pc-podcasts>`;
        },
        '/podcasts': async () => {
            await import('./pc-podcasts.ts');
            return html`<pc-podcasts></pc-podcasts>`;
        },
        '/playlist': async () => {
            await import('./pc-playlist.ts');
            return html`<pc-playlist></pc-playlist>`;
        },
        '/player': async () => {
            await import('./pc-player.ts');
            return html`<pc-player></pc-player>`;
        },
        '/wallet': async () => {
            await import('./pc-wallet.ts');
            return html`<pc-wallet></pc-wallet>`;
        },
        '/podcast-overview': async () => {
            await import('./pc-podcast-overview.ts');
            return html`<pc-podcast-overview></pc-podcast-overview>`;            
        }
    };

    return routes[Store.getState().currentRoute.pathname]();
}