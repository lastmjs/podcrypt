import { 
    Store,
    AnyAction
} from 'redux';
import { calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI } from './podcast-calculations';
import { loadEthereumAccountBalance } from './balance-calculations';
import { get } from 'idb-keyval';
import WEB3 from 'web3/types/index';

export function getNextPayoutDateInMilliseconds(Store: Readonly<Store<Readonly<State>, AnyAction>>): Milliseconds {
    const previousPayoutDateInMilliseconds: Milliseconds | 'NEVER' = Store.getState().previousPayoutDateInMilliseconds;
    const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;
    const oneDayInSeconds: Seconds = 86400;
    const oneDayInMilliseconds: Milliseconds = oneDayInSeconds * 1000;
    const payoutIntervalInMilliseconds: Milliseconds = oneDayInMilliseconds * payoutIntervalInDays;

    if (previousPayoutDateInMilliseconds === 'NEVER') {
        const nextPayoutDate: Date = new Date(new Date().getTime() + payoutIntervalInMilliseconds);
        const nextPayoutDateRoundedToNearestStartOfDay: Date = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
        const nextPayoutDateInMilliseconds: Milliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime();
        return nextPayoutDateInMilliseconds;
    }
    else {
        const nextPayoutDate: Date = new Date(previousPayoutDateInMilliseconds + payoutIntervalInMilliseconds);
        const nextPayoutDateRoundedToNearestStartOfDay: Date = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
        const nextPayoutDateInMilliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime();
        return nextPayoutDateInMilliseconds;   
    }
}

function parseEthereumAddressFromPodcastDescription(podcastDescription: string): string {
    const testPodcastAccount = '0x81C0bf46ED56216E3f9f0864B46C099B8A3315B3';
    return testPodcastAccount;
}

export function getPayoutTargetInETH(Store: Readonly<Store<Readonly<State>, AnyAction>>): ETH | 'Loading...' {
    return Store.getState().currentETHPriceInUSDCents === 'UNKNOWN' ? 'Loading...' : Store.getState().payoutTargetInUSDCents / (Store.getState().currentETHPriceInUSDCents as number);
}

export async function payout(Store: Readonly<Store<Readonly<State>, AnyAction>>, web3: WEB3): Promise<void> {
        
    const podcasts: ReadonlyArray<Podcast> = Object.values(Store.getState().podcasts);

    // TODO if there is a failure with one transaction, we want to keep going with the other transactions
    // TODO we want the previous payment sent even if some transactions fail...or do we?
    // TODO we should probably set the previous transaction payment sent field on podcasts in particular?
    for (let i=0; i < podcasts.length; i++) {
        const podcast: Podcast = podcasts[i];

        const podcastEthereumAddress: EthereumPublicKey = parseEthereumAddressFromPodcastDescription(podcast.description);
    
        // const gasPrice = await web3.eth.getGasPrice();
        const gasPriceInWEI: WEI = 10000000000;
        
        console.log('gasPriceInWEI', gasPriceInWEI);

        const valueInWEI: WEI = calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI(Store.getState(), podcast);

        console.log('valueInWEI', valueInWEI);
        
        const valueLessGasPriceInWEI: WEI = valueInWEI - gasPriceInWEI;
        
        console.log('valueLessGasPriceInWEI', valueLessGasPriceInWEI);
        
        const netValueInWEI: WEI = valueLessGasPriceInWEI > 0 ? valueLessGasPriceInWEI : 0;

        console.log('netValueInWEI', netValueInWEI);

        if (netValueInWEI === 0) {
            continue;
        }

        const transactionObject = {
            from: Store.getState().ethereumAddress,
            to: podcastEthereumAddress,
            gas: 21000,
            gasPrice: gasPriceInWEI.toString(),
            value: netValueInWEI
            // data: web3.utils.asciiToHex('podcrypt') // TODO we might need to increase the gaslimit for this?
        };

        console.log('transactionObject', transactionObject);

        const signedTransactionObject = await web3.eth.accounts.signTransaction(transactionObject, await get('ethereumPrivateKey'));

        console.log('signedTransactionObject', signedTransactionObject);

        await signAndSendTransaction(Store, web3, signedTransactionObject, podcast);

        console.log('transaction sent');

        Store.dispatch({
            type: 'SET_PODCAST_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS',
            feedUrl: podcast.feedUrl,
            previousPayoutDateInMilliseconds: new Date().getTime()
        });
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

    await loadEthereumAccountBalance(Store, web3);
}

async function signAndSendTransaction(Store: Readonly<Store<Readonly<State>, AnyAction>>, web3: WEB3, signedTransactionObject: any, podcast: Readonly<Podcast>): Promise<void> {
    return new Promise((resolve, reject) => {
        // TODO use async await if possible?
        web3.eth.sendSignedTransaction(signedTransactionObject.rawTransaction, (error: Error, transactionHash: string) => {
            console.log('error', error);
            console.log('transactionHash', transactionHash);
            Store.dispatch({
                type: 'SET_PODCAST_LATEST_TRANSACTION_HASH',
                feedUrl: podcast.feedUrl,
                latestTransactionHash: transactionHash
            });

            resolve();
        })
        .catch((error: any) => {
            // TODO we need to update web3 to the latest version to get rid of this error
            // TODO once that happens, consider using await again
            console.log('This error should go away once we update web3', error);
        });    
    });
}