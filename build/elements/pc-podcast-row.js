import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {html as htmlLit} from "../_snowpack/pkg/lit-html.js";
import {StorePromise} from "../state/store.js";
import {
  pxXSmall,
  pxSmall,
  pxXXXSmall,
  normalShadow,
  colorBlackMedium,
  color1Full,
  pxXXSmall,
  pxXLarge,
  alertPadding
} from "../services/css.js";
import {
  navigate,
  createPodcast,
  getFeed,
  addEpisodeToPlaylist,
  copyTextToClipboard,
  deleteDownloadedEpisode
} from "../services/utilities.js";
import BigNumber from "../node_modules/bignumber.js/bignumber.js";
import {
  pcAlert,
  pcConfirm
} from "./pc-modal.js";
StorePromise.then((Store) => {
  customElement("pc-podcast-row", ({
    constructing,
    podcast,
    controls,
    verification,
    payouts,
    usage,
    options,
    payoutAmountForPodcastDuringIntervalInUSD,
    percentageOfTotalTimeForPodcastDuringInterval,
    totalTimeForPodcastDuringIntervalInMinutes,
    secondsRemainingForPodcastDuringInterval,
    nextPayoutLocaleDateString,
    clickTemplate
  }) => {
    if (constructing) {
      return {
        podcast: null,
        controls: false,
        verification: false,
        payouts: false,
        usage: false,
        options: false,
        payoutAmountForPodcastDuringIntervalInUSD: null,
        percentageOfTotalTimeForPodcastDuringInterval: null,
        totalTimeForPodcastDuringIntervalInMinutes: null,
        secondsRemainingForPodcastDuringInterval: null,
        nextPayoutLocaleDateString: null,
        clickTemplate: "NOT_SET"
      };
    }
    return html`
            <style>
                .pc-podcast-row-main-container {
                    box-shadow: ${normalShadow};
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                    position: relative;
                }

                .pc-podcast-row-image-container {
                }

                .pc-podcast-row-image {
                    border-radius: ${pxXXXSmall};
                }

                .pc-podcast-row-text-container {
                    flex: 1;
                    cursor: pointer;
                    padding-left: ${pxXSmall};
                }

                .pc-podcast-row-text-artist-name {
                    font-size: ${pxXSmall};
                    color: ${color1Full};
                    text-overflow: ellipsis;
                    white-space: wrap;
                    overflow: hidden;
                    margin-bottom: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-podcast-row-text-title {
                    font-weight: bold;
                }

                .pc-podcast-row-text-title-container {
                    font-size: ${pxSmall};
                    font-family: Ubuntu;
                    color: ${colorBlackMedium};
                }

                .pc-podcast-row-controls-container {
                    display: flex;
                    padding-left: ${pxXSmall};
                    cursor: pointer;
                    font-size: ${pxXLarge};
                    align-items: center;
                    justify-content: center;
                }

                .pc-podcast-row-verification-container {
                    margin-top: ${pxXXSmall};
                }


                .pc-podcast-row-options-icon {
                    cursor: pointer;
                }

                .pc-podcast-row-options-item {
                    font-weight: bold;
                    cursor: pointer;
                    padding: calc(15px + 1vmin);
                    border-bottom: 1px solid grey;
                    text-align: center; 
                    font-size: calc(15px + 1vmin);  
                    width: 100%;   
                    box-sizing: border-box;              
                }
            </style>

            <div class="pc-podcast-row-main-container">
                <div class="pc-podcast-row-image-container">
                    ${podcast !== null ? html`
                        <img 
                            class="pc-podcast-row-image"
                            src="${podcast.imageUrl}"
                            width="60"
                            height="60"
                        >
                    ` : ``}
                </div>

                <div 
                    class="pc-podcast-row-text-container"
                    @click=${() => podcastClick(podcast, clickTemplate)}
                >
                    ${podcast !== null ? html`
                            
                            ${podcast.artistName ? html`
                                        <div class="pc-podcast-row-text-artist-name">${podcast.artistName}</div>
                                    ` : html``}

                            <div class="pc-podcast-row-text-title-container">
                                <div class="pc-podcast-row-text-title">${podcast.title}</div>

                                ${verification ? html`
                                            <div class="pc-podcast-row-verification-container">
                                                ${podcast.ethereumAddress === "NOT_FOUND" ? html`<button style="color: red; border: none; padding: 5px; margin: 5px; cursor: pointer;" @click=${(e) => notVerifiedHelpClick(e, podcast)}>Not verified - click to help</button>` : podcast.ethereumAddress === "MALFORMED" ? html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e) => notVerifiedHelpClick(e, podcast)}>Not verified - click to help</button>` : html`<button style="color: green; border: none; padding: 5px; margin: 5px; cursor: pointer;" @click=${(e) => {
      e.stopPropagation();
      pcAlert(html`<div style="${alertPadding}"><div>This podcast's Ethereum address:</div><br><div style="word-wrap: break-word">${podcast.ethereumAddress}</div></div>`, Store.getState().screenType);
    }}>Verified</button>`}
                                            </div>
                                        ` : html``}

                                ${usage ? html`
                                        <br>
                                        <div>$${new BigNumber(payoutAmountForPodcastDuringIntervalInUSD).toFixed(2)}, ${new BigNumber(percentageOfTotalTimeForPodcastDuringInterval).toFixed(2)}%, ${totalTimeForPodcastDuringIntervalInMinutes} min ${secondsRemainingForPodcastDuringInterval} sec</div>
                                    ` : html``}

                                ${payouts ? html`
                                        <br>
                                        <div @click=${(e) => e.stopPropagation()}>Last payout: ${podcast.previousPayoutDate === "NEVER" ? "never" : html`<a href="https://${process.env.NODE_ENV !== "production" ? "ropsten." : ""}etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${new Date(parseInt(podcast.previousPayoutDate)).toLocaleString()}</a>`}</div>
                                        <br>
                                        <div>Next payout: ${nextPayoutLocaleDateString}</div>
                                    ` : html``}
                            </div>
                        ` : `No podcast found`}
                </div>

                ${podcast && controls ? html`
                            <div class="pc-podcast-row-controls-container">
                                <i 
                                    class="material-icons"
                                    @click=${() => subscribeToPodcast(podcast.feedUrl)}
                                >
                                    library_add
                                </i>  
                            </div>
                        ` : html``}

                ${options ? html`
                        <i
                            class="material-icons pc-podcast-row-options-icon"
                            @click=${() => pcAlert(htmlLit`
                                <div style="display: flex; flex-direction: column; align-items: center">
                                    <div 
                                        class="pc-podcast-row-options-item"
                                        @click=${() => {
      copyPodcastURLOption(podcast);
      document.querySelector("pc-modal").closeClick();
    }}
                                    >
                                        Copy podcast URL
                                    </div>
                                    <div
                                        class="pc-podcast-row-options-item"
                                        @click=${() => {
      podcast.paymentsEnabled === true ? disablePaymentsOption(podcast) : enablePaymentsOption(podcast);
      document.querySelector("pc-modal").closeClick();
    }}
                                    >
                                        ${podcast.paymentsEnabled === true ? "Disable" : "Enable"} payments
                                    </div>
                                    <div 
                                        class="pc-podcast-row-options-item"
                                        @click=${() => {
      addAllEpisodesOldestToNewestOption(podcast);
      document.querySelector("pc-modal").closeClick();
    }}
                                    >
                                        Add all episodes to playlist: oldest -> newest
                                    </div>
                                    <div 
                                        class="pc-podcast-row-options-item"
                                        @click=${() => {
      addAllEpisodesNewestToOldestOption(podcast);
      document.querySelector("pc-modal").closeClick();
    }}
                                    >
                                        Add all episodes to playlist: newest -> oldest
                                    </div>
                                    <div 
                                        class="pc-podcast-row-options-item"
                                        @click=${() => {
      deleteOption(podcast);
      document.querySelector("pc-modal").closeClick();
    }}
                                    >
                                        Delete
                                    </div>
                                </div>
                            `, Store.getState().screenType)}
                        >
                            more_horiz
                        </i>
                    ` : html``}
            </div>
        `;
  });
  function podcastClick(podcast, clickTemplate) {
    if (clickTemplate !== "NOT_SET") {
      pcAlert(clickTemplate, Store.getState().screenType);
    } else {
      navigate(Store, `podcast-overview?feedUrl=${podcast.feedUrl}`);
    }
  }
  async function subscribeToPodcast(feedUrl) {
    const podcast = await createPodcast(feedUrl);
    if (podcast === null) {
      pcAlert(htmlLit`
                <div style="${alertPadding}">Could not subscribe to podcast</div>
            `, Store.getState().screenType);
      return;
    }
    Store.dispatch({
      type: "SUBSCRIBE_TO_PODCAST",
      podcast
    });
  }
  function notVerifiedHelpClick(e, podcast) {
    e.stopPropagation();
    navigate(Store, `/not-verified-help?feedUrl=${podcast.feedUrl}&podcastEmail=${podcast.email}`);
  }
  async function deleteOption(podcast) {
    const confirmation = await pcConfirm(html`
                <div style="${alertPadding}">Are you sure you want to delete this podcast and all of its data?</div>
            `, Store.getState().screenType);
    if (confirmation === true) {
      for (let i = 0; i < podcast.episodeGuids.length; i++) {
        const episodeGuid = podcast.episodeGuids[i];
        const episode = Store.getState().episodes[episodeGuid];
        await deleteDownloadedEpisode(Store, episode);
      }
      Store.dispatch({
        type: "DELETE_PODCAST",
        podcast
      });
    }
  }
  async function enablePaymentsOption(podcast) {
    Store.dispatch({
      type: "SET_PODCAST_PAYMENTS_ENABLED",
      feedUrl: podcast.feedUrl,
      paymentsEnabled: true
    });
  }
  async function disablePaymentsOption(podcast) {
    Store.dispatch({
      type: "SET_PODCAST_PAYMENTS_ENABLED",
      feedUrl: podcast.feedUrl,
      paymentsEnabled: false
    });
  }
  async function addAllEpisodesOldestToNewestOption(podcast) {
    const feed = await getFeed(podcast.feedUrl);
    if (feed === null) {
      pcAlert(htmlLit`<div style="${alertPadding}">The feed could not be loaded</div>`, Store.getState().screenType);
      return;
    }
    const sortedItems = [...feed.items].sort((a, b) => {
      return new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime();
    });
    sortedItems.forEach((item) => {
      addEpisodeToPlaylist(Store, podcast, item);
    });
  }
  async function addAllEpisodesNewestToOldestOption(podcast) {
    const feed = await getFeed(podcast.feedUrl);
    if (feed === null) {
      pcAlert(htmlLit`<div style="${alertPadding}">The feed could not be loaded</div>`, Store.getState().screenType);
      return;
    }
    feed.items.forEach((item) => {
      addEpisodeToPlaylist(Store, podcast, item);
    });
  }
  function copyPodcastURLOption(podcast) {
    copyTextToClipboard(`${window.location.origin}/podcast-overview?feedUrl=${podcast.feedUrl}`);
  }
});
