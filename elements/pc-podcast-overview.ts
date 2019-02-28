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
                    padding-left: 0;
                    padding-right: 0;
                }

                .pc-podcast-overview-episode {
                    display: flex;
                    box-shadow: 0 4px 2px -2px grey;
                    padding: 2%;
                }

                .pc-podcast-overview-episode-title {
                    font-size: calc(10px + 1vmin);
                    font-weight: bold;
                    text-overflow: ellipsis;
                    flex: 1;
                    padding: 2%;
                }

                .pc-podcast-overview-episode-controls-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pc-podcast-overview-episode-add-control {
                    font-size: 35px;
                    cursor: pointer;
                }
            </style>
    
            <div class="pc-podcast-overview-container">
                ${until(getFeed(props.podcast), html`<div style="padding: 5%">Loading...</div>`)}
            </div>
        `;
    });
    
    async function getFeed(podcastRaw: any) {
        if (podcastRaw === 'undefined') {
            return;
        }
    
        const podcast = JSON.parse(podcastRaw);
        const feed = await new RSSParser().parseURL(`https://jsonp.afeld.me/?url=${podcast.feedUrl}`);
    
        return html`
            <h2 style="margin: 0; padding: 5%; box-shadow: 0 4px 2px -2px grey;">${feed.title}</h2>
            <h4 style="margin: 0; padding: 2%; box-shadow: 0 4px 2px -2px grey;">${feed.description}</h4>
            ${feed.items.map((item: any) => {
                return html`
                    <div class="pc-podcast-overview-episode">
                        <div class="pc-podcast-overview-episode-title">
                            <div>${item.title}</div>
                            <br>
                            <div style="font-size: calc(10px + 1vmin); font-weight: normal">${new Date(item.isoDate).toLocaleDateString()}</div>
                        </div>

                        <div class="pc-podcast-overview-episode-controls-container">
                            <i 
                                class="material-icons pc-podcast-overview-episode-add-control"
                                @click=${() => addEpisodeToPlaylist(podcast, item)}
                            >playlist_add
                            </i>  
                        </div>
                    </div>
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
    
    function addEpisodeToPlaylist(podcast: any, item: any) {
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