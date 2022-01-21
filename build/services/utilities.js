import "../node_modules/rss-parser/dist/rss-parser.min.js";
import BigNumber from "../_snowpack/pkg/bignumberjs.js";
import {ethersProvider} from "./ethers-provider.js";
import "../node_modules/ethers/dist/ethers.min.js";
import {
  del,
  get,
  set
} from "../_snowpack/pkg/idb-keyval.js";
export const fiveMegabytesInBytes = 5242880;
export const podcryptProxy = "https://proxy.podcrypt.app/";
export const podcryptDownloadURL = "https://download.podcrypt.app/";
export const cryptonatorAPIEndpoint = `https://api.cryptonator.com/api/ticker/eth-usd`;
export const etherscanAPIEndpoint = `https://api.etherscan.io/api?module=stats&action=ethprice`;
export function parseQueryString(queryString) {
  return queryString.split("&").reduce((result, keyAndValue) => {
    const keyAndValueArray = keyAndValue.split("=");
    const key = keyAndValueArray[0];
    const value = keyAndValueArray[1];
    return {
      ...result,
      [key]: value
    };
  }, {});
}
export function navigate(Store, path) {
  window.history.pushState({}, "", path);
  Store.dispatch({
    type: "CHANGE_CURRENT_ROUTE",
    currentRoute: {
      pathname: window.location.pathname,
      search: window.location.search,
      query: parseQueryString(window.location.search.slice(1))
    }
  });
}
export function navigateInPlace(Store, path) {
  window.history.replaceState({}, "", path);
  Store.dispatch({
    type: "CHANGE_CURRENT_ROUTE",
    currentRoute: {
      pathname: window.location.pathname,
      search: window.location.search,
      query: parseQueryString(window.location.search.slice(1))
    }
  });
}
export async function getAudioFileResponse(url, attemptNumber = 0) {
  try {
    if (attemptNumber === 0) {
      const response = await window.fetch(url);
      return response;
    }
    if (attemptNumber === 1) {
      const response = await window.fetch(`${podcryptProxy}${url}`);
      return response;
    }
    return null;
  } catch (error) {
    console.log(`getAudioFileResponse error`, error);
    return await getAudioFileResponse(url, attemptNumber + 1);
  }
}
export async function getRSSFeed(feedUrl, attemptNumber = 0) {
  try {
    if (attemptNumber === 0) {
      const feedResponse = await window.fetch(`${feedUrl}`);
      const feedRaw = await feedResponse.text();
      const feed = await new RSSParser().parseString(feedRaw);
      return feed;
    }
    if (attemptNumber === 1) {
      const feedResponse = await window.fetch(`${podcryptProxy}${feedUrl}`);
      const feedRaw = await feedResponse.text();
      const feed = await new RSSParser().parseString(feedRaw);
      return feed;
    }
    return null;
  } catch (error) {
    console.log("getRSSFeed error", error);
    return await getRSSFeed(feedUrl, attemptNumber + 1);
  }
}
export function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
export async function createPodcast(feedUrl, feed) {
  const theFeed = await getFeed(feedUrl, feed);
  if (theFeed === null) {
    return null;
  }
  const ethereumAddressInfo = await getEthereumAddressFromPodcastDescription(theFeed.description);
  const email = theFeed.itunes ? theFeed.itunes.owner ? theFeed.itunes.owner.email ? theFeed.itunes.owner.email : "NOT_SET" : "NOT_SET" : "NOT_SET";
  const imageUrl = getImageUrl(theFeed);
  const artistName = theFeed.itunes ? theFeed.itunes.author : "NOT_SET";
  const podcast = {
    feedUrl,
    artistName,
    title: theFeed.title,
    description: theFeed.description,
    imageUrl,
    episodeGuids: [],
    previousPayoutDate: "NEVER",
    latestTransactionHash: "NOT_SET",
    ethereumAddress: ethereumAddressInfo.ethereumAddress,
    ensName: ethereumAddressInfo.ensName,
    email,
    timeListenedTotal: 0,
    timeListenedSincePreviousPayoutDate: 0,
    lastStartDate: "NEVER",
    paymentsEnabled: ethereumAddressInfo.ethereumAddress !== "NOT_FOUND" && ethereumAddressInfo.ethereumAddress !== "MALFORMED" || ethereumAddressInfo.ensName !== "NOT_FOUND"
  };
  return podcast;
}
function getImageUrl(feed) {
  console.log(feed.image);
  if (feed.image) {
    return feed.image.url;
  }
  if (feed.itunes) {
    if (feed.itunes.image) {
      return feed.itunes.image;
    }
  }
  return "NOT_FOUND";
}
export async function getFeed(feedUrl, feed) {
  try {
    if (feed) {
      return feed;
    } else {
      const feed2 = await getRSSFeed(feedUrl);
      return feed2;
    }
  } catch (error) {
    console.log("getFeed error", error);
    return null;
  }
}
export async function getEthereumAddressFromPodcastDescription(podcastDescription) {
  try {
    const ethereumAddressInfoFromPodcastDescription = await parseOrResolveEthereumAddressFromPodcastDescription(podcastDescription);
    if (ethereumAddressInfoFromPodcastDescription.ethereumAddress === "NOT_FOUND") {
      return ethereumAddressInfoFromPodcastDescription;
    }
    const verifiedAddress = ethers.utils.getAddress(ethereumAddressInfoFromPodcastDescription.ethereumAddress);
    return {
      ethereumAddress: verifiedAddress,
      ensName: ethereumAddressInfoFromPodcastDescription.ensName
    };
  } catch (error) {
    console.log("getEthereumAddressFromPodcastDescription error", error);
    return {
      ethereumAddress: "MALFORMED",
      ensName: "NOT_FOUND"
    };
  }
}
async function parseOrResolveEthereumAddressFromPodcastDescription(podcastDescription) {
  const ensMatchInfo = podcastDescription.match(/.*(( |^).*\.eth)/);
  const ensName = ensMatchInfo !== null ? ensMatchInfo[1].trim() : "NOT_FOUND";
  if (ensName === "NOT_FOUND") {
    return {
      ethereumAddress: parseEthereumAddressFromPodcastDescription(podcastDescription),
      ensName: "NOT_FOUND"
    };
  } else {
    const resolvedEthereumAddress = await ethersProvider.resolveName(ensName);
    if (resolvedEthereumAddress !== null) {
      return {
        ethereumAddress: resolvedEthereumAddress,
        ensName
      };
    } else {
      return {
        ethereumAddress: parseEthereumAddressFromPodcastDescription(podcastDescription),
        ensName: "NOT_FOUND"
      };
    }
  }
}
function parseEthereumAddressFromPodcastDescription(podcastDescription) {
  const ethereumAddressmatchInfo = podcastDescription.match(/0x[a-fA-F0-9]{40}/);
  const ethereumAddress = ethereumAddressmatchInfo !== null ? ethereumAddressmatchInfo[0] : "NOT_FOUND";
  return ethereumAddress;
}
export function createEpisodeFromPodcastAndItem(podcast, item) {
  const episode = {
    feedUrl: podcast.feedUrl,
    guid: item.guid,
    title: item.title,
    src: item.enclosure ? item.enclosure.url : item.src,
    finishedListening: false,
    playing: false,
    progress: "0",
    isoDate: item.isoDate,
    downloadState: "NOT_DOWNLOADED",
    downloadProgressPercentage: 0,
    description: item.content,
    downloadChunkData: []
  };
  return episode;
}
export function addEpisodeToPlaylist(Store, podcast, item) {
  const episode = createEpisodeFromPodcastAndItem(podcast, item);
  Store.dispatch({
    type: "ADD_EPISODE_TO_PLAYLIST",
    episode,
    podcast
  });
}
export async function getSafeLowGasPriceInWEI() {
  const gasPriceResponse = await window.fetch("https://ethgasstation.info/json/ethgasAPI.json");
  const gasPriceJSON = await gasPriceResponse.json();
  const safeLowGasPriceInGWEI = gasPriceJSON.safeLow;
  const safeLowGasPriceInGWEIBigNumber = new BigNumber(safeLowGasPriceInGWEI);
  const safeLowGasPriceInWEI = safeLowGasPriceInGWEIBigNumber.multipliedBy(1e8).toFixed(0);
  return safeLowGasPriceInWEI;
}
export function copyTextToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.width = "0px";
  textarea.style.height = "0px";
  textarea.contentEditable = "true";
  textarea.readOnly = false;
  window.document.body.appendChild(textarea);
  if (navigator.platform.includes("iPhone") || navigator.platform.includes("iPod") || navigator.platform.includes("iPad")) {
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    if (selection === null) {
      alert("Could not copy");
      return;
    }
    selection.removeAllRanges();
    selection.addRange(range);
    textarea.setSelectionRange(0, text.length);
  } else {
    textarea.select();
  }
  window.document.execCommand("copy");
  window.document.body.removeChild(textarea);
}
export async function deleteDownloadedEpisode(Store, episode) {
  for (let i = 0; i < episode.downloadChunkData.length; i++) {
    const downloadChunkDatum = episode.downloadChunkData[i];
    await del(downloadChunkDatum.key);
  }
  Store.dispatch({
    type: "SET_EPISODE_DOWNLOAD_CHUNK_DATA",
    episodeGuid: episode.guid,
    downloadChunkData: []
  });
  Store.dispatch({
    type: "SET_EPISODE_DOWNLOAD_STATE",
    episodeGuid: episode.guid,
    downloadState: "NOT_DOWNLOADED"
  });
  Store.dispatch({
    type: "SET_DOWNLOAD_PROGRESS_PERCENTAGE_FOR_EPISODE",
    episodeGuid: episode.guid,
    downloadProgressPercentage: 0
  });
}
export function bytesToMegabytes(bytes) {
  return Math.floor(+bytes / 1024 ** 2);
}
export async function getAndSaveWyrePrivateKey() {
  const wyrePrivateKey = await get("wyrePrivateKey");
  if (wyrePrivateKey === void 0) {
    const emptyArray = new Uint8Array(25);
    window.crypto.getRandomValues(emptyArray);
    const wyrePrivateKey2 = Array.from(emptyArray).map((int) => int.toString(16).padStart(2, "0")).join("");
    await set("wyrePrivateKey", wyrePrivateKey2);
    return wyrePrivateKey2;
  } else {
    return wyrePrivateKey;
  }
}
