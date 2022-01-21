import {customElement, html, unsafeHTML} from "../_snowpack/pkg/functional-element.js";
import {
  pcContainerStyles,
  standardTextContainer
} from "../services/css.js";
import {StorePromise} from "../state/store.js";
import {
  getRSSFeed,
  createPodcast,
  createEpisodeFromPodcastAndItem
} from "../services/utilities.js";
import "./pc-loading.js";
import "./pc-episode-row.js";
import dompurify from "../_snowpack/pkg/dompurify.js";
StorePromise.then((Store) => {
  customElement("pc-episode-overview", async ({
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
    if (feedUrl !== previousFeedUrl || episodeGuid !== previousEpisodeGuid) {
      const newProps = {
        loaded: false,
        previousFeedUrl: feedUrl,
        previousEpisodeGuid: episodeGuid
      };
      update(newProps);
      await loadEpisode(feedUrl, episodeGuid, update, newProps);
      update({
        loaded: true
      });
    }
    const theEpisode = episode ? Store.getState().episodes[episode.guid] || episode : episode;
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

                ${feed === null || podcast === null || episode === null ? html`<div>Failed to load</div>` : html`
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
                            <div class="pc-episode-overview-description">${unsafeHTML(dompurify.sanitize(episode.description, {
      ALLOWED_TAGS: ["br", "a"],
      ALLOWED_ATTR: ["href"]
    }))}</div>
                        `}
            </div>
        `;
  });
  async function loadEpisode(feedUrl, episodeGuid, update, props) {
    if (feedUrl === null || feedUrl === void 0 || episodeGuid === null || episodeGuid === void 0) {
      return;
    }
    const feed = await getRSSFeed(feedUrl);
    const podcast = await createPodcast(feedUrl, feed);
    if (feed === null || podcast === null) {
      update({
        feed,
        podcast
      });
      return;
    }
    const item = feed.items.filter((item2) => {
      return item2.guid === episodeGuid;
    })[0];
    const episode = createEpisodeFromPodcastAndItem(podcast, item);
    if (episode === void 0) {
      update({
        feed,
        podcast,
        episode: null
      });
      return;
    }
    update({
      feed,
      podcast,
      episode
    });
  }
});
