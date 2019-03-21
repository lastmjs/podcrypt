import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { 
    navigateInPlace,
    getRSSFeed,
    createPodcast,
    addEpisodeToPlaylist
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
                    padding-left: 0;
                    padding-right: 0;
                }

                .pc-playlist-item {
                    display: flex;
                    position: relative;
                    box-shadow: 0px 5px 5px -5px grey;
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
                    const episode: Readonly<Episode> = Store.getState().episodes[episodeGuid];
                    const podcast: Readonly<Podcast> = Store.getState().podcasts[episode.feedUrl];
                    const currentPlaylistIndex = Store.getState().currentPlaylistIndex;
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
                            <div class="pc-playlist-item-title">
                                <div style="font-size: calc(10px + 1vmin); color: grey; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 60vw">${podcast.title}</div>
                                <div>${episode.finishedListening ? '*' : ''} ${episode.title}</div>
                            </div>
                            <div class="pc-playlist-item-controls-container">
                                ${
                                    episode.playing ? 
                                    html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => pauseEpisode(episodeGuid)} title="Pause episode">pause</i>` : 
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

    // TODO why even pass in the index here, why not just the episodeGuid?
    function playEpisode(playlistIndex: number, episodeGuid: EpisodeGuid) {
        Store.dispatch({
            type: 'PLAY_EPISODE_FROM_PLAYLIST',
            playlistIndex
        });

        Store.dispatch({
            type: 'CURRENT_EPISODE_PLAYED'
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