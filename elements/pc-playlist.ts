import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { 
    pcContainerStyles,
    normalShadow,
    pxSmall,
    pxXSmall,
    pxXXSmall,
    pxXXXSmall,
    color1Full,
    colorBlackMedium,
    colorBlackVeryLight,
    pxXLarge
 } from '../services/css';
import { 
    navigateInPlace,
    getRSSFeed,
    createPodcast,
    addEpisodeToPlaylist,
    navigate
} from '../services/utilities';
import './pc-loading';

StorePromise.then((Store) => {
    // TODO we might be repeating a lot of code, think about making a component for the episode items
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

                .pc-playlist-item {
                    box-shadow: ${normalShadow};
                    display: flex;
                    position: relative;
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                    padding: ${pxXSmall};
                }

                .pc-playlist-item-arrows-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .pc-playlist-item-arrow {
                    font-size: ${pxXLarge};
                    cursor: pointer;
                }

                .pc-playlist-item-text-container {
                    flex: 1;
                    padding-left: ${pxXSmall};
                    cursor: pointer;
                }

                .pc-playlist-item-episode-title {
                    font-size: ${pxSmall};
                    font-weight: bold;
                }

                .pc-playlist-item-episode-title-finished-listening {
                    font-weight: normal;
                    color: ${colorBlackMedium};
                }

                .pc-playlist-item-podcast-title {
                    font-size: ${pxXSmall};
                    color: ${color1Full};
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 60vw; /*TODO I want this width to be based on its container*/
                    margin-bottom: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-playlist-item-controls-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pc-playlist-item-audio-control {
                    font-size: ${pxXLarge};
                    cursor: pointer;
                }

                .pc-playlist-item-select {
                    border: none;
                    background-color: transparent;
                    width: 35px;
                    cursor: pointer;
                    position: absolute;
                    top: 5px;
                    right: 5px;
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
                ${Store.getState().playlist.map((episodeGuid: any, index: any) => {
                    const episode: Readonly<Episode> = Store.getState().episodes[episodeGuid];
                    const podcast: Readonly<Podcast> = Store.getState().podcasts[episode.feedUrl];
                    const currentPlaylistIndex: number = Store.getState().currentPlaylistIndex;
                    const currentlyPlaying: boolean = currentPlaylistIndex === index;

                    return html`
                        <div
                            class="pc-playlist-item" style="${currentlyPlaying ? `background-color: ${colorBlackVeryLight}` : ''}"
                        >
                            <div class="pc-playlist-item-arrows-container">
                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeUp(index)}
                                >
                                    keyboard_arrow_up
                                </i>

                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeDown(index)}
                                >
                                    keyboard_arrow_down
                                </i>
                            </div>

                            <div 
                                class="pc-playlist-item-text-container"
                                @click=${() => navigate(Store, `/episode-overview?feedUrl=${podcast.feedUrl}&episodeGuid=${episode.guid}`)}
                            >
                                <div 
                                    class="pc-playlist-item-podcast-title"
                                >
                                    ${podcast.title}
                                </div>

                                <div 
                                    class="pc-playlist-item-episode-title${episode.finishedListening ? ' pc-playlist-item-episode-title-finished-listening' : ''} "
                                >
                                    ${episode.title}
                                </div>
                            </div>

                            <div class="pc-playlist-item-controls-container">

                                ${
                                    episode.playing ? 
                                        html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => pauseEpisode(episodeGuid)} title="Pause episode">pause</i>` : 
                                        html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => playEpisode(episodeGuid)} title="Resume episode">play_arrow</i>`
                                }

                                <select
                                    @change=${(e: any) => testSelect(e, index)}
                                    class="pc-playlist-item-select"
                                >
                                    <option>...</option>
                                    <option>Remove from playlist</option>
                                </select>
                            </div>
                        </div>
                    `;
                })}
            `;
    }

    function testSelect(e: any, index: number) {

        // TODO constantize each of the options in the dropdown

        if (e.target.value === 'Remove from playlist') {
            removeEpisodeFromPlaylist(index);
        }

        e.target.value = '...';
    }

    function playEpisode(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'PLAY_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });

        const episode: Readonly<Episode> = Store.getState().episodes[episodeGuid];
        navigateInPlace(Store, `/playlist?feedUrl=${episode.feedUrl}&episodeGuid=${episodeGuid}`);
    }

    function pauseEpisode(episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'PAUSE_EPISODE_FROM_PLAYLIST',
            episodeGuid
        });
    }

    function moveEpisodeUp(playlistIndex: number) {
        Store.dispatch({
            type: 'MOVE_EPISODE_UP',
            playlistIndex
        });
    }

    function moveEpisodeDown(playlistIndex: number) {
        Store.dispatch({
            type: 'MOVE_EPISODE_DOWN',
            playlistIndex
        });
    }

    function removeEpisodeFromPlaylist(playlistIndex: number) {
        Store.dispatch({
            type: 'REMOVE_EPISODE_FROM_PLAYLIST',
            playlistIndex
        });
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