import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { Store } from '../services/store';

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
                Payout amount: ~$10
            </h3>

            <h3>
                Payout interval: 30 days
            </h3>

            <h4>Podcasts</h4>

            ${Object.values(Store.getState().podcasts).map((podcast) => {
                return html`
                    <div class="pc-wallet-podcast-item">
                        <div>${podcast.title}</div>
                        <br>
                        <div>Time listened: ${Math.floor(calculateTotalTime(podcast) / 1000)} seconds</div>
                        <br>
                        <div>Percentage of total time listened: </div>
                        <br>
                        <div>Payout: </div>
                    </div>

                    <hr>
                `;
            })}
        </div>
    `;
})

function calculateTotalTime(podcast) {
    return podcast.episodes.reduce((result, episodeGuid) => {
        const episode = Store.getState().episodes[episodeGuid];

        return result + episode.timestamps.reduce((result, timestamp, index) => {
            const nextTimestamp = episode.timestamps[index + 1];

            if (timestamp.type === 'START') {
                if (nextTimestamp && nextTimestamp.type === 'STOP') {
                    return result - new Date(timestamp.timestamp).getTime();
                }
                else {
                    return result + 0;
                }
            }
            else {
                return result + new Date(timestamp.timestamp).getTime();
            }
        }, 0);
    }, 0);
}