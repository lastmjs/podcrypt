import { customElement, html } from 'functional-element';
import { 
    pcContainerStyles,
    pxXSmall,
    color1Full,
    pxXXXSmall,
    normalShadow,
    standardTextContainer
 } from '../services/css';
import { StorePromise } from '../services/store';
import {
    getRSSFeed,
    createPodcast,
    addEpisodeToPlaylist
} from '../services/utilities';
import './pc-loading';

StorePromise.then((Store) => {
    customElement('pc-episode-overview', ({ constructing, props, update }) => {

        if (constructing) {

            Store.subscribe(update);

            return {
                feedUrl: null,
                previousFeedUrl: null,
                episodeGuid: null,
                previousEpisodeGuid: null,
                loaded: false,
                feed: null,
                podcast: null,
                episode: null
            };
        }

        if (
            props.feedUrl !== props.previousFeedUrl ||
            props.episodeGuid !== props.previousEpisodeGuid
        ) {
            const newProps = {
                ...props,
                loaded: false,
                previousFeedUrl: props.feedUrl,
                previousEpisodeGuid: props.episodeGuid
            };

            update(newProps);
            loadEpisode(props.feedUrl, props.episodeGuid, update, newProps);
        }

        return html`
            <style>
                .pc-episode-overview-container {
                    ${pcContainerStyles}
                }

                .pc-episode-overview-podcast-title {
                    font-size: ${pxXSmall};
                    font-weight: bold;
                    color: ${color1Full};
                }

                .pc-episode-overview-episode-title {
                    box-shadow: ${normalShadow};
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                }

                .pc-episode-overview-date {
                    font-size: ${pxXSmall};
                    font-weight: bold;
                    color: ${color1Full};
                }

                .pc-episode-overview-description {
                    ${standardTextContainer}
                }
            </style>

            <div class="pc-episode-overview-container">
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-episode-overview-"}
                ></pc-loading>

                ${
                    props.feed === null ||
                    props.podcast === null ||
                    props.episode === null ?
                        html`<div>Failed to load</div>` : 
                        html`
                            <div class="pc-episode-overview-podcast-title">${props.podcast.title}</div>

                            <br>

                            <div class="pc-episode-overview-episode-title">
                                <div>${props.episode.title}</div>
                                <div style="display: flex; align-items: center; justify-content: top">
                                    <i 
                                        class="material-icons"
                                        style="font-size: calc(30px + 1vmin); padding: calc(5px + 1vmin)"
                                        @click=${() => addEpisodeToPlaylist(Store, props.podcast, props.episode)}
                                    >playlist_add
                                    </i>
                                    ${
                                        props.episode && Store.getState().episodes[props.episode.guid] && Store.getState().episodes[props.episode.guid].playing ? 
                                        html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => pauseEpisode(props.episode.guid)} title="Pause episode">pause</i>` : 
                                        html`<i class="material-icons pc-playlist-item-audio-control" @click=${() => playEpisode(props.podcast, props.episode)} title="Resume episode">play_arrow</i>`
                                    }
                                </div>
                            </div>
                            <br>
                            <div class="pc-episode-overview-date">${new Date(props.episode.isoDate).toLocaleDateString()}</div>
                            <br>
                            <div class="pc-episode-overview-description">${props.episode.contentSnippet}</div>

                        `
                }
            </div>
        `;
    });

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

    async function loadEpisode(feedUrl: string, episodeGuid: string, update: any, props: any) {
        if (
            feedUrl === null ||
            feedUrl === undefined ||
            episodeGuid === null ||
            episodeGuid === undefined
        ) {
            return;
        }

        const feed = await getRSSFeed(feedUrl);
        const podcast = await createPodcast(feedUrl, feed);

        if (
            feed === null ||
            podcast === null
        ) {
            update({
                ...props,
                loaded: true,
                feed,
                podcast
            });
            return;
        }

        const episode = feed.items.filter((item: any) => {
            return item.guid === episodeGuid;
        })[0];

        if (episode === undefined) {
            update({
                ...props,
                loaded: true,
                feed,
                podcast,
                episode: null
            });
            return;
        }

        update({
            ...props,
            loaded: true,
            feed,
            podcast,
            episode
        });
    }
});
