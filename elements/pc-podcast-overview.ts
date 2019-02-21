import { customElement, html } from 'functional-element';
import '../node_modules/rss-parser/dist/rss-parser.min.js';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here

customElement('pc-podcast-overview', ({ constructing, element, update, props }) => {
    
    console.log('props', props)

    if (constructing) {
        return {
            feedUrl: null
        };
    }

    return html`
        <style>
            .pc-podcast-overview-container {
                height: 100%;
                padding-left: 2%;
                padding-right: 2%;
                padding-top: 5%;
                padding-bottom: 5%;
                overflow-y: auto;
            }
        </style>

        <div class="pc-podcast-overview-container">
            ${until(getFeed(props.feedUrl), 'Loading...')}
        </div>
    `;
});

async function getFeed(feedUrl) {
    if (feedUrl === null || feedUrl === undefined || feedUrl === 'undefined') {
        return html`No podcast selected`;
    }

    const feed = await new RSSParser().parseURL(`https://cors-anywhere.herokuapp.com/${feedUrl}`);

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