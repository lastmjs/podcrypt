import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import {
    getRSSFeed,
    navigate,
    createPodcast,
    addEpisodeToPlaylist
} from '../services/utilities';
import './pc-loading';

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
                    padding-left: 0;
                    padding-right: 0;
                }

                .pc-podcast-overview-episode {
                    display: flex;
                    box-shadow: inset 0px 5px 5px -5px grey;
                    padding: 2%;
                }

                .pc-podcast-overview-episode-title {
                    font-size: calc(12px + 1vmin);
                    font-weight: bold;
                    text-overflow: ellipsis;
                    flex: 1;
                    padding: 2%;
                }

                .pc-podcast-overview-episode-controls-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .pc-podcast-overview-episode-add-control {
                    font-size: 35px;
                    cursor: pointer;
                }

                .pc-playlist-item-audio-control {
                    font-size: 45px;
                    cursor: pointer;
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
                            <div style="display: flex; margin: 0; padding: 5%; padding-top: 5%">
                                <div style="flex: 1">
                                    <img src="${props.podcast.imageUrl}" width="60" height="60" style="border-radius: 5%">
                                </div>
                                <div style="flex: 3;">
                                    <div style="font-weight: bold; font-size: calc(16px + 1vmin); flex: 3">${props.feed.title}</div>
                                    <div>
                                        ${
                                            props.podcast.ethereumAddress === 'NOT_FOUND' ? 
                                                html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${() => notVerifiedHelpClick(props.podcast)}>Not verified - click to help</button>` :
                                                props.podcast.ethereumAddress === 'MALFORMED' ?
                                        html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${() => notVerifiedHelpClick(props.podcast)}>Not verified - click to help</button>` :
                                                    html`<button style="color: green; border: none; padding: 5px; margin: 5px" @click=${(e: any) => { e.stopPropagation(); alert(`This podcast's Ethereum address: ${props.podcast.ethereumAddress}`)} }>Verified</button>` }
                                    </div>
                                </div>
                            </div>
                        
                            <h4 style="margin: 0; padding: 2%; box-shadow: inset 0px 5px 5px -5px grey;">${props.feed.description}</h4>

                            ${props.feed.items.map((item: any) => {
                                const episode: Readonly<Episode> | undefined = Store.getState().episodes[item.guid];

                                return html`
                                    <div class="pc-podcast-overview-episode">
                                        <div
                                            class="pc-podcast-overview-episode-title"
                                            @click=${() => navigate(Store, `/episode-overview?feedUrl=${props.podcast.feedUrl}&episodeGuid=${item.guid}`)}
                                        >
                                            <div>${item.title}</div>
                                            <br>
                                            <div style="font-size: calc(10px + 1vmin); font-weight: bold; color: grey">${new Date(item.isoDate).toLocaleDateString()}</div>
                                        </div>

                                        <div class="pc-podcast-overview-episode-controls-container">
                                            ${
                                                episode && episode.playing ? 
                                                html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => pauseEpisode(item.guid)} title="Pause episode">pause</i>` : 
                                                html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => playEpisode(props.podcast, item)} title="Resume episode">play_arrow</i>`
                                            }

                                            <i 
                                                class="material-icons pc-podcast-overview-episode-add-control"
                                                @click=${() => addEpisodeToPlaylist(Store, props.podcast, item)}
                                            >playlist_add
                                            </i>  

                                        </div>

                                    </div>
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

    function notVerifiedHelpClick(podcast: Readonly<Podcast>) {
        navigate(Store, `/not-verified-help?feedUrl=${podcast.feedUrl}&podcastEmail=${podcast.email}`);
    }

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