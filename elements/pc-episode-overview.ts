import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
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
                            <div style="display: flex; padding-left: 3%">
                                <div style="flex: 1">
                                    <img src="${props.podcast.imageUrl}" width="60" height="60">
                                </div>
                                <div style="font-weight: bold; font-size: calc(16px + 1vmin); flex: 3">${props.podcast.title}</div>
                            </div>
                            <br>
                            <div style="display: flex">
                                <div style="padding-left: 5%; padding-right: 5%; font-weight: bold; font-size: calc(14px + 1vmin)">${props.episode.title}</div>
                                <div style="display: flex; align-items: center; justify-content: top">
                                    <i 
                                        class="material-icons"
                                        style="font-size: calc(30px + 1vmin); padding: calc(5px + 1vmin)"
                                        @click=${() => addEpisodeToPlaylist(Store, props.podcast, props.episode)}
                                    >playlist_add
                                    </i> 
                                </div>
                            </div>
                            <br>
                            <div style="padding-left: 5%; font-weight: bold; font-size: calc(12px + 1vmin); color: grey">${new Date(props.episode.isoDate).toLocaleDateString()}</div>
                            <br>
                            <div style="padding-left: 5%; padding-right: 5%; overflow-wrap: break-word">${props.episode.contentSnippet}</div>

                        `
                }
            </div>
        `;
    });

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
