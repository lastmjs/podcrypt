import { 
    Store,
    AnyAction
} from 'redux';
import { set } from 'idb-keyval';
import { getNextPayoutDateInMilliseconds } from './payout-calculations';
import {
    cryptonatorAPIEndpoint,
    etherscanAPIEndpoint
} from './utilities';
import BigNumber from "../node_modules/bignumber.js/bignumber";

export async function createWallet(Store: Readonly<Store<Readonly<State>, AnyAction>>, ethersProvider: any): Promise<void> {
    Store.dispatch({
        type: 'SET_WALLET_CREATION_STATE',
        walletCreationState: 'CREATING'
    });

    // TODO we might want some backup nodes
    const newWallet = ethers.Wallet.createRandom();

    // TODO we will probably need some more hardcore security than this
    await set('ethereumPrivateKey', newWallet.privateKey);

    Store.dispatch({
        type: 'SET_ETHEREUM_ADDRESS',
        ethereumAddress: newWallet.address
    });

    Store.dispatch({
        type: 'SET_WALLET_CREATION_STATE',
        walletCreationState: 'CREATED'
    });

    await loadEthereumAccountBalance(Store, ethersProvider);

    const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds(Store);

    Store.dispatch({
        type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
        nextPayoutDateInMilliseconds
    });
}

export function getBalanceInUSD(Store: Readonly<Store<Readonly<State>, AnyAction>>): 'unknown' | 'Loading...' | string {
    const currentETHPriceState: CurrentETHPriceState = Store.getState().currentETHPriceState;

    if (currentETHPriceState === 'NOT_FETCHED') {
        return 'unknown';
    }

    if (currentETHPriceState === 'FETCHING') {
        return 'Loading...';
    }

    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = Store.getState().currentETHPriceInUSDCents;

    if (
        currentETHPriceState === 'FETCHED' &&
        currentETHPriceInUSDCents === 'UNKNOWN'
    ) {
        return 'unknown';
    }

    if (
        currentETHPriceState === 'FETCHED' &&
        currentETHPriceInUSDCents !== 'UNKNOWN'
    ) {
        return new BigNumber(Store.getState().ethereumBalanceInWEI)
                .multipliedBy(Store.getState().currentETHPriceInUSDCents)
                .dividedBy(new BigNumber(1e20)).toString(); // TODO can 1e20 be reliably converted to a bignumber?
    }

    return 'unknown';
}

export function getBalanceInETH(Store: Readonly<Store<Readonly<State>, AnyAction>>): ETH {
    return new BigNumber(Store.getState().ethereumBalanceInWEI).dividedBy(new BigNumber(1e18)).toString();
}

export async function loadEthereumAccountBalance(Store: Readonly<Store<Readonly<State>, AnyAction>>, ethersProvider: any): Promise<void> {
    const ethereumAddress: EthereumAddress | 'NOT_CREATED' = Store.getState().ethereumAddress;

    if (ethereumAddress === 'NOT_CREATED') {
        return;
    }

    const ethereumBalanceInWEI: WEI = (await ethersProvider.getBalance(ethereumAddress)).toString();

    Store.dispatch({
        type: 'SET_ETHEREUM_BALANCE_IN_WEI',
        ethereumBalanceInWEI
    });
}

export async function loadCurrentETHPriceInUSDCents(Store: Readonly<Store<Readonly<State>, AnyAction>>): Promise<void> {
    Store.dispatch({
        type: 'SET_CURRENT_ETH_PRICE_STATE',
        currentETHPriceState: 'FETCHING'
    });

    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = new BigNumber(await getCurrentETHPriceInUSDCents()).toString();

    Store.dispatch({
        type: 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS',
        currentETHPriceInUSDCents
    });

    Store.dispatch({
        type: 'SET_CURRENT_ETH_PRICE_STATE',
        currentETHPriceState: 'FETCHED'
    });
}

export async function getCurrentETHPriceInUSDCents(attemptNumber: number = 0): Promise<USDCents | 'UNKNOWN'> {
    // TODO do not use this api until reviewing and complying with the terms
    // TODO If we want a third backup, we could use this
    // window.fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH').then((result) => result.json()).then((result) => console.log(result))
    try {
        if (attemptNumber === 0) {
            return await getCryptonatorCurrentETHPriceInUSDCents();
        }

        if (attemptNumber === 1) {
            return await getEtherscanCurrentETHPriceInUSDCents();
        }

        return 'UNKNOWN';
    }
    catch(error) {
        console.log('getCurrentETHPriceInUSDCents error', error);
        return await getCurrentETHPriceInUSDCents(attemptNumber + 1);
    }
}

async function getCryptonatorCurrentETHPriceInUSDCents(): Promise<USDCents> {
    const ethPriceJSON: any = await getCurrentETHPriceJSON(cryptonatorAPIEndpoint);
    const currentETHPriceInUSD: USDollars = ethPriceJSON.ticker.price;
    const currentETHPriceInUSDCents: USDCents = new BigNumber(currentETHPriceInUSD).multipliedBy(100).toString();    
    return currentETHPriceInUSDCents;
}

async function getEtherscanCurrentETHPriceInUSDCents(): Promise<USDCents> {
    const ethPriceJSON: any = await getCurrentETHPriceJSON(etherscanAPIEndpoint);
    const currentETHPriceInUSD: USDollars = ethPriceJSON.result.ethusd;
    const currentETHPriceInUSDCents: USDCents = new BigNumber(currentETHPriceInUSD).multipliedBy(100).toString();
    return currentETHPriceInUSDCents;
}

async function getCurrentETHPriceJSON(apiEndpoint: CryptonatorETHPriceAPIEndpoint | EtherscanETHPriceAPIEndpoint) {
    const ethPriceResponse: Readonly<Response> = await window.fetch(apiEndpoint);
    const ethPriceJSON: any = await ethPriceResponse.json();
    return ethPriceJSON;
}