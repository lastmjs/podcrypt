export const firstProxy = 'https://cors-anywhere.herokuapp.com/';
export const backupProxy = 'https://jsonp.afeld.me/?url=';

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

export async function getRSSFeed(feedUrl: string, corsProxy: string): Promise<any | null> {
    try {
        const feedResponse = await window.fetch(`${corsProxy}${feedUrl}`);
        const feedRaw = await feedResponse.text();
        const feed = await new RSSParser().parseString(feedRaw);
        return feed;
    }
    catch(error) {
        if (corsProxy !== backupProxy) {
            return await getRSSFeed(feedUrl, backupProxy);
        }

        return null;
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

    const ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = parseEthereumAddressFromPodcastDescription(theFeed.description);
    const email: string | 'NOT_SET' = theFeed.itunes ? theFeed.itunes.owner ? theFeed.itunes.owner.email ? theFeed.itunes.owner.email : 'NOT_SET' : 'NOT_SET' : 'NOT_SET';

    const podcast: Readonly<Podcast> = {
        feedUrl: feedUrl, // TODO check if this works
        title: theFeed.title,
        description: theFeed.description,
        imageUrl: theFeed.image ? theFeed.image.url : 'NOT_FOUND',
        episodeGuids: [],
        previousPayoutDateInMilliseconds: 'NEVER',
        latestTransactionHash: null,
        ethereumAddress,
        email
    };

    return podcast;
}

async function getFeed(feedUrl: string, feed?: any): Promise<any | null> {
    try {
        if (feed) {
            return feed;
        }
        else {
            const feed = await getRSSFeed(feedUrl, firstProxy);                    
            return feed;
        }        
    }
    catch(error) {
        console.log('getFeed error', error);
        return null;
    }
}

export function parseEthereumAddressFromPodcastDescription(podcastDescription: string): EthereumAddress | 'NOT_FOUND' | 'MALFORMED' {
    try {
        // TODO I took the regex below straight from here: https://www.regextester.com/99711
        // TODO I am not sure if there are any copyright issues with using it, it seems pretty deminimus and obvious to me
        const matchInfo: RegExpMatchArray | null = podcastDescription.match(/0x[a-fA-F0-9]{40}/);
        const ethereumAddressFromPodcastDescription: EthereumAddress = matchInfo !== null ? matchInfo[0] : 'NOT_FOUND';
        
        console.log('ethereumAddressFromPodcastDescription', ethereumAddressFromPodcastDescription);
        
        if (ethereumAddressFromPodcastDescription === 'NOT_FOUND') {
            return 'NOT_FOUND';
        }
        
        const verifiedAddress = ethers.utils.getAddress(ethereumAddressFromPodcastDescription);
        
        console.log('verifiedAddress', verifiedAddress);
        
        return verifiedAddress;        
    }
    catch(error) {
        console.log(error);
        return 'MALFORMED';
    }
}