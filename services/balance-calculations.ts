import { 
    Store,
    AnyAction
} from 'redux';
import { set } from 'idb-keyval';
import { getNextPayoutDateInMilliseconds } from './payout-calculations';

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
        const ethereumBalanceInETH: ETH = Store.getState().ethereumBalanceInWEI / 1e18;
        return ((ethereumBalanceInETH * currentETHPriceInUSDCents) / 100).toFixed(2);
    }

    return 'unknown';
}

export function getBalanceInETH(Store: Readonly<Store<Readonly<State>, AnyAction>>) {
    return Store.getState().ethereumBalanceInWEI / 1e18;
}

export async function loadEthereumAccountBalance(Store: Readonly<Store<Readonly<State>, AnyAction>>, ethersProvider: any): Promise<void> {
    const ethereumAddress: EthereumPublicKey | 'NOT_CREATED' = Store.getState().ethereumAddress;

    if (ethereumAddress === 'NOT_CREATED') {
        return;
    }

    const ethereumBalanceInWEI: WEI = parseFloat(await ethersProvider.getBalance(ethereumAddress));

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

    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = await getCurrentETHPriceInUSDCents();

    Store.dispatch({
        type: 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS',
        currentETHPriceInUSDCents
    });

    Store.dispatch({
        type: 'SET_CURRENT_ETH_PRICE_STATE',
        currentETHPriceState: 'FETCHED'
    });
}

export async function getCurrentETHPriceInUSDCents(): Promise<number | 'UNKNOWN'> {
    // TODO do not use this api until reviewing and complying with the terms
    // window.fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH').then((result) => result.json()).then((result) => console.log(result))

    // etherscan would probably be good to use as a backup for price: https://api.etherscan.io/api?module=stats&action=ethprice

    // TODO use the backup requeset system here...perhaps create a backup request system
    try {
        const ethPriceResponse: Readonly<Response> = await window.fetch(`https://api.cryptonator.com/api/ticker/eth-usd`);
        const ethPriceJSON = await ethPriceResponse.json();
        const currentETHPriceInUSD: number = ethPriceJSON.ticker.price;
        const currentETHPriceInUSDCents: number = Math.round(currentETHPriceInUSD * 100);
        return currentETHPriceInUSDCents;    
    }
    catch(error) {
        return 'UNKNOWN';
    }
}