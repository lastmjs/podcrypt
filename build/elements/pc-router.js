import {
  render,
  html
} from "../_snowpack/pkg/lit-html.js";
import {
  cache
} from "../_snowpack/pkg/lit-html/directives/cache.js";
import {StorePromise} from "../state/store.js";
import {parseQueryString} from "../services/utilities.js";
import "./pc-loading.js";
StorePromise.then((Store) => {
  window.addEventListener("popstate", (e) => {
    if (window.location.pathname === "/playlist") {
      Store.dispatch({
        type: "CHANGE_CURRENT_ROUTE",
        currentRoute: {
          pathname: window.location.pathname,
          search: ``,
          query: {}
        }
      });
      history.replaceState({}, "", `/playlist`);
    } else {
      Store.dispatch({
        type: "CHANGE_CURRENT_ROUTE",
        currentRoute: {
          pathname: window.location.pathname,
          search: window.location.search,
          query: parseQueryString(window.location.search.slice(1))
        }
      });
    }
  });
  window.addEventListener("click", (e) => {
    if (e.target.nodeName === "A") {
      if (!e.target.href.startsWith("http://localhost") && !e.target.href.startsWith("https://deploy-preview") && !e.target.href.startsWith("https://podcrypt")) {
        return;
      }
      e.preventDefault();
      Store.dispatch({
        type: "CHANGE_CURRENT_ROUTE",
        currentRoute: {
          pathname: e.target.pathname,
          search: e.target.search,
          query: parseQueryString(e.target.search.slice(1))
        }
      });
      history.pushState({}, "", `${Store.getState().currentRoute.pathname}${Store.getState().currentRoute.search ? `${Store.getState().currentRoute.search}` : ""}`);
    }
  });
  Store.dispatch({
    type: "CHANGE_CURRENT_ROUTE",
    currentRoute: {
      pathname: window.location.pathname,
      search: window.location.search,
      query: parseQueryString(window.location.search.slice(1))
    }
  });
  class PCRouter extends HTMLElement {
    constructor() {
      super();
      this.loadedPathnames = [];
      Store.subscribe(async () => render(await this.render(Store.getState()), this));
    }
    async render(state) {
      if (!this.loadedPathnames.includes(state.currentRoute.pathname)) {
        showLoading(true);
        this.loadedPathnames = [
          ...this.loadedPathnames,
          state.currentRoute.pathname
        ];
      }
      const templateResult = await getTemplateResultForRoute(state.currentRoute.pathname, state.currentRoute.search);
      showLoading(false);
      return html`
                ${cache(templateResult)}
                <pc-loading
                    id="pc-router-loading"
                    .prename=${"pc-router-"}
                    .hidden=${false}
                ></pc-loading>
            `;
    }
  }
  async function getTemplateResultForRoute(pathname, search) {
    if (pathname === "/" || pathname === "/index.html") {
      await import("./pc-podcasts.js");
      return html`<pc-podcasts></pc-podcasts>`;
    }
    if (pathname === "/playlist") {
      const feedUrl = getSearchParam(search, "feedUrl");
      const episodeGuid = getSearchParam(search, "episodeGuid");
      await import("./pc-playlist.js");
      return html`<pc-playlist .feedUrl=${feedUrl} .episodeGuid=${episodeGuid}></pc-playlist>`;
    }
    if (pathname === "/wallet") {
      await import("./pc-wallet.js");
      return html`<pc-wallet></pc-wallet>`;
    }
    if (pathname === "/podcast-overview") {
      const feedUrl = getSearchParam(search, "feedUrl");
      await import("./pc-podcast-overview.js");
      return html`<pc-podcast-overview .feedUrl=${feedUrl}></pc-podcast-overview>`;
    }
    if (pathname === "/episode-overview") {
      const feedUrl = getSearchParam(search, "feedUrl");
      const episodeGuid = getSearchParam(search, "episodeGuid");
      await import("./pc-episode-overview.js");
      return html`<pc-episode-overview .feedUrl=${feedUrl} .episodeGuid=${episodeGuid}></pc-episode-overview>`;
    }
    if (pathname === "/credit") {
      await import("./pc-credits.js");
      return html`<pc-credits></pc-credits>`;
    }
    if (pathname === "/privacy") {
      await import("./pc-privacy.js");
      return html`<pc-privacy></pc-privacy>`;
    }
    if (pathname === "/contact") {
      await import("./pc-contact.js");
      return html`<pc-contact></pc-contact>`;
    }
    if (pathname === "/about") {
      await import("./pc-about.js");
      return html`<pc-about></pc-about>`;
    }
    if (pathname === "/not-verified-help") {
      const feedUrl = getSearchParam(search, "feedUrl");
      const podcastEmail = getSearchParam(search, "podcastEmail");
      await import("./pc-not-verified-help.js");
      return html`<pc-not-verified-help .feedUrl=${feedUrl} .podcastEmail=${podcastEmail}></pc-not-verified-help>`;
    }
    if (pathname === "/restore-with-phrase") {
      await import("./pc-restore-with-phrase.js");
      return html`<pc-restore-with-phrase></pc-restore-with-phrase>`;
    }
    if (pathname === "/backup-and-restore") {
      await import("./pc-backup-and-restore.js");
      return html`<pc-backup-and-restore></pc-backup-and-restore>`;
    }
    if (pathname === "/downloads") {
      await import("./pc-downloads.js");
      return html`<pc-downloads></pc-downloads>`;
    }
    if (pathname === "/blog") {
      await import("./pc-blog.js");
      return html`<pc-blog></pc-blog>`;
    }
    return html`<div>Not found</div>`;
  }
  window.customElements.define("pc-router", PCRouter);
  function getSearchParam(search, paramName) {
    const paramValue = new URLSearchParams(search).get(paramName) || void 0;
    return paramValue;
  }
  function showLoading(show) {
    const pcRouterLoading = document.getElementById("pc-router-loading");
    if (pcRouterLoading) {
      if (show === true) {
        pcRouterLoading.hidden = false;
      } else {
        pcRouterLoading.hidden = true;
      }
    }
  }
});
