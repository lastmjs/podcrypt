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

// TODO I have removed most of the retry stuff...put it back in
// TODO Why not persist the latest EthereumTransactionData in the redux store, then if anything happens the payout process continues from there?
export async function payout(
    Store: Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>,
    retryDelayInMilliseconds: Milliseconds
): Promise<void> {
        
    await loadCurrentETHPriceInUSDCents(Store);
    await loadEthereumAccountBalance(Store);

    if (Store.getState().payoutProblem !== 'NO_PROBLEM') {
        // TODO should we not tell the user about this?
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

    const podcastEthereumTransactionData: ReadonlyArray<EthereumTransactionDatum> = await getPodcastEthereumTransactionData(Store);
    const podcryptEthereumTransactionDatumResult: Readonly<EthereumTransactionDatum> | 'ALREADY_PAID_FOR_INTERVAL' | 'NET_VALUE_TOO_SMALL' = await getPodcryptEthereumTransactionDatum(Store.getState());

    console.log('podcastEthereumTransactionData', podcastEthereumTransactionData);
    console.log('podcryptEthereumTransactionDatumResult', podcryptEthereumTransactionDatumResult);

    for (let i=0; i < podcastEthereumTransactionData.length; i++) {
        const podcastEthereumTransactionDatum: Readonly<EthereumTransactionDatum> = podcastEthereumTransactionData[i];

        const podcastTransaction = await prepareAndSendTransaction(Store, podcastEthereumTransactionDatum);

        console.log('podcastTransaction', podcastTransaction);

        Store.dispatch({
            type: 'SET_PODCAST_PREVIOUS_PAYOUT_DATE',
            feedUrl: podcastEthereumTransactionDatum.id,
            previousPayoutDate: new Date().getTime()
        });

        Store.dispatch({
            type: 'SET_PODCAST_LATEST_TRANSACTION_HASH',
            feedUrl: podcastEthereumTransactionDatum.id,
            latestTransactionHash: podcastTransaction.hash
        });

        Store.dispatch({
            type: 'RESET_PODCAST_TIME_LISTENED_SINCE_PREVIOUS_PAYOUT',
            feedUrl: podcastEthereumTransactionDatum.id
        });
    }

    if (
        podcryptEthereumTransactionDatumResult !== 'ALREADY_PAID_FOR_INTERVAL' &&
        podcryptEthereumTransactionDatumResult !== 'NET_VALUE_TOO_SMALL'
    ) {
        const podcryptTransaction = await prepareAndSendTransaction(Store, podcryptEthereumTransactionDatumResult);
    
        console.log('podcryptTransaction', podcryptTransaction);

        Store.dispatch({
            type: 'SET_PODCRYPT_PREVIOUS_PAYOUT_DATE',
            podcryptPreviousPayoutDate: new Date().getTime()
        });

        Store.dispatch({
            type: 'SET_PODCRYPT_LATEST_TRANSACTION_HASH',
            podcryptLatestTransactionHash: podcryptTransaction.hash
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

    await loadCurrentETHPriceInUSDCents(Store);
    await loadEthereumAccountBalance(Store);

    Store.dispatch({
        type: 'SET_PAYOUT_IN_PROGRESS',
        payoutInProgress: false
    });
}

// TODO it would be best to not pass the store into here...just make sure any store dispatches happen before here
async function getPodcastEthereumTransactionData(Store: Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>): Promise<ReadonlyArray<EthereumTransactionDatum>> {
    const podcasts: ReadonlyArray<Podcast> = Object.values(Store.getState().podcasts);

    const podcastEthereumTransactionData: ReadonlyArray<EthereumTransactionDatum> = await podcasts
        .reduce(async (result: Promise<ReadonlyArray<EthereumTransactionDatum>>, podcast: Readonly<Podcast>) => {

            if (podcast.paymentsEnabled === false) {
                return result;
            }

            if (
                podcast.previousPayoutDate !== 'NEVER' &&
                podcast.previousPayoutDate > Store.getState().nextPayoutDate
            ) {
                return result;
            }

            const feed = await getRSSFeed(podcast.feedUrl);

            if (!feed) {
                // TODO if this happens, we should somehow notify the user
                // TODO add error states and ui stuff for each podcast so the user knows the state of everything
                return result;
            }

            const podcastEthereumAddressInfo: Readonly<EthereumAddressInfo> = await getEthereumAddressFromPodcastDescription(feed.description);
            const podcastEthereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = podcastEthereumAddressInfo.ethereumAddress;
        
            Store.dispatch({
                type: 'SET_PODCAST_ETHEREUM_ADDRESS',
                feedUrl: podcast.feedUrl,
                ethereumAddress: podcastEthereumAddress
            });
    
            if (podcastEthereumAddress === 'NOT_FOUND') {
                // TODO if this happens, we should somehow notify the user
                // TODO add error states and ui stuff for each podcast so the user knows the state of everything
                // return 'PODCAST_ETHEREUM_ADDRESS_NOT_FOUND'
                return result;
            }
        
            if (podcastEthereumAddress === 'MALFORMED') {
                // TODO if this happens, we should somehow notify the user
                // TODO add error states and ui stuff for each podcast so the user knows the state of everything
                // return 'PODCAST_ETHEREUM_ADDRESS_MALFORMED';
                return result;
            }    

            const to: EthereumAddress = podcastEthereumAddress;
            const dataHex: HexString = hexlifyData('podcrypt.app');
            const grossValue: WEI = await getGrossPayoutForPodcastInWEI(Store.getState(), podcast);    
            const gasLimit: number = await getGasLimit(dataHex, to, grossValue);
            const gasPrice: WEI = await getSafeLowGasPriceInWEI();
            const netValue: WEI = new BigNumber(grossValue).minus(new BigNumber(gasPrice).multipliedBy(gasLimit)).toFixed(0);

            if (new BigNumber(netValue).lte(0)) {
                return result;
            }

            const ethereumTransactionDatum: Readonly<EthereumTransactionDatum> = {
                id: podcast.feedUrl,
                to,
                value: netValue,
                data: dataHex,
                gasLimit,
                gasPrice
            };

            const resolvedResult: ReadonlyArray<EthereumTransactionDatum> = await result;

            return [...resolvedResult, ethereumTransactionDatum];
        }, Promise.resolve([]));

    return podcastEthereumTransactionData;
}

async function getPodcryptEthereumTransactionDatum(state: Readonly<State>): Promise<Readonly<EthereumTransactionDatum> | 'ALREADY_PAID_FOR_INTERVAL' | 'NET_VALUE_TOO_SMALL'> {
    if (state.podcryptPreviousPayoutDate > state.nextPayoutDate) {
        return 'ALREADY_PAID_FOR_INTERVAL';
    }

    const to: EthereumAddress = state.podcryptEthereumAddress;
    const dataHex: HexString = hexlifyData('podcrypt.app');
    const grossValue: WEI = await getGrossPayoutForPodcryptInWEI(state);    
    const gasLimit: number = await getGasLimit(dataHex, to, grossValue);
    const gasPrice: WEI = await getSafeLowGasPriceInWEI();
    const netValue: WEI = new BigNumber(grossValue).minus(new BigNumber(gasPrice).multipliedBy(gasLimit)).toFixed(0);

    if (new BigNumber(netValue).lte(0)) {
        return 'NET_VALUE_TOO_SMALL';
    }

    const ethereumTransactionDatum: Readonly<EthereumTransactionDatum> = {
        id: 'podcrypt',
        to,
        value: netValue,
        data: dataHex,
        gasLimit,
        gasPrice
    };

    return ethereumTransactionDatum;
}

async function prepareAndSendTransaction(
    Store: Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>,
    transactionDatum: Readonly<EthereumTransactionDatum>
) {
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

    const preparedTransaction: Readonly<EthereumTransaction> = {
        to: transactionDatum.to,
        value: ethers.utils.bigNumberify(transactionDatum.value),
        gasLimit: transactionDatum.gasLimit,
        gasPrice: ethers.utils.bigNumberify(transactionDatum.gasPrice),
        nonce,
        data: transactionDatum.data
    };

    console.log('preparedTransaction', preparedTransaction);
    
    const transaction = await wallet.sendTransaction(preparedTransaction);

    console.log('transaction', transaction);

    return transaction;
}

export async function getGrossPayoutForPodcastInWEI(state: Readonly<State>, podcast: Readonly<Podcast>): Promise<WEI> {
    const previousPayoutDate: Milliseconds | 'NEVER' = podcast.previousPayoutDate !== 'NEVER' && state.previousPayoutDate !== 'NEVER' && podcast.previousPayoutDate > state.previousPayoutDate ? podcast.previousPayoutDate : state.previousPayoutDate;
    const grossValueInWEI: WEI = new BigNumber(calculatePayoutAmountForPodcastDuringIntervalInWEI(state, podcast, previousPayoutDate)).toFixed(0);
    return grossValueInWEI;
}

export async function getGrossPayoutForPodcryptInWEI(state: Readonly<State>): Promise<WEI> {
    const grossValueInWEI: WEI = new BigNumber(calculatePayoutAmountForPodcryptDuringIntervalInWEI(state)).toFixed(0);
    return grossValueInWEI;
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