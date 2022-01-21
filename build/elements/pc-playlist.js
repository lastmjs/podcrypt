import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {StorePromise} from "../state/store.js";
import {
  pcContainerStyles
} from "../services/css.js";
import {
  getRSSFeed,
  createPodcast,
  addEpisodeToPlaylist
} from "../services/utilities.js";
import "./pc-loading.js";
import "./pc-episode-row.js";
StorePromise.then((Store) => {
  customElement("pc-playlist", ({
    constructing,
    update,
    feedUrl,
    previousFeedUrl,
    episodeGuid,
    previousEpisodeGuid,
    loaded
  }) => {
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
    if (Store.getState().currentRoute.pathname === "/playlist" && feedUrl !== previousFeedUrl && episodeGuid !== previousEpisodeGuid) {
      const newProps = {
        loaded: false,
        previousFeedUrl: feedUrl,
        previousEpisodeGuid: episodeGuid
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
                    .hidden=${true}
                    .prename=${"pc-playlist-"}
                ></pc-loading>
                ${true ? loadedUI() : loadingUI()}
            </div>
    `;
  });
  function loadingUI() {
    return html`<div>Loading...</div>`;
  }
  function loadedUI() {
    return Store.getState().playlist.length === 0 ? html`<div style="display: flex; align-items: center; justify-content: center; margin-top: 25%; font-size: calc(20px + 1vmin); color: grey">Your playlist is empty</div>` : html`
                ${Store.getState().playlist.map((episodeGuid, index) => {
      const episode = Store.getState().episodes[episodeGuid];
      const podcast = Store.getState().podcasts[episode.feedUrl];
      const currentPlaylistIndex = Store.getState().currentPlaylistIndex;
      const currentlyPlaying = currentPlaylistIndex === index;
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
  async function preparePlaylist(props, update) {
    if (props.feedUrl === null || props.feedUrl === void 0 || props.episodeGuid === null || props.episodeGuid === void 0) {
      setTimeout(() => {
        update({
          loaded: true
        });
      });
      return;
    }
    const episodeInState = Store.getState().episodes[props.episodeGuid];
    const episodeDoesNotExist = episodeInState === null || episodeInState === void 0;
    if (episodeDoesNotExist) {
      const feed = await getRSSFeed(props.feedUrl);
      if (feed === null) {
        return;
      }
      const episodeItem = feed.items.filter((item) => {
        return item.guid === props.episodeGuid;
      })[0];
      const podcast = await createPodcast(props.feedUrl, feed);
      if (podcast === null) {
        return;
      }
      addEpisodeToPlaylist(Store, podcast, episodeItem);
      const episode = Store.getState().episodes[props.episodeGuid];
      Store.dispatch({
        type: "SET_CURRENT_EPISODE",
        episode
      });
    } else {
      Store.dispatch({
        type: "SET_CURRENT_EPISODE",
        episode: episodeInState
      });
    }
    update({
      loaded: true
    });
  }
});
