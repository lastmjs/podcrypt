import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {StorePromise} from "../state/store.js";
import {
  pcContainerStyles,
  pxMedium,
  color1Medium,
  pxLarge
} from "../services/css.js";
import "./pc-loading.js";
import "./pc-podcast-row.js";
import "../_snowpack/pkg/@vaadin/vaadin-tabs.js";
import "./pc-podcast-search-results.js";
import "./pc-podcast-row.js";
StorePromise.then((Store) => {
  customElement("pc-podcasts", ({
    constructing,
    connecting,
    element,
    update,
    loaded,
    tabIndex,
    searchTerm
  }) => {
    if (constructing) {
      Store.subscribe(update);
      return {
        loaded: false,
        tabIndex: "NOT_SET",
        searchTerm: ""
      };
    }
    if (connecting) {
      setTimeout(() => {
        update({
          loaded: true,
          tabIndex: Object.values(Store.getState().podcasts).length === 0 ? 1 : 0
        });
      });
    }
    return html`
            <style>
                .pc-podcasts-container {
                    ${pcContainerStyles}
                }
    
                .pc-podcasts-search-input {
                    width: 100%;
                    font-size: ${pxMedium};
                    border: none;
                    border-bottom: 1px solid ${color1Medium};
                    font-family: Ubuntu;
                    background-color: transparent;
                }
    
                .pc-podcasts-empty-text {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: calc(75px + 1vmin);
                    font-size: ${pxLarge};
                    color: grey;
                }
            </style>
    
            <div class="pc-podcasts-container">
                <pc-loading
                    .hidden=${loaded}
                    .prename=${"pc-podcasts-"}
                >
                </pc-loading>

                <input
                    id="search-input"
                    class="pc-podcasts-search-input"
                    type="text"
                    placeholder="Search by term or feed URL"
                    @keydown=${(e) => searchInputKeyDown(e, element, update)}
                >

                <vaadin-tabs .selected=${tabIndex}>
                    <vaadin-tab @click=${() => update({tabIndex: 0})}>My Podcasts</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 1})}>Featured</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 2})}>Crypto</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 3})}>Technology</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 4})}>Science</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 5})}>Business</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 6})}>Travel</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 7})}>Health</vaadin-tab>
                    <vaadin-tab @click=${() => update({tabIndex: 8})}>Search Results</vaadin-tab>
                </vaadin-tabs>

                <div ?hidden=${tabIndex !== 0}>
                    ${Object.values(Store.getState().podcasts).length === 0 ? html`<div class="pc-podcasts-empty-text">Search for podcasts above</div>` : html`
                                ${Object.values(Store.getState().podcasts).map((podcast) => {
      return html`
                                        <pc-podcast-row
                                            .podcast=${podcast}
                                            .verification=${true}
                                            .options=${true}
                                        ></pc-podcast-row>
                                    `;
    })}
                        `}
                </div>

                <div ?hidden=${tabIndex !== 1}>
                    <div style="color: grey; padding-top: calc(10px + 1vmin)">Featured podcasts are sponsors of Podcrypt</div>
                    <pc-podcast-row
                        .podcast=${{
      feedUrl: "https://feeds.redcircle.com/734dacb5-2f36-46e4-9617-2b2d3cf50a53",
      artistName: "Andrew Phillips & Evan McFarland",
      title: "Internet Computer Report",
      description: "",
      imageUrl: "https://media.redcircle.com/images/2020/11/10/15/14581543-fd94-4b6a-96b2-531fc97b36fd_de18f8dd-ebda-4abd-8abe-2c35487a7b34_8bcc7509-7c80-4ba5-a2f8-26ad1d66ba7e_4a9c6229-7e79-461b-ae74-5dcc516701e0_blob.jpg",
      episodeGuids: [],
      previousPayoutDate: "NEVER",
      latestTransactionHash: "NOT_SET",
      ethereumAddress: "NOT_FOUND",
      ensName: "NOT_FOUND",
      email: "NOT_SET",
      timeListenedTotal: 0,
      timeListenedSincePreviousPayoutDate: 0,
      lastStartDate: "NEVER",
      paymentsEnabled: false
    }}
                        .controls=${true}
                        .options=${true}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
      feedUrl: "https://feeds.buzzsprout.com/1790339.rss",
      artistName: "Arthur Falls",
      title: "The Internet Computer Weekly",
      description: "",
      imageUrl: "https://storage.buzzsprout.com/variants/b4lb5p5gavleidczumfehu0fmex6/60854458c4d1acdf4e1c2f79c4137142d85d78e379bdafbd69bd34c85f5819ad.jpg",
      episodeGuids: [],
      previousPayoutDate: "NEVER",
      latestTransactionHash: "NOT_SET",
      ethereumAddress: "NOT_FOUND",
      ensName: "NOT_FOUND",
      email: "NOT_SET",
      timeListenedTotal: 0,
      timeListenedSincePreviousPayoutDate: 0,
      lastStartDate: "NEVER",
      paymentsEnabled: false
    }}
                        .controls=${true}
                        .options=${true}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
      feedUrl: "https://ic3o3-qiaaa-aaaae-qaaia-cai.raw.ic0.app/demergence.rss",
      artistName: "Jordan Last @lastmjs",
      title: "Demergence",
      description: "",
      imageUrl: "https://ic3o3-qiaaa-aaaae-qaaia-cai.raw.ic0.app/demergence.png",
      episodeGuids: [],
      previousPayoutDate: "NEVER",
      latestTransactionHash: "NOT_SET",
      ethereumAddress: "NOT_FOUND",
      ensName: "NOT_FOUND",
      email: "NOT_SET",
      timeListenedTotal: 0,
      timeListenedSincePreviousPayoutDate: 0,
      lastStartDate: "NEVER",
      paymentsEnabled: false
    }}
                        .controls=${true}
                        .options=${true}
                    >
                    </pc-podcast-row>
                </div>

                ${tabIndex === 2 ? html`<pc-podcast-search-results .term=${"crypto"} .limit=${20}></pc-podcast-search-results>` : ""}
                ${tabIndex === 3 ? html`<pc-podcast-search-results .term=${"technology"} .limit=${20}></pc-podcast-search-results>` : ""}
                ${tabIndex === 4 ? html`<pc-podcast-search-results .term=${"science"} .limit=${20}></pc-podcast-search-results>` : ""}
                ${tabIndex === 5 ? html`<pc-podcast-search-results .term=${"business"} .limit=${20}></pc-podcast-search-results>` : ""}
                ${tabIndex === 6 ? html`<pc-podcast-search-results .term=${"travel"} .limit=${20}></pc-podcast-search-results>` : ""}
                ${tabIndex === 7 ? html`<pc-podcast-search-results .term=${"health"} .limit=${20}></pc-podcast-search-results>` : ""}
                ${tabIndex === 8 ? html`<pc-podcast-search-results .term=${searchTerm} .limit=${50}></pc-podcast-search-results>` : ""}

            </div>
        `;
  });
  function searchInputKeyDown(e, element, update) {
    if (e.keyCode === 13) {
      const searchInput = element.querySelector("#search-input");
      const term = searchInput.value.split(" ").join("+");
      update({
        searchTerm: term,
        tabIndex: 8
      });
    }
  }
});
