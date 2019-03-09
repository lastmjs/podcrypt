export const firstProxy = 'https://cors-anywhere.herokuapp.com/';
export const backupProxy = 'https://jsonp.afeld.me/?url=';

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