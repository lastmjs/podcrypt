import { 
    Store
} from 'redux';
import {
    calculatePayoutAmountForPodcastDuringIntervalInWEI,
    calculatePayoutAmountForPodcryptDuringIntervalInWEI
} from './podcast-calculations';
import { 
    loadEthereumAccountBalance,
    loadCurrentETHPriceInUSDCents
 } from './balance-calculations';
import { get } from 'idb-keyval';
import { 
    wait,
    getRSSFeed,
    getSafeLowGasPriceInWEI
} from './utilities';
import BigNumber from "../node_modules/bignumber.js/bignumber";
import { getEthereumAddressFromPodcastDescription } from './utilities';
import '../node_modules/ethers/dist/ethers.min.js';
import { ethersProvider } from './ethers-provider';

export function getNextPayoutDate(state: Readonly<State>): Milliseconds {
    const previousPayoutDate: Milliseconds | 'NEVER' = state.previousPayoutDate;
    const payoutIntervalInDays: Days = state.payoutIntervalInDays;
    const oneDayInSeconds: Seconds = 86400;
    const oneDayInMilliseconds: Milliseconds = oneDayInSeconds * 1000;
    const payoutIntervalInMilliseconds: Milliseconds = oneDayInMilliseconds * payoutIntervalInDays;

    if (previousPayoutDate === 'NEVER') {
        const nextPayoutDate: Date = new Date(new Date().getTime() + payoutIntervalInMilliseconds);
        const nextPayoutDateRoundedToNearestStartOfDay: Date = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
        const nextPayoutDateInMilliseconds: Milliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime();
        return nextPayoutDateInMilliseconds;
    }
    else {
        const nextPayoutDate: Date = new Date(previousPayoutDate + payoutIntervalInMilliseconds);
        const nextPayoutDateRoundedToNearestStartOfDay: Date = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
        const nextPayoutDateInMilliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime();
        return nextPayoutDateInMilliseconds;   
    }
}

export function getPayoutTargetInETH(Store: Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>): string | 'Loading...' {
    const payoutTargetInETH: ETH = new BigNumber(Store.getState().payoutTargetInUSDCents).dividedBy(new BigNumber(Store.getState().currentETHPriceInUSDCents)).toString();
    return Store.getState().currentETHPriceInUSDCents === 'UNKNOWN' ? 'Loading...' : payoutTargetInETH;
}

export function getPayoutTargetInWEI(state: Readonly<State>): string | 'Loading...' {
    const payoutTargetInWEI: ETH = new BigNumber(state.payoutTargetInUSDCents).dividedBy(new BigNumber(state.currentETHPriceInUSDCents)).multipliedBy(1e18).toString();
    return state.currentETHPriceInUSDCents === 'UNKNOWN' ? 'Loading...' : payoutTargetInWEI;
}

export async function payout(Store: Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>, retryDelayInMilliseconds: Milliseconds): Promise<void> {
        
    await loadCurrentETHPriceInUSDCents(Store);
    await loadEthereumAccountBalance(Store);

    if (Store.getState().payoutProblem !== 'NO_PROBLEM') {
        return;
    }

    Store.dispatch({
        type: 'SET_PAYOUT_IN_PROGRESS',
        payoutInProgress: true
    });

    if (Store.getState().currentETHPriceInUSDCents === 'UNKNOWN') {
        const newRetryDelayInMilliseconds: number = retryDelayInMilliseconds * 2;
        await wait(newRetryDelayInMilliseconds);
        await payout(Store, newRetryDelayInMilliseconds);
        return;
    }

    const podcasts: ReadonlyArray<Podcast> = Object.values(Store.getState().podcasts);

    for (let i=0; i < podcasts.length; i++) {
        const podcast: Readonly<Podcast> = podcasts[i];

        if (podcast.paymentsEnabled === false) {
            Store.dispatch({
                type: 'RESET_PODCAST_TIME_LISTENED_SINCE_PREVIOUS_PAYOUT',
                feedUrl: podcast.feedUrl
            });

            continue;
        }

        const podcastTransactionResult = await payPodcast(Store, podcast, retryDelayInMilliseconds);

        Store.dispatch({
            type: 'RESET_PODCAST_TIME_LISTENED_SINCE_PREVIOUS_PAYOUT',
            feedUrl: podcast.feedUrl
        });

        if (
            // TODO I think we should distinguish ALREADY_PAID_FOR_INTERVAL and nothing to pay for interval. Right now these two return types are indistinguishable
            podcastTransactionResult === 'ALREADY_PAID_FOR_INTERVAL' ||
            podcastTransactionResult === 'FEED_NOT_FOUND' ||
            podcastTransactionResult === 'PODCAST_ETHEREUM_ADDRESS_MALFORMED' ||
            podcastTransactionResult === 'PODCAST_ETHEREUM_ADDRESS_NOT_FOUND'
        ) {
            continue;
        }

        Store.dispatch({
            type: 'SET_PODCAST_LATEST_TRANSACTION_HASH',
            feedUrl: podcast.feedUrl,
            latestTransactionHash: podcastTransactionResult.hash
        });

        Store.dispatch({
            type: 'SET_PODCAST_PREVIOUS_PAYOUT_DATE',
            feedUrl: podcast.feedUrl,
            previousPayoutDate: new Date().getTime()
        });
    }

    const podcryptTransactionResult = await payPodcrypt(Store, Store.getState(), retryDelayInMilliseconds);

    if (
        podcryptTransactionResult !== 'ALREADY_PAID_FOR_INTERVAL' &&
        podcryptTransactionResult !== 'FEED_NOT_FOUND' &&
        podcryptTransactionResult !== 'PODCAST_ETHEREUM_ADDRESS_MALFORMED' &&
        podcryptTransactionResult !== 'PODCAST_ETHEREUM_ADDRESS_NOT_FOUND'
    ) {
        Store.dispatch({
            type: 'SET_PODCRYPT_LATEST_TRANSACTION_HASH',
            podcryptLatestTransactionHash: podcryptTransactionResult.hash
        });
    
        Store.dispatch({
            type: 'SET_PODCRYPT_PREVIOUS_PAYOUT_DATE',
            podcryptPreviousPayoutDate: new Date().getTime()
        });
    }

    Store.dispatch({
        type: 'SET_PREVIOUS_PAYOUT_DATE',
        previousPayoutDate: new Date().getTime()
    });

    const nextPayoutDate: Milliseconds = getNextPayoutDate(Store.getState());

    Store.dispatch({
        type: 'SET_NEXT_PAYOUT_DATE',
        nextPayoutDate
    });

    await loadEthereumAccountBalance(Store);

    Store.dispatch({
        type: 'SET_PAYOUT_IN_PROGRESS',
        payoutInProgress: false
    });
}

async function payPodcast(Store: Readonly<Store>, podcast: Readonly<Podcast>, retryDelayInMilliseconds: Milliseconds): Promise<TransactionResult> {
    try {
        const feed = await getRSSFeed(podcast.feedUrl);

        if (!feed) {
            // TODO if this happens, we should somehow notify the user
            // TODO add error states and ui stuff for each podcast so the user knows the state of everything
            return 'FEED_NOT_FOUND';
        }
    
        const podcastEthereumAddressInfo: Readonly<EthereumAddressInfo> = await getEthereumAddressFromPodcastDescription(feed.description);
        const podcastEthereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = podcastEthereumAddressInfo.ethereumAddress;
    
        Store.dispatch({
            type: 'SET_PODCAST_ETHEREUM_ADDRESS',
            feedUrl: podcast.feedUrl,
            ethereumAddress: podcastEthereumAddress
        });

        if (podcastEthereumAddress === 'NOT_FOUND') {
            return 'PODCAST_ETHEREUM_ADDRESS_NOT_FOUND'
        }
    
        if (podcastEthereumAddress === 'MALFORMED') {
            return 'PODCAST_ETHEREUM_ADDRESS_MALFORMED';
        }
    
        const to: EthereumAddress = podcastEthereumAddress;
                    
        const payoutInfoForPodcast: {
            readonly value: WEI;
            readonly gasPriceInWEI: WEI;
        } = await getPayoutInfoForPodcast(Store.getState(), podcast);
    
        const dataHex: HexString = hexlifyData('podcrypt.app');
        const gasLimit: number = await getGasLimit(dataHex, to, payoutInfoForPodcast.value);
    
        if (new BigNumber(payoutInfoForPodcast.value).lte(0)) {
            return 'ALREADY_PAID_FOR_INTERVAL';
        }
    
        return await sendTransaction(Store, to, payoutInfoForPodcast.value, gasLimit, payoutInfoForPodcast.gasPriceInWEI, dataHex);    
    }
    catch(error) {
        const newRetryDelayInMilliseconds: number = new BigNumber(retryDelayInMilliseconds).multipliedBy(2).toNumber();
        await wait(newRetryDelayInMilliseconds);
        return await payPodcast(Store, podcast, newRetryDelayInMilliseconds); 
    }    
}

export async function getPayoutInfoForPodcast(state: Readonly<State>, podcast: Readonly<Podcast>): Promise<{
    readonly value: WEI;
    readonly gasPriceInWEI: WEI;
}> {
    const gasPriceInWEI: WEI = await getSafeLowGasPriceInWEI();    
    const previousPayoutDate: Milliseconds | 'NEVER' = podcast.previousPayoutDate !== 'NEVER' && state.previousPayoutDate !== 'NEVER' && podcast.previousPayoutDate > state.previousPayoutDate ? podcast.previousPayoutDate : state.previousPayoutDate;
    const valueInWEI: WEI = new BigNumber(calculatePayoutAmountForPodcastDuringIntervalInWEI(state, podcast, previousPayoutDate)).toFixed(0);
    const valueLessGasPriceInWEI: BigNumber = new BigNumber(valueInWEI).minus(gasPriceInWEI);
    const netValueInWEI: BigNumber = valueLessGasPriceInWEI.gt(0) ? valueLessGasPriceInWEI : new BigNumber(0);

    return {
        value: netValueInWEI.toFixed(0),
        gasPriceInWEI
    };
}

async function payPodcrypt(Store: Readonly<Store>, state: Readonly<State>, retryDelayInMilliseconds: Milliseconds): Promise<TransactionResult> {
    try {
        const to: EthereumAddress = state.podcryptEthereumAddress;
        
        const payoutInfoForPodcrypt: {
            readonly value: WEI;
            readonly gasPriceInWEI: WEI;
        } = await getPayoutInfoForPodcrypt(state);
    
        const dataHex: HexString = hexlifyData('podcrypt.app');
        const gasLimit: number = await getGasLimit(dataHex, to, payoutInfoForPodcrypt.value);
    
        if (new BigNumber(payoutInfoForPodcrypt.value).lte(0)) {
            return 'ALREADY_PAID_FOR_INTERVAL';
        }
    
        return await sendTransaction(Store, to, payoutInfoForPodcrypt.value, gasLimit, payoutInfoForPodcrypt.gasPriceInWEI, dataHex);
    }
    catch(error) {
        const newRetryDelayInMilliseconds: number = new BigNumber(retryDelayInMilliseconds).multipliedBy(2).toNumber();
        await wait(newRetryDelayInMilliseconds);
        return await payPodcrypt(Store, state, newRetryDelayInMilliseconds); 
    }
}

export async function getPayoutInfoForPodcrypt(state: Readonly<State>): Promise<{
    readonly value: WEI;
    readonly gasPriceInWEI: WEI;
}> {
    const gasPriceInWEI: WEI = await getSafeLowGasPriceInWEI();    
    const valueInWEI: WEI = new BigNumber(calculatePayoutAmountForPodcryptDuringIntervalInWEI(state)).toFixed(0);
    const valueLessGasPriceInWEI: BigNumber = new BigNumber(valueInWEI).minus(gasPriceInWEI);
    const netValueInWEI: BigNumber = valueLessGasPriceInWEI.gt(0) ? valueLessGasPriceInWEI : new BigNumber(0);

    return {
        value: netValueInWEI.toFixed(0),
        gasPriceInWEI
    };
}

function hexlifyData(dataUTF8: UTF8String): HexString {
    const dataUTF8Bytes = ethers.utils.toUtf8Bytes(dataUTF8);
    const dataHex: HexString = ethers.utils.hexlify(dataUTF8Bytes);

    return dataHex;
}

async function getGasLimit(dataHex: HexString, to: EthereumAddress, value: WEI): Promise<number> {
    return await ethersProvider.estimateGas({
        to,
        value,
        data: dataHex
    });
}

async function sendTransaction(Store: Readonly<Store>, to: EthereumAddress, value: WEI, gasLimit: number, gasPrice: WEI, data: HexString) {
    const wallet = new ethers.Wallet(await get('ethereumPrivateKey'), ethersProvider);
    
    const nonceFromNetwork: number = await ethersProvider.getTransactionCount(wallet.address);
    const nonceFromState: number = Store.getState().nonce;
    
    if (nonceFromState > nonceFromNetwork) {
        Store.dispatch({
            type: 'SET_NONCE',
            nonce: nonceFromState
        });
    }
    else {
        Store.dispatch({
            type: 'SET_NONCE',
            nonce: nonceFromNetwork
        });
    }

    const nonce = Store.getState().nonce;

    const newNonce = nonce + 1;

    Store.dispatch({
        type: 'SET_NONCE',
        nonce: newNonce
    });

    const preparedTransaction = {
        to,
        value: ethers.utils.bigNumberify(value),
        gasLimit,
        gasPrice: ethers.utils.bigNumberify(gasPrice),
        nonce,
        data
    };

    console.log('preparedTransaction', preparedTransaction);
    
    const transaction = await wallet.sendTransaction(preparedTransaction);

    console.log('transaction', transaction);

    return transaction;
}