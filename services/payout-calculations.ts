import { 
    Store,
    AnyAction
} from 'redux';
import {
    calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI,
    calculatePayoutAmountForPodcryptDuringCurrentIntervalInWEI
} from './podcast-calculations';
import { loadEthereumAccountBalance } from './balance-calculations';
import { get } from 'idb-keyval';
import { 
    wait,
    getRSSFeed,
    getSafeLowGasPriceInWEI
} from './utilities';
import BigNumber from "../node_modules/bignumber.js/bignumber";
import { parseEthereumAddressFromPodcastDescription } from './utilities';

export function getNextPayoutDateInMilliseconds(Store: Readonly<Store<Readonly<State>, AnyAction>>): Milliseconds {
    const previousPayoutDateInMilliseconds: Milliseconds | 'NEVER' = Store.getState().previousPayoutDateInMilliseconds;
    const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;
    const oneDayInSeconds: Seconds = '86400';
    const oneDayInMilliseconds: Milliseconds = new BigNumber(oneDayInSeconds).multipliedBy(1000).toString();
    const payoutIntervalInMilliseconds: Milliseconds = new BigNumber(oneDayInMilliseconds).multipliedBy(payoutIntervalInDays).toString();

    if (previousPayoutDateInMilliseconds === 'NEVER') {
        const nextPayoutDate: Date = new Date(new BigNumber(new Date().getTime()).plus(new BigNumber(payoutIntervalInMilliseconds)).toNumber());
        const nextPayoutDateRoundedToNearestStartOfDay: Date = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
        const nextPayoutDateInMilliseconds: Milliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime().toString();
        return nextPayoutDateInMilliseconds;
    }
    else {
        const nextPayoutDate: Date = new Date(new BigNumber(previousPayoutDateInMilliseconds).plus(new BigNumber(payoutIntervalInMilliseconds)).toNumber());
        const nextPayoutDateRoundedToNearestStartOfDay: Date = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
        const nextPayoutDateInMilliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime().toString();
        return nextPayoutDateInMilliseconds;   
    }
}

export function getPayoutTargetInETH(Store: Readonly<Store<Readonly<State>, AnyAction>>): string | 'Loading...' {
    const payoutTargetInETH: ETH = new BigNumber(Store.getState().payoutTargetInUSDCents).dividedBy(new BigNumber(Store.getState().currentETHPriceInUSDCents)).toString();
    return Store.getState().currentETHPriceInUSDCents === 'UNKNOWN' ? 'Loading...' : payoutTargetInETH;
}

export function getPayoutTargetInWEI(state: Readonly<State>): string | 'Loading...' {
    const payoutTargetInWEI: ETH = new BigNumber(state.payoutTargetInUSDCents).dividedBy(new BigNumber(state.currentETHPriceInUSDCents)).multipliedBy(1e18).toString();
    return state.currentETHPriceInUSDCents === 'UNKNOWN' ? 'Loading...' : payoutTargetInWEI;
}

export async function payout(Store: Readonly<Store<Readonly<State>, AnyAction>>, ethersProvider: any, retryDelayInMilliseconds: Milliseconds): Promise<void> {
        
    // TODO this is not being used for anything
    Store.dispatch({
        type: 'SET_PAYOUT_IN_PROGRESS',
        payoutInProgress: true
    });

    const podcasts: ReadonlyArray<Podcast> = Object.values(Store.getState().podcasts);

    // TODO if there is a failure with one transaction, we want to keep going with the other transactions
    // TODO we want the previous payment sent even if some transactions fail...or do we?
    // TODO we should probably set the previous transaction payment sent field on podcasts in particular?
    for (let i=0; i < podcasts.length; i++) {
        try {
            const podcast: Podcast = podcasts[i];

            const feed = await getRSSFeed(podcast.feedUrl);

            if (!feed) {
                // TODO if this happens, we should somehow notify the user
                // TODO add error states and ui stuff for each podcast so the user knows the state of everything
                continue;
            }

            const podcastEthereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = parseEthereumAddressFromPodcastDescription(feed.description);
        
            Store.dispatch({
                type: 'SET_PODCAST_ETHEREUM_ADDRESS',
                feedUrl: podcast.feedUrl,
                ethereumAddress: podcastEthereumAddress
            });

            if (
                podcastEthereumAddress === 'NOT_FOUND' ||
                podcastEthereumAddress === 'MALFORMED'
            ) {
                continue;
            }

            const gasPriceInWEI: WEI = await getSafeLowGasPriceInWEI();
            const gasPriceInWEIBigNumber: BigNumber = new BigNumber(gasPriceInWEI);

            console.log('gasPriceInWEIBigNumber', gasPriceInWEIBigNumber.toString());
    
            const valueInWEI: WEI = new BigNumber(calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI(Store.getState(), podcast)).toFixed(0);
            const valueInWEIBigNumber: BigNumber = new BigNumber(valueInWEI);
            
            console.log('valueInWEIBigNumber', valueInWEIBigNumber.toString());
            
            const valueLessGasPriceInWEIBigNumber: BigNumber = valueInWEIBigNumber.minus(gasPriceInWEIBigNumber);
            
            console.log('valueLessGasPriceInWEIBigNumber', valueLessGasPriceInWEIBigNumber.toString());
            
            const netValueInWEIBigNumber: BigNumber = valueLessGasPriceInWEIBigNumber.gt(0) ? valueLessGasPriceInWEIBigNumber : new BigNumber(0);
    
            console.log('netValueInWEIBigNumber', netValueInWEIBigNumber.toString());
    
            if (netValueInWEIBigNumber.eq(0)) {
                continue;
            }

            const wallet = new ethers.Wallet(await get('ethereumPrivateKey'), ethersProvider);
            
            console.log('getting transaction count')
            
            const nonce = await ethersProvider.getTransactionCount(wallet.address);
    
            console.log('nonce', nonce);

            const dataUTF8Bytes = ethers.utils.toUtf8Bytes('podcrypt.app');
            const data: string = ethers.utils.hexlify(dataUTF8Bytes);
            const dataLengthInBytes: number = ethers.utils.hexDataLength(data);
            const gasLimit: number = 21000 + (68 * dataLengthInBytes);

            console.log('data', data);
            console.log('dataLengthInBytes', dataLengthInBytes);
            console.log('gasLimit', gasLimit);

            const preparedTransaction = {
                to: podcastEthereumAddress,
                gasLimit,
                gasPrice: ethers.utils.bigNumberify(gasPriceInWEIBigNumber.toString()),
                value: ethers.utils.bigNumberify(netValueInWEIBigNumber.toString()),
                nonce,
                data
            };
    
            console.log('preparedTransaction', preparedTransaction);
    
            console.log('signing and sending transaction');
    
            const transaction = await wallet.sendTransaction(preparedTransaction);
    
            console.log(`transaction ${transaction.hash} sent`);

            // TODO this isn't working for some reason, check these issues out:
            // TODO https://github.com/ethers-io/ethers.js/issues/346
            // TODO https://github.com/ethers-io/ethers.js/issues/451
            // TODO once those issues are resolved, get rid of the wait below
            // const receipt = await ethersProvider.waitForTransaction(transaction.hash);

            // console.log(`Transaction ${receipt.hash} mined`);
    
            Store.dispatch({
                type: 'SET_PODCAST_LATEST_TRANSACTION_HASH',
                feedUrl: podcast.feedUrl,
                latestTransactionHash: transaction.hash
                // latestTransactionHash: receipt.hash
            });
    
            Store.dispatch({
                type: 'SET_PODCAST_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS',
                feedUrl: podcast.feedUrl,
                previousPayoutDateInMilliseconds: new Date().getTime()
            });

            // TODO I'll just let the retry mechanism kick in to wait long enough to get the nonce
            // await wait(30000);
        }
        catch(error) {
            console.log('podcast payout error', error);
            console.log(`retrying in ${new BigNumber(retryDelayInMilliseconds).multipliedBy(2)}`);
            await wait(new BigNumber(retryDelayInMilliseconds).multipliedBy(2).toNumber());
            payout(Store, ethersProvider, new BigNumber(retryDelayInMilliseconds).multipliedBy(2).toFixed(0));
            return;
        }
    }

    try {
        const gasPriceInWEI: WEI = await getSafeLowGasPriceInWEI();
        const gasPriceInWEIBigNumber: BigNumber = new BigNumber(gasPriceInWEI);    

        console.log('gasPriceInWEIBigNumber', gasPriceInWEIBigNumber.toString());

        const valueInWEI: WEI = new BigNumber(calculatePayoutAmountForPodcryptDuringCurrentIntervalInWEI(Store.getState())).toFixed(0);
        const valueInWEIBigNumber: BigNumber = new BigNumber(valueInWEI);

        console.log('valueInWEIBigNumber', valueInWEIBigNumber.toString());
        
        const valueLessGasPriceInWEIBigNumber = valueInWEIBigNumber.minus(gasPriceInWEIBigNumber);
        
        console.log('valueLessGasPriceInWEIBigNumber', valueLessGasPriceInWEIBigNumber.toString());
        
        const netValueInWEIBigNumber: BigNumber = valueLessGasPriceInWEIBigNumber.gt(0) ? valueLessGasPriceInWEIBigNumber : new BigNumber(0);

        console.log('netValueInWEIBigNumber', netValueInWEIBigNumber.toString());

        if (!netValueInWEIBigNumber.eq(0)) {
            const wallet = new ethers.Wallet(await get('ethereumPrivateKey'), ethersProvider);
        
            console.log('getting transaction count')
            
            const nonce = await ethersProvider.getTransactionCount(wallet.address);
    
            console.log('nonce', nonce);
    
            const dataUTF8Bytes = ethers.utils.toUtf8Bytes('podcrypt.app');
            const data: string = ethers.utils.hexlify(dataUTF8Bytes);
            const dataLengthInBytes: number = ethers.utils.hexDataLength(data);
            const gasLimit: number = 21000 + (68 * dataLengthInBytes);

            console.log('data', data);
            console.log('dataLengthInBytes', dataLengthInBytes);
            console.log('gasLimit', gasLimit);

            const preparedTransaction = {
                to: Store.getState().podcryptEthereumAddress,
                gasLimit,
                gasPrice: ethers.utils.bigNumberify(gasPriceInWEIBigNumber.toString()),
                value: ethers.utils.bigNumberify(netValueInWEIBigNumber.toString()),
                nonce,
                data
            };
    
            console.log('preparedTransaction', preparedTransaction);
    
            console.log('signing and sending transaction');
    
            const transaction = await wallet.sendTransaction(preparedTransaction);
    
            console.log(`transaction ${transaction.hash} sent`);
    
            // TODO this isn't working for some reason, check these issues out:
            // TODO https://github.com/ethers-io/ethers.js/issues/346
            // TODO https://github.com/ethers-io/ethers.js/issues/451
            // TODO once those issues are resolved, get rid of the wait below
            // const receipt = await ethersProvider.waitForTransaction(transaction.hash);
    
            // console.log(`Transaction ${receipt.hash} mined`);
    
            Store.dispatch({
                type: 'SET_PODCRYPT_LATEST_TRANSACTION_HASH',
                podcryptLatestTransactionHash: transaction.hash
            });
    
            Store.dispatch({
                type: 'SET_PODCRYPT_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS',
                podcryptPreviousPayoutDateInMilliseconds: new Date().getTime()
            });
        }
    }
    catch(error) {
        console.log('podcrypt payout error', error);
        console.log(`retrying in ${new BigNumber(retryDelayInMilliseconds).multipliedBy(2)}`);
        await wait(new BigNumber(retryDelayInMilliseconds).multipliedBy(2).toNumber());
        payout(Store, ethersProvider, new BigNumber(retryDelayInMilliseconds).multipliedBy(2).toFixed(0));
        return;
    }

    Store.dispatch({
        type: 'SET_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS',
        previousPayoutDateInMilliseconds: new Date().getTime()
    });

    const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds(Store);

    Store.dispatch({
        type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
        nextPayoutDateInMilliseconds
    });

    await loadEthereumAccountBalance(Store, ethersProvider);

    // TODO this is not being used for anything
    Store.dispatch({
        type: 'SET_PAYOUT_IN_PROGRESS',
        payoutInProgress: false
    });
}