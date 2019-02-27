import { customElement, html } from 'functional-element';
import '../node_modules/rss-parser/dist/rss-parser.min.js';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';

StorePromise.then((Store) => {
    customElement('pc-podcast-overview', ({ constructing, element, update, props }) => {
    
        if (constructing) {
            return {
                podcast: null
            };
        }
    
        return html`
            <style>
                .pc-podcast-overview-container {
                    ${pcContainerStyles}
                }
            </style>
    
            <div class="pc-podcast-overview-container">
                ${until(getFeed(props.podcast), 'Loading...')}
            </div>
        `;
    });
    
    async function getFeed(podcastRaw) {
        if (podcastRaw === 'undefined') {
            return;
        }
    
        const podcast = JSON.parse(podcastRaw);
        const feed = await new RSSParser().parseURL(`https://jsonp.afeld.me/?url=${podcast.feedUrl}`);
    
        return html`
            <h2>${feed.title}</h2>
            <h3>${feed.description}</h3>
            <h4>Episodes</h4>
            ${feed.items.map((item) => {
                return html`
                    <div>
                        <div>${new Date(item.isoDate).toLocaleString()} - ${item.title}</div>
                        <button @click=${() => addEpisodeToPlaylist(podcast, item)}>Add to playlist</button>
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
    
    function addEpisodeToPlaylist(podcast, item) {
        console.log(item)
        Store.dispatch({
            type: 'ADD_EPISODE_TO_PLAYLIST',
            episode: {
                podcastId: podcast.feedUrl,
                guid: item.guid,
                title: item.title,
                src: item.enclosure.url,
                finishedListening: false,
                playing: false,
                progress: 0,
                isoDate: item.isoDate,
                timestamps: []
            },
            podcast: {
                ...podcast
            }
        });
    }
});