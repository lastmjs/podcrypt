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
import dompurify from 'dompurify';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

StorePromise.then((Store) => {
    customElement('pc-episode-overview', ({ 
        constructing,
        update,
        episode,
        feedUrl,
        previousFeedUrl,
        episodeGuid,
        previousEpisodeGuid,
        feed,
        podcast,
        loaded
    }) => {

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
            feedUrl !== previousFeedUrl ||
            episodeGuid !== previousEpisodeGuid
        ) {
            const newProps = {
                loaded: false,
                previousFeedUrl: feedUrl,
                previousEpisodeGuid: episodeGuid
            };

            update(newProps);
            loadEpisode(feedUrl, episodeGuid, update, newProps);
        }

        const theEpisode: Readonly<Episode> = episode ? Store.getState().episodes[episode.guid] || episode : episode;

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
                    .hidden=${loaded}
                    .prename=${"pc-episode-overview-"}
                ></pc-loading>

                ${
                    feed === null ||
                    podcast === null ||
                    episode === null ?
                        html`<div>Failed to load</div>` : 
                        html`
                            <pc-episode-row
                                .podcast=${podcast}
                                .episode=${theEpisode}
                                .play=${true}
                                .playlist=${true}
                                .podcastTitle=${true}
                                .date=${true}
                                .options=${true}
                            ></pc-episode-row>
                            <br>
                            <div class="pc-episode-overview-description">${unsafeHTML(dompurify.sanitize(episode.contentSnippet, {
                                ALLOWED_TAGS: ['br', 'a'],
                                ALLOWED_ATTR: ['href']                                
                            }))}</div>
                        `
                }
            </div>
        `;
    });

    // TODO refactor the props here, we do not necessarily need the spread
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
                loaded: true,
                feed,
                podcast,
                episode: null
            });
            return;
        }

        update({
            loaded: true,
            feed,
            podcast,
            episode
        });
    }
});
