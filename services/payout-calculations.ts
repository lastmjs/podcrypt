import { 
    Store,
    AnyAction
} from 'redux';
import { calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI } from './podcast-calculations';
import { loadEthereumAccountBalance } from './balance-calculations';
import { get } from 'idb-keyval';

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

export async function payout(Store: Readonly<Store<Readonly<State>, AnyAction>>, ethersProvider: any): Promise<void> {
        
    const podcasts: ReadonlyArray<Podcast> = Object.values(Store.getState().podcasts);

    // TODO if there is a failure with one transaction, we want to keep going with the other transactions
    // TODO we want the previous payment sent even if some transactions fail...or do we?
    // TODO we should probably set the previous transaction payment sent field on podcasts in particular?
    for (let i=0; i < podcasts.length; i++) {
        try {
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
    
            const preparedTransaction = {
                // from: Store.getState().ethereumAddress,
                to: podcastEthereumAddress,
                gasLimit: 21000,
                gasPrice: gasPriceInWEI,
                value: netValueInWEI
                // data: web3.utils.asciiToHex('podcrypt') // TODO we might need to increase the gaslimit for this?
            };
    
            console.log('preparedTransaction', preparedTransaction);
    
            console.log('signing and sending transaction');
    
            const wallet = new ethers.Wallet(await get('ethereumPrivateKey'), ethersProvider);
            const transaction = await wallet.sendTransaction(preparedTransaction);
    
            console.log('transaction sent');
    
            Store.dispatch({
                type: 'SET_PODCAST_LATEST_TRANSACTION_HASH',
                feedUrl: podcast.feedUrl,
                latestTransactionHash: transaction.hash
            });
    
            Store.dispatch({
                type: 'SET_PODCAST_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS',
                feedUrl: podcast.feedUrl,
                previousPayoutDateInMilliseconds: new Date().getTime()
            });
        }
        catch(error) {
            console.log('payout', error);
        }
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
}