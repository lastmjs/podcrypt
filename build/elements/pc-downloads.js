import {
  html,
  render as litRender
} from "../_snowpack/pkg/lit-html.js";
import {StorePromise} from "../state/store.js";
import "./pc-episode-row.js";
import {
  pcContainerStyles,
  standardTextContainer,
  titleTextXLarge
} from "../services/css.js";
import {
  bytesToMegabytes
} from "../services/utilities.js";
StorePromise.then((Store) => {
  class PCDownloads extends HTMLElement {
    constructor() {
      super();
      Store.subscribe(async () => litRender(await this.render(Store.getState()), this));
    }
    connectedCallback() {
      setTimeout(() => {
        Store.dispatch({
          type: "RENDER"
        });
      });
    }
    async render(state) {
      const episodes = Object.values(state.episodes);
      const downloadedEpisodes = episodes.filter((episode) => {
        return episode.downloadState === "DOWNLOADED" || episode.downloadState === "DOWNLOADING";
      });
      const {quota, usage} = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : {
        quota: "NOT_SUPPORTED",
        usage: "NOT_SUPPORTED"
      };
      const storageUsed = usage === "NOT_SUPPORTED" || usage === void 0 ? "NOT_SUPPORTED" : bytesToMegabytes(usage);
      const storageAvailable = quota === "NOT_SUPPORTED" || quota === void 0 ? "NOT_SUPPORTED" : bytesToMegabytes(quota);
      return html`
                <style>
                    .pc-downloads-container {
                        ${pcContainerStyles}
                    }

                    .pc-downloads-title {
                        ${titleTextXLarge}
                    }

                    .pc-downloads-quota-text {
                        ${standardTextContainer}
                    }
                </style>

                <div class="pc-downloads-container">
                    <div class="pc-downloads-title">Downloads</div>
                    
                    <br>

                    ${storageUsed !== "NOT_SUPPORTED" && storageAvailable !== "NOT_SUPPORTED" ? html`
                            <div class="pc-downloads-quota-text">
                                <div>Storage used: ${storageUsed} MB</div>
                                <br>
                                <div>Storage available: ${storageAvailable} MB</div>
                            </div>
                            <br>
                        ` : ""}

                    <!-- ${downloadedEpisodes.length === 0 ? html`<div style="display: flex; align-items: center; justify-content: center; margin-top: 25%; font-size: calc(20px + 1vmin); color: grey; text-align: center">No downloaded episodes</div>` : ""} -->
                    <div style="display: flex; align-items: center; justify-content: center; margin-top: 25%; font-size: calc(20px + 1vmin); color: grey; text-align: center">
                        Downloads disabled until further Internet Computer integration
                    </div>

                    ${downloadedEpisodes.map((episode) => {
        const podcast = state.podcasts[episode.feedUrl];
        return html`
                            <pc-episode-row
                                .podcast=${podcast}
                                .episode=${episode}
                                .play=${true}
                                .date=${true}
                                .options=${true}
                                .podcastTitle=${true}
                            ></pc-episode-row>
                        `;
      })}
                </div>
            
            `;
    }
  }
  window.customElements.define("pc-downloads", PCDownloads);
});
