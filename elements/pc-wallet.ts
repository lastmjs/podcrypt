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
            </div>
        `;
    })
    
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