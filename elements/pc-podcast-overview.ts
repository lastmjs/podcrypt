import { customElement, html } from 'functional-element';
import '../node_modules/rss-parser/dist/rss-parser.min.js';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here

customElement('pc-podcast-overview', ({ constructing, element, update, props }) => {
    return html`
        ${until(getFeed(), 'Loading...')}
    `;
});

function parseQueryString(queryString) {
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

async function getFeed() {
    const queryString = window.location.search.slice(1);
    const queryStringProperties = parseQueryString(queryString);
    const feedUrl = decodeURIComponent(queryStringProperties.feedUrl);
    const feed = await new RSSParser().parseURL(`https://cors-anywhere.herokuapp.com/${feedUrl}`);
    
    console.log(feed);

    return html`
        <h1>${feed.title}</h1>
        <h2>${feed.description}</h2>
        <h3>Episodes</h3>
        ${feed.items.map((item) => {
            return html`
                <div>${item.title}</div>
                <audio src="${item.enclosure.url}" controls></audio>
            `;
        })}
    `;
}