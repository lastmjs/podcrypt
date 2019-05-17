import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { 
    pcContainerStyles
 } from '../services/css';
import { 
    getRSSFeed,
    createPodcast,
    addEpisodeToPlaylist
} from '../services/utilities';
import './pc-loading';

StorePromise.then((Store) => {
    customElement('pc-playlist', ({ constructing, update, props }) => {
        if (constructing) {
            Store.subscribe(update);
            return {
                feedUrl: null,
                previousFeedUrl: null,
                episodeGuid: null,
                previousEpisodeGuid: null,
                loaded: false
            };
        }

        if (
            Store.getState().currentRoute.pathname === '/playlist' &&
            props.feedUrl !== props.previousFeedUrl &&
            props.episodeGuid !== props.previousEpisodeGuid
        ) {
            const newProps = {
                ...props,
                loaded: false,
                previousFeedUrl: props.feedUrl,
                previousEpisodeGuid: props.episodeGuid
            };

            update(newProps);
            preparePlaylist(newProps, update);
        }

        return html`
            <style>
                .pc-playlist-container {
                    ${pcContainerStyles}
                }

            </style>

            <div class="pc-playlist-container">
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-playlist-"}
                ></pc-loading>
                ${props.loaded ? loadedUI() : loadingUI()}
            </div>
    `});

    function loadingUI() {
        return html`<div>Loading...</div>`;
    }

    function loadedUI() {
        return Store.getState().playlist.length === 0 ?
            html`<div style="display: flex; align-items: center; justify-content: center; margin-top: 25%; font-size: calc(20px + 1vmin); color: grey">Your playlist is empty</div>` :
            html`
                ${Store.getState().playlist.map((episodeGuid: EpisodeGuid, index: number) => {
                    const episode: Readonly<Episode> = Store.getState().episodes[episodeGuid];
                    const podcast: Readonly<Podcast> = Store.getState().podcasts[episode.feedUrl];
                    const currentPlaylistIndex: number = Store.getState().currentPlaylistIndex;
                    const currentlyPlaying: boolean = currentPlaylistIndex === index;

                    return html`
                        <pc-episode-row
                            .podcast=${podcast}
                            .episode=${episode}
                            .arrows=${true}
                            .play=${true}
                            .options=${true}
                            .currentlyPlaying=${currentlyPlaying}
                            .podcastTitle=${true}
                            .date=${true}
                        ></pc-episode-row>
                    `;
                })}
            `;
    }

    async function preparePlaylist(props: any, update: any) {

        // TODO It is a little unclear to me why this is working.
        // TODO we want to load pretty immediately if there is no feedUrl or episodeGuid in the route
        // TODO this might be checking for that situation
        if (
            props.feedUrl === null ||
            props.feedUrl === undefined ||
            props.episodeGuid === null ||
            props.episodeGuid === undefined
        ) {
            setTimeout(() => {
                update({
                    ...props,
                    loaded: true
                });
            });
            
            return;
        }

        const episodeInState = Store.getState().episodes[props.episodeGuid];
        const episodeDoesNotExist = episodeInState === null || episodeInState === undefined;

        // TODO check for null results indicating failures, display ui accordingly
        if (episodeDoesNotExist) {
            const feed = await getRSSFeed(props.feedUrl);
            const episodeItem = feed.items.filter((item: any) => {
                return item.guid === props.episodeGuid;
            })[0];
            const podcast: Readonly<Podcast> | null = await createPodcast(props.feedUrl, feed);

            addEpisodeToPlaylist(Store, podcast, episodeItem);

            const episode: Readonly<Episode> = Store.getState().episodes[props.episodeGuid];

            Store.dispatch({
                type: 'SET_CURRENT_EPISODE',
                episode
            });
        }
        else {
            Store.dispatch({
                type: 'SET_CURRENT_EPISODE',
                episode: episodeInState
            });
        }
        
        update({
            ...props,
            loaded: true
        });
    }
});