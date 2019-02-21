import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-player', ({ constructing, update, element }) => {
    if (constructing) {
        Store.subscribe(update);
    }

    const state = Store.getState();
    const currentEpisode = state.episodes[state.currentEpisodeGuid] || {};

    // TODO working on picking up where we left off on audio tracks
    // if (currentEpisode.playing === false) {
    //     const audioElement = element.querySelector('audio');

    //     if (audioElement) {
    //         audioElement.currentTime = Math.floor(currentEpisode.progress / 1000);
    //     }
    // }

    return html`
        <style>
            .pc-player-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                position: fixed;
                bottom: 0;
                background-color: grey;
                width: 100%;
            }
        </style>

        <div class="pc-player-container">
            <audio
                src="${currentEpisode.src}"
                @ended=${audioEnded}
                @timeupdate=${timeUpdated}
                @play=${played}
                @pause=${paused}
                controls
                autoplay
            ></audio>
        </div>
    `;
})

function audioEnded() {
    Store.dispatch({
        type: 'CURRENT_EPISODE_COMPLETED'
    });
}

function timeUpdated(e) {
    const progress = e.timeStamp
    Store.dispatch({
        type: 'UPDATE_CURRENT_EPISODE_PROGRESS',
        progress
    });
}

function played() {
    Store.dispatch({
        type: 'CURRENT_EPISODE_PLAYED'
    });
}

function paused() {
    Store.dispatch({
        type: 'CURRENT_EPISODE_PAUSED'
    });
}