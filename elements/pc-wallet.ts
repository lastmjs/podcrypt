import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';
import { getCurrentETHPriceInUSD } from '../services/utilities';
import { set, get } from 'idb-keyval';

const web3 = new Web3('https://ropsten-rpc.linkpool.io/');

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, update }) => {
        if (constructing) {
            Store.subscribe(update);

            loadEthereumAccountBalance();
            loadCurrentETHPriceInUSD();
        }

        const eth = (Store.getState() as any).currentETHPriceInUSD === 'Loading...' ? 'Loading...' : (Store.getState() as any).payoutTargetInUSD / (Store.getState() as any).currentETHPriceInUSD;
        const nextPayoutLocaleDateString = new Date((Store.getState() as any).nextPayoutDateInMilliseconds).toLocaleDateString()
        const previousPayoutDateInMilliseconds = (Store.getState() as any).previousPayoutDateInMilliseconds;
        const previousPayoutLocaleDateString = previousPayoutDateInMilliseconds === null ? 'never' : new Date(previousPayoutDateInMilliseconds).toLocaleDateString();

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
                ${(Store.getState() as any).walletCreationState === 'CREATED' ? walletUI(eth, previousPayoutLocaleDateString, nextPayoutLocaleDateString) : (Store.getState() as any).walletCreationState === 'CREATING' ? html`<div>Creating wallet...</div>` : walletWarnings()}
            </div>
        `;
    })

    function walletUI(eth: number | 'Loading...', previousPayoutLocaleDateString: string, nextPayoutLocaleDateString: string) {
        return html`
            <h3>Public key</h3>

            <div style="word-wrap: break-word;">${(Store.getState() as any).ethereumAddress}</div>

            <h3>Balance</h3>

            <div style="font-size: calc(15px + 1vmin);">USD: ${(Store.getState() as any).currentETHPriceInUSD === 'Loading...' ? 'Loading...' : (((Store.getState() as any).ethereumBalanceInWEI / 1e18) * (Store.getState() as any).currentETHPriceInUSD).toFixed(2)}</div>

            <br>

            <div style="font-size: calc(15px + 1vmin);">ETH: ${(Store.getState() as any).ethereumBalanceInWEI / 1e18}</div>

            <h3>
                Payout target
            </h3>

            <div style="font-size: calc(15px + 1vmin);">
                USD:
                <input
                    type="number"
                    value=${(Store.getState() as any).payoutTargetInUSD}
                    @input=${payoutTargetInUSDInputChanged}
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
                            <div>Last payout: ${previousPayoutLocaleDateString === 'never' ? previousPayoutLocaleDateString : html`<a href="https://ropsten.etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${previousPayoutLocaleDateString}</a>`}</div>
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
            <div><input type="checkbox" @input=${checkbox1InputChanged} .checked=${(Store.getState() as any).warningCheckbox1Checked}> Podcrypt is offered to me under the terms of the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a></div>
            <div><input type="checkbox" @input=${checkbox2InputChanged} .checked=${(Store.getState() as any).warningCheckbox2Checked}> This is pre-alpha software</div>
            <div><input type="checkbox" @input=${checkbox3InputChanged} .checked=${(Store.getState() as any).warningCheckbox3Checked}> Anything could go wrong</div>
            <div><input type="checkbox" @input=${checkbox4InputChanged} .checked=${(Store.getState() as any).warningCheckbox4Checked}> My Podcrypt data will probably be wiped regularly during the pre-alpha</div>
            <div><input type="checkbox" @input=${checkbox5InputChanged} .checked=${(Store.getState() as any).warningCheckbox5Checked}> Podcrypt Pre-alpha uses the Ropsten test network for payments. I should NOT send real ETH to Podcrypt Pre-alpha.</div>
            <br>
            <button @click=${createWalletClick}>Create Wallet</button>
        `;
    }

    function createWalletClick() {
        const warningsAccepted = 
            (Store.getState() as any).warningCheckbox1Checked &&
            (Store.getState() as any).warningCheckbox2Checked &&
            (Store.getState() as any).warningCheckbox3Checked &&
            (Store.getState() as any).warningCheckbox4Checked &&
            (Store.getState() as any).warningCheckbox5Checked;

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
    
    function calculatePayoutAmountForPodcast(state: any, podcast: any) {
        const percentageOfTotalTimeForPodcast = calculatePercentageOfTotalTimeForPodcast(state, podcast);        
        return state.payoutTargetInUSD * percentageOfTotalTimeForPodcast;
    }
    
    function calculatePercentageOfTotalTimeForPodcast(state: any, podcast: any) {
        const totalTime = calculateTotalTime(state);
        const totalTimeForPodcast = calculateTotalTimeForPodcast(state, podcast);
    
        if (totalTime === 0) {
            return 0;
        }

        return totalTimeForPodcast / totalTime;
    }
    
    function calculateTotalTime(state: any): number {
        return Object.values(state.podcasts).reduce((result: number, podcast) => {
            return result + calculateTotalTimeForPodcast(state, podcast);
        }, 0);
    }
    
    function calculateTotalTimeForPodcast(state: any, podcast: any): number {
        return podcast.episodes.reduce((result: number, episodeGuid: string) => {
            const episode = state.episodes[episodeGuid];
    
            return result + episode.timestamps.reduce((result: number, timestamp: any, index: number) => {
                const nextTimestamp = episode.timestamps[index + 1];
                const previousTimestamp = episode.timestamps[index - 1];
    
                if (timestamp.type === 'START') {
                    if (nextTimestamp && nextTimestamp.type === 'STOP') {
                        return result - new Date(timestamp.timestamp).getTime();
                    }
                    else {
                        return result + 0;
                    }
                }
    
                if (timestamp.type === 'STOP') {
                    if (previousTimestamp && previousTimestamp.type === 'START') {
                        return result + new Date(timestamp.timestamp).getTime();
                    }
                    else {
                        return result + 0;
                    }
                }
            }, 0);
        }, 0);
    }

    async function payoutTargetInUSDInputChanged(e: any) {
        await loadCurrentETHPriceInUSD();
        Store.dispatch({
            type: 'SET_PAYOUT_TARGET_IN_USD',
            payoutTargetInUSD: e.target.value
        });
    }

    function payoutIntervalInDaysInputChanged(e: any) {
        Store.dispatch({
            type: 'SET_PAYOUT_INTERVAL_IN_DAYS',
            payoutIntervalInDays: e.target.value
        });

        const nextPayoutDateInMilliseconds = getNextPayoutDateInMilliseconds();

        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });
    }

    async function loadCurrentETHPriceInUSD() {
        Store.dispatch({
            type: 'SET_CURRENT_ETH_PRICE_IN_USD',
            currentETHPriceInUSD: 'Loading...'
        });

        const currentETHPriceInUSD = await getCurrentETHPriceInUSD();

        Store.dispatch({
            type: 'SET_CURRENT_ETH_PRICE_IN_USD',
            currentETHPriceInUSD
        });
    }

    function getNextPayoutDateInMilliseconds() {
        const previousPayoutDateInMilliseconds = (Store.getState() as any).previousPayoutDateInMilliseconds;
        const payoutIntervalInDays = (Store.getState() as any).payoutIntervalInDays;
        const oneDayInSeconds = 86400;
        const oneDayInMilliseconds = oneDayInSeconds * 1000;
        const payoutIntervalInMilliseconds = oneDayInMilliseconds * payoutIntervalInDays;

        if (previousPayoutDateInMilliseconds === null) {
            const nextPayoutDate = new Date(new Date().getTime() + payoutIntervalInMilliseconds).getTime();
            return nextPayoutDate;
        }
        else {
            const nextPayoutDate = new Date(previousPayoutDateInMilliseconds + payoutIntervalInMilliseconds).getTime();
            return nextPayoutDate;   
        }
    }

    async function createWallet() {
        Store.dispatch({
            type: 'SET_WALLET_CREATION_STATE',
            walletCreationState: 'CREATING'
        });

        // TODO we might want some backup nodes
        const newAccount = await web3.eth.accounts.create();

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

        const nextPayoutDateInMilliseconds = getNextPayoutDateInMilliseconds();

        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });
    }

    async function loadEthereumAccountBalance() {
        const ethereumAddress = (Store.getState() as any).ethereumAddress;

        if (ethereumAddress === null) {
            return;
        }

        const ethereumBalanceInWEI = await web3.eth.getBalance(ethereumAddress);

        Store.dispatch({
            type: 'SET_ETHEREUM_BALANCE_IN_WEI',
            ethereumBalanceInWEI
        });
    }

    function parseEthereumAddressFromPodcastDescription(podcastDescription: string) {
        const testPodcastAccount = '0x81C0bf46ED56216E3f9f0864B46C099B8A3315B3';
        return testPodcastAccount;
    }

    async function payout() {
        
        const podcasts: any = Object.values((Store.getState() as any).podcasts);

        for (let i=0; i < podcasts.length; i++) {
            const podcast = podcasts[i];

            const podcastEthereumAddress = parseEthereumAddressFromPodcastDescription(podcast.description);
        
            // const gasPrice = await web3.eth.getGasPrice();
            const gasPrice = 10000000000;
            const valueInUSD = calculatePayoutAmountForPodcastDuringCurrentInterval(Store.getState(), podcast);
            const valueInETH = valueInUSD / (Store.getState() as any).currentETHPriceInUSD;
            const valueInWEI = valueInETH * 1e18;
            const valueLessGasPrice = valueInWEI - gasPrice;
            const value = valueLessGasPrice > 0 ? valueLessGasPrice : 0; // TODO we probably want to stop here and send nothing if the value after gas is zero

            const transactionObject = {
                from: (Store.getState() as any).ethereumAddress,
                to: podcastEthereumAddress,
                gas: 21000,
                gasPrice,
                value
                // data: web3.utils.asciiToHex('podcrypt') // TODO we might need to increase the gaslimit for this?
            };

            console.log('transactionObject', transactionObject);

            const signedTransactionObject = await web3.eth.accounts.signTransaction(transactionObject, await get('ethereumPrivateKey'));

            console.log('signedTransactionObject', signedTransactionObject);

            await signAndSendTransaction(signedTransactionObject, podcast);
        }

        Store.dispatch({
            type: 'SET_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS',
            previousPayoutDateInMilliseconds: new Date().getTime()
        });

        const nextPayoutDateInMilliseconds = getNextPayoutDateInMilliseconds();

        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });
    }

    async function signAndSendTransaction(signedTransactionObject: any, podcast: any) {
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
        const currentLocaleDateString = new Date().toLocaleDateString();
        const nextPayoutLocaleDateString = new Date((Store.getState() as any).nextPayoutDateInMilliseconds).toLocaleDateString();

        console.log('currentLocaleDateString', currentLocaleDateString);
        console.log('nextPayoutLocaleDateString', nextPayoutLocaleDateString);

        if (currentLocaleDateString === nextPayoutLocaleDateString) {
            payout();
        }
    }, 60000);
});