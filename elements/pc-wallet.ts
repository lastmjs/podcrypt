import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';
import { getCurrentETHPriceInUSD } from '../services/utilities';

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, update }) => {
        if (constructing) {
            Store.subscribe(update);

            loadCurrentETHPriceInUSD();

            const nextPayoutDateInMilliseconds = getNextPayoutDateInMilliseconds();

            Store.dispatch({
                type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
                nextPayoutDateInMilliseconds
            });
        }

        const eth = (Store.getState() as any).currentETHPriceInUSD === 'Loading...' ? 'Loading...' : (Store.getState() as any).payoutTargetInUSD / (Store.getState() as any).currentETHPriceInUSD;
        const nextPayoutLocaleDateString = new Date((Store.getState() as any).nextPayoutDateInMilliseconds).toLocaleDateString()

        return html`
            <style>
                .pc-wallet-container {
                    ${pcContainerStyles}
                }
    
                .pc-wallet-podcast-item {
                    padding: 5%;
                }
            </style>
    
            <div class="pc-wallet-container">
                ${(Store.getState() as any).walletCreationState === 'CREATED' ? walletUI(eth, nextPayoutLocaleDateString) : (Store.getState() as any).walletCreationState === 'CREATING' ? html`<div>Creating wallet...</div>` : walletWarnings()}
            </div>
        `;
    })

    function walletUI(eth: number | 'Loading...', nextPayoutLocaleDateString: string) {
        return html`
            <h3>Public key</h3>

            <div>${(Store.getState() as any).ethereumPublicKey}</div>

            <h3>
                Payout target
            </h3>

            <div style="font-size: calc(15px + 1vmin);">
                USD:
                <input
                    type="number"
                    value=${(Store.getState() as any).payoutTargetInUSD}
                    @input=${payoutTargetInUSDInputChanged}
                    style="font-size: calc(15px + 1vmin);"
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
                    style="font-size: calc(15px + 1vmin);"
                    min="1"
                    max="30"
                >
            </div>

            <h3>
                Next payout date
            </h3>

            <div style="font-size: calc(15px + 1vmin);">${nextPayoutLocaleDateString}</div>

            ${Object.values((Store.getState() as any).podcasts).map((podcast: any) => {
                const totalTimeInSeconds = Math.floor(calculateTotalTimeForPodcast(Store.getState(), podcast) / 1000);
                const totalMinutes = Math.floor(totalTimeInSeconds / 60);
                const totalSecondsRemaining = totalTimeInSeconds % 60;

                return html`
                    <div class="pc-wallet-podcast-item">
                        <h4>${podcast.title}</h4>
                        $${calculatePayoutAmountForPodcast(Store.getState(), podcast).toFixed(2)}, ${Math.floor(calculatePercentageOfTotalTimeForPodcast(Store.getState(), podcast) * 100)}%, ${totalMinutes} min ${totalSecondsRemaining} sec
                    </div>

                    <hr>
                `;
            })}
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
            <br>
            <button @click=${createWalletClick}>Create Wallet</button>
        `;
    }

    function createWalletClick() {
        const warningsAccepted = 
            (Store.getState() as any).warningCheckbox1Checked &&
            (Store.getState() as any).warningCheckbox2Checked &&
            (Store.getState() as any).warningCheckbox3Checked &&
            (Store.getState() as any).warningCheckbox4Checked;

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
    
    function calculatePayoutAmountForPodcast(state: any, podcast: any) {
        const percentageOfTotalTimeForPodcast = calculatePercentageOfTotalTimeForPodcast(state, podcast);
        return state.payoutAmountDollars * percentageOfTotalTimeForPodcast;
    }
    
    function calculatePercentageOfTotalTimeForPodcast(state: any, podcast: any) {
        const totalTime = calculateTotalTime(state);
        const totalTimeForPodcast = calculateTotalTimeForPodcast(state, podcast);
    
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

    function createWallet() {
        Store.dispatch({
            type: 'SET_WALLET_CREATION_STATE',
            walletCreationState: 'CREATING'
        });

        
    }

    setInterval(() => {
        const currentLocaleDateString = new Date().toLocaleDateString();
        const nextPayoutLocaleDateString = new Date((Store.getState() as any).nextPayoutDateInMilliseconds).toLocaleDateString();

        console.log('currentLocaleDateString', currentLocaleDateString);
        console.log('nextPayoutLocaleDateString', nextPayoutLocaleDateString);

        if (currentLocaleDateString === nextPayoutLocaleDateString) {
            console.log('Payout now!');
        }
    }, 60000);
});