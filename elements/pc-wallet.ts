import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, update }) => {
        if (constructing) {
            Store.subscribe(update);
        }
    
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
                <h3>
                    Payout amount: ~$${(Store.getState() as any).payoutAmountDollars}
                </h3>
    
                <h3>
                    Payout interval: 30 days
                </h3>
    
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
});