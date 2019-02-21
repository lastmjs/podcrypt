import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-player', ({ constructing, update, element }) => {
    
    if (constructing) {
        Store.subscribe(update);
    }
    
    const state = Store.getState();
    const currentEpisode = state.episodes[state.currentEpisodeGuid];

    return html`
        <style>
            .pc-player-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                position: fixed;
                bottom: 2%;
                width: 100%;
            }
        </style>

        <div class="pc-player-container">
            <audio
                src="${currentEpisode ? currentEpisode.src : ''}"
                @ended=${audioEnded}
                @timeupdate=${timeUpdated}
                @play=${played}
                @pause=${paused}
                @loadstart=${() => loadStarted(currentEpisode, element)}
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
    const progress = e.target.currentTime;

    if (progress === 0) {
        return;
    }

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

function loadStarted(currentEpisode, element) {
    const audioElement = element.querySelector('audio');
    audioElement.currentTime = currentEpisode.progress;
}