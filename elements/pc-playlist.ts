import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { 
    navigate,
    getRSSFeed,
    createPodcast
} from '../services/utilities';
import './pc-loading';

StorePromise.then((Store) => {
    // TODO we might be repeating a lot of code, think about making a component for the episode items
    customElement('pc-playlist', ({ constructing, update, props }) => {
        if (constructing) {
            Store.subscribe(update);
            return {
                feedUrl: null,
                episodeGuid: null,
                loaded: false
            };
        }

        // TODO preparePlaylist is disgusting...think of a cleaner way to get the episode to load first try
        preparePlaylist(props, update);

        return html`
            <style>
                .pc-playlist-container {
                    ${pcContainerStyles}
                    padding-left: 0;
                    padding-right: 0;
                }

                .pc-playlist-item {
                    display: flex;
                    position: relative;
                    box-shadow: -5px 5px 5px -5px grey;
                    padding: 2%;
                }

                .pc-playlist-item-arrows-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .pc-playlist-item-arrow {
                    font-size: calc(25px + 1vmin);
                    cursor: pointer;
                }

                .pc-playlist-item-title {
                    text-overflow: ellipsis;
                    flex: 1;
                    font-size: calc(12px + 1vmin);
                    padding: 2%;
                    font-weight: bold;
                }

                .pc-playlist-item-controls-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pc-playlist-item-audio-control {
                    font-size: calc(35px + 1vmin);
                    cursor: pointer;
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
        return html`<div style="padding-left: 2%; padding-right: 2%">Loading...</div>`;
    }

    function loadedUI() {
        return Store.getState().playlist.length === 0 ?
            html`<div style="display: flex; align-items: center; justify-content: center; margin-top: 25%; font-size: calc(20px + 1vmin); color: grey">Your playlist is empty</div>` :
            html`
                ${Store.getState().playlist.map((episodeGuid: any, index: any) => {
                    const episode = (Store.getState() as any).episodes[episodeGuid];
                    const currentPlaylistIndex = (Store.getState() as any).currentPlaylistIndex;
                    const currentlyPlaying = currentPlaylistIndex === index;

                    return html`
                        <div
                            class="pc-playlist-item" style="${currentlyPlaying ? 'background-color: rgba(0, 0, 0, .05)' : ''}"
                        >
                            <div class="pc-playlist-item-arrows-container">
                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeUp(index)}
                                    title="Move episode up"
                                >keyboard_arrow_up</i>

                                <i 
                                    class="material-icons pc-playlist-item-arrow"
                                    @click=${() => moveEpisodeDown(index)}
                                    title="Move episode down"
                                >keyboard_arrow_down</i>
                            </div>
                            <div class="pc-playlist-item-title">${episode.finishedListening ? '*' : ''} ${episode.title}</div>
                            <div class="pc-playlist-item-controls-container">
                                ${
                                    episode.playing ? 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${pauseEpisode} title="Pause episode">pause</i>` : 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => playEpisode(index, episodeGuid)} title="Resume episode">play_arrow</i>`
                                }

                                <!--TODO we need a three dots menu for the extra stuff here, like deleting-->
                                <i 
                                    class="material-icons"
                                    style="font-size: 15px; cursor: pointer; position: absolute; top: 5px; right: 5px"
                                    @click=${() => removeEpisodeFromPlaylist(index)}
                                    title="Remove episode from playlist"
                                >delete
                                </i>                                
                            </div>
                        </div>
                    `;
                })}
            `;
    }

    function playEpisode(playlistIndex: number, episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'PLAY_EPISODE_FROM_PLAYLIST',
            playlistIndex
        });

        Store.dispatch({
            type: 'CURRENT_EPISODE_PLAYED'
        });

        const episode: Readonly<Episode> = Store.getState().episodes[episodeGuid];
        navigate(Store, `/playlist?feedUrl=${episode.feedUrl}&episodeGuid=${episodeGuid}`);
    }

    function pauseEpisode() {
        Store.dispatch({
            type: 'PAUSE_EPISODE_FROM_PLAYLIST'
        });

        Store.dispatch({
            type: 'CURRENT_EPISODE_PAUSED'
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

    // TODO preparePlaylist is disgusting...think of a cleaner way to get the episode to load first try
    async function preparePlaylist(props: any, update: any) {


        if (props.loaded === true) {
            return;
        }

        if (
            Store.getState().currentRoute.pathname === '/playlist' &&
            Store.getState().currentRoute.search === '' &&
            props.loaded === false
        ) {
            update({
                ...props,
                loaded: true
            });
        }

        if (
            props.feedUrl !== null &&
            props.feedUrl !== undefined &&
            props.episodeGuid !== null &&
            props.episodeGuid !== undefined
        ) {
            if (Store.getState().currentEpisodeGuid === props.episodeGuid) {
                update({
                    ...props,
                    loaded: true
                });
                return;
            }

            if (Store.getState().preparingPlaylist) {
                return;
            }
            else {
                Store.dispatch({
                    type: 'SET_PREPARING_PLAYLIST',
                    preparingPlaylist: true
                });
            }

            if (!Store.getState().podcasts[props.feedUrl]) {
                const podcast: Readonly<Podcast | null> = await createPodcast(props.feedUrl);

                Store.dispatch({
                    type: 'SUBSCRIBE_TO_PODCAST',
                    podcast
                });
            }

            if (!Store.getState().episodes[props.episodeGuid]) {
                // TODO grabbing the feed is not optimized...we will be grabbing it multiple times potentially
                // TODO if the podcast also does not yet exist in Redux
                const feed = await getRSSFeed(props.feedUrl);
                const episodeItem = feed.items.filter((item: any) => {
                    return item.guid === props.episodeGuid;
                })[0];
                const podcast: Readonly<Podcast> = Store.getState().podcasts[props.feedUrl];
                
                // TODO put episode creation somewhere to share
                const episode: Readonly<Episode> = {
                    feedUrl: podcast.feedUrl,
                    guid: episodeItem.guid,
                    title: episodeItem.title,
                    src: episodeItem.enclosure.url,
                    finishedListening: false,
                    playing: false,
                    progress: '0',
                    isoDate: episodeItem.isoDate,
                    timestamps: []
                };

                Store.dispatch({
                    type: 'ADD_EPISODE_TO_PLAYLIST',
                    podcast,
                    episode
                });
            }

            const podcast: Readonly<Podcast> = Store.getState().podcasts[props.feedUrl];
            const episode: Readonly<Episode> = Store.getState().episodes[props.episodeGuid];

            if (!Store.getState().playlist.includes(props.episodeGuid)) {
                Store.dispatch({
                    type: 'ADD_EPISODE_TO_PLAYLIST',
                    podcast,
                    episode
                });
            }

            if (!(Store.getState().currentEpisodeGuid === episode.guid)) {
                Store.dispatch({
                    type: 'SET_CURRENT_EPISODE',
                    episode
                });
            }

            Store.dispatch({
                type: 'SET_PREPARING_PLAYLIST',
                preparingPlaylist: false
            });
        
            update({
                ...props,
                loaded: true
            });
        }
    }
});