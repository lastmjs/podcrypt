import { 
    customElement, 
    html 
} from 'functional-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { StorePromise } from '../state/store';
import { 
    pcContainerStyles,
    pxXSmall,
    pxSmall,
    pxXXLarge,
    pxXXXSmall,
    normalShadow,
    titleTextLarge,
    standardTextContainer,
    color1Full
 } from '../services/css';
import {
    getRSSFeed,
    createPodcast,
    createEpisodeFromPodcastAndItem
} from '../services/utilities';
import './pc-loading';
import './pc-podcast-row';
import './pc-episode-row';
import dompurify from 'dompurify';

StorePromise.then((Store) => {
    customElement('pc-podcast-overview', async ({ 
        constructing,
        update,
        feedUrl,
        previousFeedUrl,
        loaded,
        podcast,
        feed
    }) => {
    
        if (constructing) {
            Store.subscribe(update);

            return {
                feedUrl: null,
                previousFeedUrl: null,
                loaded: false,
                podcast: null,
                feed: null
            };
        }

        if (feedUrl !== previousFeedUrl) {
            update({
                previousFeedUrl: feedUrl,
                loaded: false
            });
            await getFeed(feedUrl, update);
            update({
                loaded: true
            });
        }
    
        return html`
            <style>
                .pc-podcast-overview-container {
                    ${pcContainerStyles}
                }

                .pc-podcast-overview-podcast-description {
                    ${standardTextContainer}
                }

                .pc-podcast-overview-episode {
                    box-shadow: ${normalShadow};
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                }

                .pc-podcast-overview-episode-title {
                    font-size: ${pxSmall};
                    font-weight: bold;
                    flex: 10;
                }

                .pc-podcast-overview-episode-controls-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex: 1;
                }

                .pc-podcast-overview-episode-add-control {
                    font-size: ${pxXXLarge};
                    cursor: pointer;
                    margin-top: auto;
                }

                .pc-playlist-item-audio-control {
                    font-size: ${pxXXLarge};
                    cursor: pointer;
                }

                .pc-podcast-overview-episode-date {
                    font-size: ${pxXSmall};
                    font-weight: bold;
                    color: ${color1Full};
                }

                .pc-podcast-overview-episodes-title {
                    ${titleTextLarge}
                }
            </style>

            <div class="pc-podcast-overview-container">
                <pc-loading
                    .hidden=${loaded}
                    .prename=${"pc-podcast-overview-"}
                ></pc-loading>

                ${
                    podcast === null || feed === null ? 
                        html`<div>Failed to load</div>` : 
                        html`
                            <pc-podcast-row
                                .podcast=${podcast}
                                .controls=${true}
                                .verification=${true}
                                .options=${true}
                            ></pc-podcast-row>

                            <br>
                        
                            <div class="pc-podcast-overview-podcast-description">${unsafeHTML(dompurify.sanitize(feed.description, {
                                ALLOWED_TAGS: ['br', 'a'],
                                ALLOWED_ATTR: ['href']
                            }))}</div>

                            <br>

                            <div class="pc-podcast-overview-episodes-title">Episodes</div>

                            <br>

                            ${feed.items.map((item: Readonly<FeedItem>) => {
                                const episode: Readonly<Episode> = Store.getState().episodes[item.guid] || createEpisodeFromPodcastAndItem(podcast, item);

                                return html`
                                    <pc-episode-row
                                        .podcast=${podcast}
                                        .episode=${episode}
                                        .play=${true}
                                        .playlist=${true}
                                        .date=${true}
                                        .options=${true}
                                    ></pc-episode-row>
                                `;
                            })}
                        `
                }
            </div>
        `;
    });
    
    async function getFeed(feedUrl: string, update: any): Promise<any> {    
        
        if (
            feedUrl === null ||
            feedUrl === undefined
        ) {
            return;
        }

        const feed = await getRSSFeed(feedUrl);
        const podcast: Readonly<Podcast | null> = await createPodcast(feedUrl, feed);

        update({
            previousFeedUrl: feedUrl,
            feed,
            podcast
        });
    }
});
