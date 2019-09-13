import '../node_modules/rss-parser/dist/rss-parser.min.js';
import BigNumber from 'bignumber.js';
import { ethersProvider } from './ethers-provider';
import '../node_modules/ethers/dist/ethers.min.js';
import { 
    del,
    get,
    set
} from 'idb-keyval';

export const fiveMegabytesInBytes: number = 5242880;
export const podcryptProxy = 'https://proxy.podcrypt.app/';
// export const podcryptProxy = 'http://localhost:4000/';
export const podcryptDownloadURL = 'https://download.podcrypt.app/';

export const cryptonatorAPIEndpoint: CryptonatorETHPriceAPIEndpoint = `https://api.cryptonator.com/api/ticker/eth-usd`;
export const etherscanAPIEndpoint: EtherscanETHPriceAPIEndpoint = `https://api.etherscan.io/api?module=stats&action=ethprice`;

export function parseQueryString(queryString: string) {
    return queryString.split('&').reduce((result, keyAndValue) => {
        const keyAndValueArray = keyAndValue.split('=');
        const key = keyAndValueArray[0];
        const value = keyAndValueArray[1];
        return {
            ...result,
            [key]: value
        };
    }, {});
}

export function navigate(Store: any, path: string) {
    window.history.pushState({}, '', path);
    Store.dispatch({
        type: 'CHANGE_CURRENT_ROUTE',
        currentRoute: {
            pathname: window.location.pathname,
            search: window.location.search,
            query: parseQueryString(window.location.search.slice(1))
        }
    });
}

export function navigateInPlace(Store: any, path: string) {
    window.history.replaceState({}, '', path);
    Store.dispatch({
        type: 'CHANGE_CURRENT_ROUTE',
        currentRoute: {
            pathname: window.location.pathname,
            search: window.location.search,
            query: parseQueryString(window.location.search.slice(1))
        }
    });
}

// TODO we might want to abstract this request thing, we seem to be using it in mulitple places
export async function getAudioFileResponse(url: string, attemptNumber: number = 0): Promise<any | null> {
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
    }
    catch(error) {
        console.log(`getAudioFileResponse error`, error);
        return await getAudioFileResponse(url, attemptNumber + 1);
    }
}

export async function getRSSFeed(feedUrl: string, attemptNumber: number = 0): Promise<Feed | null> {
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
    }
    catch(error) {
        console.log('getRSSFeed error', error);
        return await getRSSFeed(feedUrl, attemptNumber + 1);
    }
}

export function wait(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export async function createPodcast(feedUrl: string, feed?: any): Promise<Readonly<Podcast> | null> {    
    const theFeed = await getFeed(feedUrl, feed);                    
    
    if (theFeed === null) {
        return null;
    }

    const ethereumAddressInfo: Readonly<EthereumAddressInfo> = await getEthereumAddressFromPodcastDescription(theFeed.description);
    const email: string | 'NOT_SET' = theFeed.itunes ? theFeed.itunes.owner ? theFeed.itunes.owner.email ? theFeed.itunes.owner.email : 'NOT_SET' : 'NOT_SET' : 'NOT_SET';
    const imageUrl: string | 'NOT_SET' = getImageUrl(theFeed);
    const artistName: string | 'NOT_SET' = theFeed.itunes ? theFeed.itunes.author : 'NOT_SET';

    const podcast: Readonly<Podcast> = {
        feedUrl,
        artistName,
        title: theFeed.title,
        description: theFeed.description,
        imageUrl,
        episodeGuids: [],
        previousPayoutDate: 'NEVER',
        latestTransactionHash: 'NOT_SET',
        ethereumAddress: ethereumAddressInfo.ethereumAddress,
        ensName: ethereumAddressInfo.ensName,
        email,
        timeListenedTotal: 0,
        timeListenedSincePreviousPayoutDate: 0,
        lastStartDate: 'NEVER',
        paymentsEnabled: (ethereumAddressInfo.ethereumAddress !== 'NOT_FOUND' && ethereumAddressInfo.ethereumAddress !== 'MALFORMED') || ethereumAddressInfo.ensName !== 'NOT_FOUND'
    };

    return podcast;
}

function getImageUrl(feed: any): string | 'NOT_FOUND' {

    console.log(feed.image);

    if (feed.image) {
        return feed.image.url;
    }

    if (feed.itunes) {
        if (feed.itunes.image) {
            return feed.itunes.image;
        }
    }

    return 'NOT_FOUND';
}

export async function getFeed(feedUrl: string, feed?: any): Promise<Feed | null> {
    try {
        if (feed) {
            return feed;
        }
        else {
            const feed = await getRSSFeed(feedUrl);   
            return feed;
        }        
    }
    catch(error) {
        console.log('getFeed error', error);
        return null;
    }
}

export async function getEthereumAddressFromPodcastDescription(podcastDescription: string): Promise<Readonly<EthereumAddressInfo>> {
    try {
        const ethereumAddressInfoFromPodcastDescription: Readonly<EthereumAddressInfo> = await parseOrResolveEthereumAddressFromPodcastDescription(podcastDescription);
        
        if (ethereumAddressInfoFromPodcastDescription.ethereumAddress === 'NOT_FOUND') {
            return ethereumAddressInfoFromPodcastDescription;
        }
        
        const verifiedAddress: EthereumAddress = ethers.utils.getAddress(ethereumAddressInfoFromPodcastDescription.ethereumAddress);

        return {
            ethereumAddress: verifiedAddress,
            ensName: ethereumAddressInfoFromPodcastDescription.ensName
        };        
    }
    catch(error) {
        console.log('getEthereumAddressFromPodcastDescription error', error);
        return {
            ethereumAddress: 'MALFORMED',
            ensName: 'NOT_FOUND'
        };
    }
}

async function parseOrResolveEthereumAddressFromPodcastDescription(podcastDescription: string): Promise<EthereumAddressInfo> {
    const ensMatchInfo: RegExpMatchArray | null = podcastDescription.match(/.*(( |^).*\.eth)/);
    const ensName: ENSName = ensMatchInfo !== null ? ensMatchInfo[1].trim() : 'NOT_FOUND';

    if (ensName === 'NOT_FOUND') {
        return {
            ethereumAddress: parseEthereumAddressFromPodcastDescription(podcastDescription),
            ensName: 'NOT_FOUND'
        };
    }
    else {
        const resolvedEthereumAddress: EthereumAddress | null = await ethersProvider.resolveName(ensName);
        if (resolvedEthereumAddress !== null) {
            return {
                ethereumAddress: resolvedEthereumAddress,
                ensName
            };
        }
        else {
            return {
                ethereumAddress: parseEthereumAddressFromPodcastDescription(podcastDescription),
                ensName: 'NOT_FOUND'
            };
        }
    }
}

function parseEthereumAddressFromPodcastDescription(podcastDescription: string): string | 'NOT_FOUND' {
    // TODO I took the regex below straight from here: https://www.regextester.com/99711
    // TODO I am not sure if there are any copyright issues with using it, it seems pretty deminimus and obvious to me
    const ethereumAddressmatchInfo: RegExpMatchArray | null = podcastDescription.match(/0x[a-fA-F0-9]{40}/);
    const ethereumAddress: EthereumAddress = ethereumAddressmatchInfo !== null ? ethereumAddressmatchInfo[0] : 'NOT_FOUND';
    return ethereumAddress;
}

// TODO unify podcast and episode creation...I think it is still a bit of a mess
export function createEpisodeFromPodcastAndItem(podcast: Readonly<Podcast>, item: Readonly<FeedItem>): Readonly<Episode> {
    const episode: Readonly<Episode> = {
        feedUrl: podcast.feedUrl,
        guid: item.guid,
        title: item.title,
        src: item.enclosure ? item.enclosure.url : item.src,
        finishedListening: false,
        playing: false,
        progress: '0',
        isoDate: item.isoDate,
        downloadState: 'NOT_DOWNLOADED',
        downloadProgressPercentage: 0,
        description: item.content,
        downloadChunkData: []
    };

    return episode;
}

export function addEpisodeToPlaylist(Store: any, podcast: Readonly<Podcast>, item: Readonly<FeedItem>) {
    const episode: Readonly<Episode> = createEpisodeFromPodcastAndItem(podcast, item);
    
    Store.dispatch({
        type: 'ADD_EPISODE_TO_PLAYLIST',
        episode,
        podcast
    });
}

// TODO we need a contingency plan for this oracle...
export async function getSafeLowGasPriceInWEI(): Promise<WEI> {
    const gasPriceResponse = await window.fetch('https://ethgasstation.info/json/ethgasAPI.json');
    const gasPriceJSON = await gasPriceResponse.json();

    const safeLowGasPriceInGWEI: GWEI = gasPriceJSON.safeLow;
    const safeLowGasPriceInGWEIBigNumber: BigNumber = new BigNumber(safeLowGasPriceInGWEI);
    // For some reason the API is returning GWEI times 10, so I multiply by 1e8 instead of 1e9
    // It's true, look here: https://github.com/ethgasstation/ethgasstation-backend/issues/5
    const safeLowGasPriceInWEI: WEI = safeLowGasPriceInGWEIBigNumber.multipliedBy(1e8).toFixed(0);

    return safeLowGasPriceInWEI;
}

export function copyTextToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
            
    textarea.value = text;
    textarea.style.width = '0px';
    textarea.style.height = '0px';
    textarea.contentEditable = 'true';
    textarea.readOnly = false;

    window.document.body.appendChild(textarea);

    if (
        navigator.platform.includes('iPhone') ||
        navigator.platform.includes('iPod') ||
        navigator.platform.includes('iPad')
    ) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
    
        const selection = window.getSelection();
    
        if (selection === null) {
            alert('Could not copy');
            return;
        }
    
        selection.removeAllRanges();
        selection.addRange(range);

        textarea.setSelectionRange(0, text.length);
    }
    else {
        textarea.select();
    }
    
    window.document.execCommand('copy');

    window.document.body.removeChild(textarea);
}

export async function deleteDownloadedEpisode(Store: any, episode: Readonly<Episode>): Promise<void> {
    for (let i=0; i < episode.downloadChunkData.length; i++) {
        const downloadChunkDatum: Readonly<DownloadChunkDatum> = episode.downloadChunkData[i];

        await del(downloadChunkDatum.key);
    }

    Store.dispatch({
        type: 'SET_EPISODE_DOWNLOAD_CHUNK_DATA',
        episodeGuid: episode.guid,
        downloadChunkData: []
    });

    Store.dispatch({
        type: 'SET_EPISODE_DOWNLOAD_STATE',
        episodeGuid: episode.guid,
        downloadState: 'NOT_DOWNLOADED'
    });

    Store.dispatch({
        type: 'SET_DOWNLOAD_PROGRESS_PERCENTAGE_FOR_EPISODE',
        episodeGuid: episode.guid,
        downloadProgressPercentage: 0
    });
}

export function bytesToMegabytes(bytes: number | string): number {
    // TODO I would rather use parseInt(), but the types are messed up
    return Math.floor(+bytes / (1024 ** 2));
}

export async function getAndSaveWyrePrivateKey() {
    const wyrePrivateKey: string | null = await get('wyrePrivateKey');

    if (wyrePrivateKey === undefined) {
        // TODO I'm not sure how this will behave across multiple devices...we might want to derive the wyre private key from the ethereum private key...I'm not sure how to do that in a way that we don't leak the ethereum private key to wyre though...I'll have to study it
        const emptyArray: Uint8Array = new Uint8Array(25);
        window.crypto.getRandomValues(emptyArray);
        const wyrePrivateKey: string = Array.from(emptyArray).map((int: number) => int.toString(16).padStart(2, '0')).join('');

        await set('wyrePrivateKey', wyrePrivateKey);
    }

    return await get('wyrePrivateKey');
}