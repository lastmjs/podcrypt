import { customElement, html } from 'functional-element';
import { 
    pcContainerStyles,
    standardTextContainer
 } from '../services/css';
import { StorePromise } from '../state/store';
import {
    getRSSFeed,
    createPodcast
} from '../services/utilities';
import './pc-loading';
import './pc-episode-row';

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

        const episode: Readonly<Episode> = props.episode ? Store.getState().episodes[props.episode.guid] || props.episode : props.episode;

        return html`
            <style>
                .pc-episode-overview-container {
                    ${pcContainerStyles}
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
                            <pc-episode-row
                                .podcast=${props.podcast}
                                .episode=${episode}
                                .play=${true}
                                .playlist=${true}
                                .podcastTitle=${true}
                                .date=${true}
                            ></pc-episode-row>
                            <br>
                            <div class="pc-episode-overview-description">${props.episode.contentSnippet}</div>
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
