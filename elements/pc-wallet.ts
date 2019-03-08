import { customElement, html } from 'functional-element';
import { TemplateResult } from 'lit-html';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';
import { getCurrentETHPriceInUSDCents } from '../services/utilities';
import { set, get } from 'idb-keyval';

// TODO we will need a backup node
const web3 = new Web3('https://ropsten-rpc.linkpool.io/');

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, update }) => {
        if (constructing) {
            Store.subscribe(update);

            loadEthereumAccountBalance();
            loadCurrentETHPriceInUSDCents();
        }

        const eth = Store.getState().currentETHPriceInUSDCents === null ? 'Loading...' : Store.getState().payoutTargetInUSDCents / Store.getState().currentETHPriceInUSDCents;
        const nextPayoutLocaleDateString: string = new Date(Store.getState().nextPayoutDateInMilliseconds).toLocaleDateString()

        return html`
            <style>
                .pc-wallet-container {
                    ${pcContainerStyles}
                }
    
                .pc-wallet-podcast-item {
                    box-shadow: 0px 0px 5px grey;
                    padding: 2%;
                    margin-top: 2%;
                    display: flex;
                    justify-content: center;
                    /* align-items: center; */
                }

                .pc-wallet-podcast-item-text {
                    font-size: calc(12px + 1vmin);
                    text-overflow: ellipsis;
                    flex: 1;
                    cursor: pointer;
                    font-weight: bold;
                }
            </style>
    
            <div class="pc-wallet-container">
                ${
                    Store.getState().walletCreationState === 'CREATED' ? 
                        walletUI(eth, nextPayoutLocaleDateString) :
                        Store.getState().walletCreationState === 'CREATING' ?
                            html`<div>Creating wallet...</div>` :
                            walletWarnings()
                }
            </div>
        `;
    })

    function walletUI(
        eth: number | 'Loading...',
        nextPayoutLocaleDateString: string
    ): Readonly<TemplateResult> {
        return html`
            <h3>Public key</h3>

            <div
                style="word-wrap: break-word;"
            >
                ${Store.getState().ethereumAddress}
            </div>

            <h3>Balance</h3>

            <div
                style="font-size: calc(15px + 1vmin);"
            >
                USD: 
                ${
                    Store.getState().currentETHPriceInUSDCents === 'Loading...' ?
                        'Loading...' : ((Store.getState().ethereumBalanceInWEI / 1e18) * Store.getState().currentETHPriceInUSDCents).toFixed(2)
                }
            </div>

            <br>

            <div
                style="font-size: calc(15px + 1vmin);"
            >
                ETH: ${Store.getState().ethereumBalanceInWEI / 1e18}
            </div>

            <h3>
                Payout target
            </h3>

            <div style="font-size: calc(15px + 1vmin);">
                USD:
                <input
                    type="number"
                    value=${Store.getState().payoutTargetInUSDCents.toString()}
                    @input=${payoutTargetInUSDCentsInputChanged}
                    style="font-size: calc(15px + 1vmin); border: none; border-bottom: 1px solid grey;"
                    min="0"
                    max="100"
                >
            </div>

            <br>

            <div style="font-size: calc(15px + 1vmin);">ETH: ${eth}</div>

            <h3>
                Payout interval
            </h3>

            <div style="font-size: calc(15px + 1vmin);">
                Days:
                <input 
                    type="number"
                    value=${(Store.getState() as any).payoutIntervalInDays}
                    @input=${payoutIntervalInDaysInputChanged}
                    style="font-size: calc(15px + 1vmin); border: none; border-bottom: 1px solid grey"
                    min="1"
                    max="30"
                >
            </div>

            <h3>
                Next payout date
            </h3>

            <div style="font-size: calc(15px + 1vmin);">${nextPayoutLocaleDateString}</div>

            <br>

            <button @click=${payout}>Manual payout</button>

            <br>
            <br>
            <hr>
            <br>

            ${Object.values((Store.getState() as any).podcasts).map((podcast: any) => {
                const totalTimeInSeconds = Math.floor(calculateTotalTimeForPodcastDuringCurrentInterval(Store.getState(), podcast) / 1000);
                const totalMinutes = Math.floor(totalTimeInSeconds / 60);
                const totalSecondsRemaining = totalTimeInSeconds % 60;

                return html`
                    <div class="pc-wallet-podcast-item">
                        <div>
                            <img src="${podcast.imageUrl}">
                        </div>
                        <div style="display:flex: flex-direction: column; padding-left: 5%">
                            <div class="pc-wallet-podcast-item-text">${podcast.title}</div>
                            <br>
                            <div>$${calculatePayoutAmountForPodcastDuringCurrentInterval(Store.getState(), podcast).toFixed(2)}, ${Math.floor(calculatePercentageOfTotalTimeForPodcastDuringCurrentInterval(Store.getState(), podcast) * 100)}%, ${totalMinutes} min ${totalSecondsRemaining} sec</div>
                            <br>
                            <div>Last payout: ${podcast.previousPayoutDateInMilliseconds === null ? 'never' : html`<a href="https://ropsten.etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${new Date(podcast.previousPayoutDateInMilliseconds).toLocaleDateString()}</a>`}</div>
                            <div>Next payout: ${nextPayoutLocaleDateString}</div>
                        </div>
                    </div>
                `;
            })}
<!-- 
            <div class="pc-wallet-podcast-item">
                <h4>Podcrypt</h4>
                10%
            </div>

            <hr> -->
        `;
    }

    function walletWarnings() {
        return html`
            <div>I understand the following:</div>
            <br>
            <div>
                <input 
                    type="checkbox"
                    @input=${checkbox1InputChanged}
                    .checked=${Store.getState().warningCheckbox1Checked}
                >
                Podcrypt is offered to me under the terms of the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a>
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox2InputChanged}
                    .checked=${Store.getState().warningCheckbox2Checked}
                >
                This is pre-alpha software
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox3InputChanged}
                    .checked=${Store.getState().warningCheckbox3Checked}
                >
                Anything could go wrong
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox4InputChanged}
                    .checked=${Store.getState().warningCheckbox4Checked}
                >
                My Podcrypt data will probably be wiped regularly during the pre-alpha
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox5InputChanged}
                    .checked=${Store.getState().warningCheckbox5Checked}
                >
                Podcrypt Pre-alpha uses the Ropsten test network for payments. I should NOT send real ETH to Podcrypt Pre-alpha.
            </div>
            <br>
            <button @click=${createWalletClick}>Create Wallet</button>
        `;
    }

    function createWalletClick() {
        const warningsAccepted = 
            Store.getState().warningCheckbox1Checked &&
            Store.getState().warningCheckbox2Checked &&
            Store.getState().warningCheckbox3Checked &&
            Store.getState().warningCheckbox4Checked &&
            Store.getState().warningCheckbox5Checked;

        if (!warningsAccepted) {
            alert('Silly you, you must understand');
        }
        else {
            createWallet();
        }
    }

    function checkbox1InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_1_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox2InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_2_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox3InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_3_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox4InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_4_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox5InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_5_CHECKED',
            checked: e.target.checked
        });
    }

    function calculatePayoutAmountForPodcastDuringCurrentInterval(state: any, podcast: any) {
        const percentageOfTotalTimeForPodcastDuringCurrentInterval = calculatePercentageOfTotalTimeForPodcastDuringCurrentInterval(state, podcast);        
        return state.payoutTargetInUSD * percentageOfTotalTimeForPodcastDuringCurrentInterval;
    }

    function calculatePercentageOfTotalTimeForPodcastDuringCurrentInterval(state: any, podcast: any) {
        const totalTime = calculateTotalTimeDuringCurrentInterval(state);
        const totalTimeForPodcast = calculateTotalTimeForPodcastDuringCurrentInterval(state, podcast);
    
        if (totalTime === 0) {
            return 0;
        }

        return totalTimeForPodcast / totalTime;
    }

    function calculateTotalTimeDuringCurrentInterval(state: any): number {
        return Object.values(state.podcasts).reduce((result: number, podcast) => {
            return result + calculateTotalTimeForPodcastDuringCurrentInterval(state, podcast);
        }, 0);
    }

    function calculateTotalTimeForPodcastDuringCurrentInterval(state: any, podcast: any): number {
        return podcast.episodes.reduce((result: number, episodeGuid: string) => {
            const episode = state.episodes[episodeGuid];
            const timestampsDuringCurrentInterval = getTimestampsDuringCurrentInterval(state, episode.timestamps);

            return result + timestampsDuringCurrentInterval.reduce((result: number, timestamp: any, index: number) => {
                const nextTimestamp = timestampsDuringCurrentInterval[index + 1];
                const previousTimestamp = timestampsDuringCurrentInterval[index - 1];
    
                if (timestamp.type === 'START') {
                    if (nextTimestamp && nextTimestamp.type === 'STOP') {
                        return result - timestamp.timestamp;
                    }
                    else {
                        return result + 0;
                    }
                }
    
                if (timestamp.type === 'STOP') {
                    if (previousTimestamp && previousTimestamp.type === 'START') {
                        return result + timestamp.timestamp;
                    }
                    else {
                        return result + 0;
                    }
                }
            }, 0);
        }, 0);
    }

    function getTimestampsDuringCurrentInterval(state: any, timestamps: any) {
        return timestamps.filter((timestamp: any) => {
            return timestamp.timestamp > state.previousPayoutDateInMilliseconds && timestamp.timestamp <= new Date().getTime();
        });
    }
    
    // function calculatePayoutAmountForPodcast(state: any, podcast: any) {
    //     const percentageOfTotalTimeForPodcast = calculatePercentageOfTotalTimeForPodcast(state, podcast);        
    //     return state.payoutTargetInUSD * percentageOfTotalTimeForPodcast;
    // }
    
    // function calculatePercentageOfTotalTimeForPodcast(state: any, podcast: any) {
    //     const totalTime = calculateTotalTime(state);
    //     const totalTimeForPodcast = calculateTotalTimeForPodcast(state, podcast);
    
    //     if (totalTime === 0) {
    //         return 0;
    //     }

    //     return totalTimeForPodcast / totalTime;
    // }
    
    // function calculateTotalTime(state: any): number {
    //     return Object.values(state.podcasts).reduce((result: number, podcast) => {
    //         return result + calculateTotalTimeForPodcast(state, podcast);
    //     }, 0);
    // }
    
    // function calculateTotalTimeForPodcast(state: any, podcast: any): number {
    //     return podcast.episodes.reduce((result: number, episodeGuid: string) => {
    //         const episode = state.episodes[episodeGuid];
    
    //         return result + episode.timestamps.reduce((result: number, timestamp: any, index: number) => {
    //             const nextTimestamp = episode.timestamps[index + 1];
    //             const previousTimestamp = episode.timestamps[index - 1];
    
    //             if (timestamp.type === 'START') {
    //                 if (nextTimestamp && nextTimestamp.type === 'STOP') {
    //                     return result - new Date(timestamp.timestamp).getTime();
    //                 }
    //                 else {
    //                     return result + 0;
    //                 }
    //             }
    
    //             if (timestamp.type === 'STOP') {
    //                 if (previousTimestamp && previousTimestamp.type === 'START') {
    //                     return result + new Date(timestamp.timestamp).getTime();
    //                 }
    //                 else {
    //                     return result + 0;
    //                 }
    //             }
    //         }, 0);
    //     }, 0);
    // }

    async function payoutTargetInUSDCentsInputChanged(e: any) {
        await loadCurrentETHPriceInUSDCents();
        Store.dispatch({
            type: 'SET_PAYOUT_TARGET_IN_USD_CENTS',
            payoutTargetInUSDCents: parseInt(e.target.value) * 100
        });
    }

    function payoutIntervalInDaysInputChanged(e: any) {
        Store.dispatch({
            type: 'SET_PAYOUT_INTERVAL_IN_DAYS',
            payoutIntervalInDays: e.target.value
        });

        const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds();

        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });
    }

    async function loadCurrentETHPriceInUSDCents(): Promise<void> {
        Store.dispatch({
            type: 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS',
            currentETHPriceInUSDCents: 'LOADING' // TODO change to UNKNOWN or some state or something
        });
        // TODO the above should be setting another variable on the state called currentETHPriceInUSDCentsState or something like that, like the wallet state

        const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = await getCurrentETHPriceInUSDCents();

        Store.dispatch({
            type: 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS',
            currentETHPriceInUSDCents
        });
    }

    function getNextPayoutDateInMilliseconds(): Milliseconds {
        const previousPayoutDateInMilliseconds: Milliseconds | null = Store.getState().previousPayoutDateInMilliseconds;
        const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;
        const oneDayInSeconds: Seconds = 86400;
        const oneDayInMilliseconds: Milliseconds = oneDayInSeconds * 1000;
        const payoutIntervalInMilliseconds: Milliseconds = oneDayInMilliseconds * payoutIntervalInDays;

        if (previousPayoutDateInMilliseconds === null) {
            const nextPayoutDateInMilliseconds = new Date(new Date().getTime() + payoutIntervalInMilliseconds).getTime();
            return nextPayoutDateInMilliseconds;
        }
        else {
            const nextPayoutDateInMilliseconds = new Date(previousPayoutDateInMilliseconds + payoutIntervalInMilliseconds).getTime();
            return nextPayoutDateInMilliseconds;   
        }
    }

    async function createWallet(): Promise<void> {
        Store.dispatch({
            type: 'SET_WALLET_CREATION_STATE',
            walletCreationState: 'CREATING'
        });

        // TODO we might want some backup nodes
        const newAccount = await web3.eth.accounts.create();

        // TODO we will probably need some more hardcore security than this
        await set('ethereumPrivateKey', newAccount.privateKey);

        Store.dispatch({
            type: 'SET_ETHEREUM_ADDRESS',
            ethereumAddress: newAccount.address
        });

        Store.dispatch({
            type: 'SET_WALLET_CREATION_STATE',
            walletCreationState: 'CREATED'
        });

        await loadEthereumAccountBalance();

        const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds();

        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });
    }

    async function loadEthereumAccountBalance(): Promise<void> {
        // TODO try not to use null for anything...use a description string instead
        const ethereumAddress: EthereumPublicKey | null = Store.getState().ethereumAddress;

        if (ethereumAddress === null) {
            return;
        }

        const ethereumBalanceInWEI: WEI = await web3.eth.getBalance(ethereumAddress);

        Store.dispatch({
            type: 'SET_ETHEREUM_BALANCE_IN_WEI',
            ethereumBalanceInWEI
        });
    }

    function parseEthereumAddressFromPodcastDescription(podcastDescription: string): string {
        const testPodcastAccount = '0x81C0bf46ED56216E3f9f0864B46C099B8A3315B3';
        return testPodcastAccount;
    }

    async function payout(): Promise<void> {
        
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

            const valueInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringCurrentInterval(Store.getState(), podcast);
            
            console.log('valueInUSDCents', valueInUSDCents);
            
            const valueInETH: ETH = valueInUSDCents / Store.getState().currentETHPriceInUSDCents;
            
            console.log('valueInETH', valueInETH);
            
            // TODO check if we need to Math.floor
            const valueInWEI: WEI = valueInETH * 1e18;
            
            console.log('valueInWEI', valueInWEI);
            
            const valueLessGasPriceInWEI: WEI = valueInWEI - gasPriceInWEI;
            
            console.log('valueLessGasPriceInWEI', valueLessGasPriceInWEI);
            
            const netValueInWEI: WEI = valueLessGasPriceInWEI > 0 ? valueLessGasPriceInWEI : 0;

            console.log('netValueInWEI', netValueInWEI);

            if (netValueInWEI === 0) {
                continue;
            }

            const transactionObject = {
                from: (Store.getState() as any).ethereumAddress,
                to: podcastEthereumAddress,
                gas: 21000,
                gasPrice: gasPriceInWEI,
                value: netValueInWEI
                // data: web3.utils.asciiToHex('podcrypt') // TODO we might need to increase the gaslimit for this?
            };

            console.log('transactionObject', transactionObject);

            const signedTransactionObject = await web3.eth.accounts.signTransaction(transactionObject, await get('ethereumPrivateKey'));

            console.log('signedTransactionObject', signedTransactionObject);

            await signAndSendTransaction(signedTransactionObject, podcast);

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

        const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds();

        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });

        await loadEthereumAccountBalance();
    }

    async function signAndSendTransaction(signedTransactionObject: any, podcast: any): Promise<void> {
        return new Promise((resolve, reject) => {
            web3.eth.sendSignedTransaction(signedTransactionObject.rawTransaction, (error: any, transactionHash: string) => {
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

    setInterval(() => {
        const currentLocaleDateString: string = new Date().toLocaleDateString();
        const nextPayoutLocaleDateString: string = new Date((Store.getState() as any).nextPayoutDateInMilliseconds).toLocaleDateString();

        console.log('currentLocaleDateString', currentLocaleDateString);
        console.log('nextPayoutLocaleDateString', nextPayoutLocaleDateString);

        if (
            new Date().getTime() >= (Store.getState() as any).nextPayoutDateInMilliseconds
        ) {
            payout();
        }
    }, 60000);
});