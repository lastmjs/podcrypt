import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
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
    navigate,
    createPodcast,
    addEpisodeToPlaylist
} from '../services/utilities';
import './pc-loading';
import './pc-podcast-row';
import './pc-episode-row';

StorePromise.then((Store) => {
    customElement('pc-podcast-overview', ({ constructing, update, props }) => {
    
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

        if (props.feedUrl !== props.previousFeedUrl) {
            update({
                ...props,
                previousFeedUrl: props.feedUrl,
                loaded: false
            });
            getFeed(props.feedUrl, props, update);
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
                    .hidden=${props.loaded}
                    .prefix=${"pc-podcast-overview-"}
                ></pc-loading>

                ${
                    props.podcast === null || props.feed === null ? 
                        html`<div>Failed to load</div>` : 
                        html`
                            <pc-podcast-row .podcast=${props.podcast} .controls=${true} .verification=${true}></pc-podcast-row>

                            <br>
                        
                            <div class="pc-podcast-overview-podcast-description">${props.feed.description}</div>

                            <br>

                            <div class="pc-podcast-overview-episodes-title">Episodes</div>

                            <br>

                            ${props.feed.items.map((item: any) => {
                                const episode: Readonly<Episode> | undefined = Store.getState().episodes[item.guid];

                                return html`
                                    <pc-episode-row
                                        .podcast=${props.podcast}
                                        .episode=${episode || item}
                                        .play=${true}
                                        .playlist=${true}
                                        .date=${true}
                                    ></pc-episode-row>
                                `;
                            })}
                        `
                }
            </div>
        `;
    });
    
    async function getFeed(feedUrl: string, props: any, update: any): Promise<any> {    
        
        if (
            feedUrl === null ||
            feedUrl === undefined
        ) {
            return;
        }

        const feed = await getRSSFeed(feedUrl);
        const podcast: Readonly<Podcast | null> = await createPodcast(feedUrl, feed);

        update({
            ...props,
            loaded: true,
            previousFeedUrl: feedUrl,
            feed,
            podcast
        });
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

    function playEpisode(podcast: Readonly<Podcast>, item: any) {
        addEpisodeToPlaylist(Store, podcast, item);
       
        const episodeGuid: EpisodeGuid = item.guid;

        // TODO this action type should be changed, same as in the playlist
        Store.dispatch({
            type: 'PLAY_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }

    function pauseEpisode(episodeGuid: EpisodeGuid) {
        // TODO this action type should be changed, same as in the playlist
        Store.dispatch({
            type: 'PAUSE_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }
});