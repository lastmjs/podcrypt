import { customElement, html } from 'functional-element';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here
import { TemplateResult } from 'lit-html';
import { Store } from '../services/store';

window.addEventListener('popstate', () => {
    Store.dispatch({
        type: 'CHANGE_CURRENT_ROUTE',
        currentRoute: window.location.pathname
    });
});

window.addEventListener('click', (e) => {
    if (e.target.nodeName === 'A') {
        e.preventDefault();

        Store.dispatch({
            type: 'CHANGE_CURRENT_ROUTE',
            currentRoute: e.target.pathname
        });
    }
});

customElement('pc-router', ({ constructing, props, update }) => {
    if (constructing) {
        let pastRoute = null;
        Store.subscribe(() => {
            const currentRoute = Store.getState().currentRoute;

            if (pastRoute !== currentRoute) {
                pastRoute = currentRoute;
                history.pushState({}, '', currentRoute);
                update();
            }
        });
    }

    return html`
        ${until(getRouteResult(Store.getState().currentRoute), 'Loading...')}
    `;
});

async function getRouteResult(currentRoute: string): Promise<TemplateResult> {
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
        }
    };

    return routes[Store.getState().currentRoute]();
}