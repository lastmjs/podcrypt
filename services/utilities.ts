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

export async function getCurrentETHPriceInUSD(): Promise<string | 'UNKNOWN'> {
    // TODO do not use this api until reviewing and complying with the terms
    // window.fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH').then((result) => result.json()).then((result) => console.log(result))

    // TODO use the backup requeset system here...perhaps create a backup request system
    try {
        const ethPriceResponse = await window.fetch(`https://api.cryptonator.com/api/ticker/eth-usd`);
        const ethPriceJSON = await ethPriceResponse.json();
        const currentETHPriceInUSD = ethPriceJSON.ticker.price;
        return currentETHPriceInUSD;    
    }
    catch(error) {
        return 'UNKNOWN';
    }
}