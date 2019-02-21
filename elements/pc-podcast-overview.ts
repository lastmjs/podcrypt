import { customElement, html } from 'functional-element';
import '../node_modules/rss-parser/dist/rss-parser.min.js';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here
import { Store } from '../services/store';
import { pcContainerStyles } from '../services/css';

customElement('pc-podcast-overview', ({ constructing, element, update, props }) => {
    
    if (constructing) {
        return {
            feedUrl: null
        };
    }

    return html`
        <style>
            .pc-podcast-overview-container {
                ${pcContainerStyles}
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
    // const feed = await new RSSParser().parseURL(`${feedUrl}`);

    console.log(feed);

    return html`
        <h2>${feed.title}</h2>
        <h3>${feed.description}</h3>
        <h4>Episodes</h4>
        ${feed.items.map((item) => {
            return html`
                <div>
                    <div>${new Date(item.isoDate).toLocaleString()} - ${item.title}</div>
                    <button @click=${() => addEpisodeToPlaylist(item)}>Add to playlist</button>
                    <button>Subscribe</button>
                </div>
                <br>
            `;
        })}
    `;
}

// TODO really this should add to the playlist and start the playlist
// function playEpisode(item) {
//     Store.dispatch({
//         type: 'PLAY_EPISODE',
//         episode: {
//             guid: item.guid,
//             title: item.title,
//             src: item.enclosure.url,
//             finishedListening: false,
//             playing: false,
//             progress: 0,
//             isoDate: item.isoDate
//         }
//     });
// }

function addEpisodeToPlaylist(item) {
    Store.dispatch({
        type: 'ADD_EPISODE_TO_PLAYLIST',
        episode: {
            guid: item.guid,
            title: item.title,
            src: item.enclosure.url,
            finishedListening: false,
            playing: false,
            progress: 0,
            isoDate: item.isoDate
        }
    });
}