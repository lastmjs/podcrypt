// TODO everything needs to be chunked...downloading the files needs to be chunked,
// TODO saving the files to IndexedDB needs to be chunked, retrieving the files from IndexedDB needs to be chunked
// TODO Turning the retrieved files into object urls needs to be chunked
// TODO We need a smooth transition from one audio element to the next, I think 10mb chunks might be best
// TODO test releasing object urls, I think that might be ruining everything

import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import { StorePromise } from '../state/store';
import {
    pxXXLarge,
    pxXLarge
} from '../services/css';

StorePromise.then((Store) => {
    
    class PCPlayer extends HTMLElement {
        constructor() {
            super();
            Store.subscribe(() => litRender(this.render(Store.getState()), this));
        }

        timeSliderOnInput(e: Readonly<Event>) {

        }

        skipBack() {

        }

        skipForward() {
            
        }

        render(state: Readonly<State>): Readonly<TemplateResult> {
            return html`
                <style>
                    .pc-player-container {
                        position: fixed;
                        bottom: 0;
                        width: ${state.screenType === 'DESKTOP' ? '50vw' : '100vw'};
                        background-color: white;
                        box-shadow: inset 0px 5px 5px -5px grey;
                    }
        
                    .pc-player-play-icon {
                        font-size: calc(50px + 1vmin);
                        cursor: pointer;
                    }

                    .pc-player-backward-icon {
                        font-size: ${pxXLarge};
                        margin-right: ${pxXXLarge};
                        margin-left: ${pxXXLarge};
                        cursor: pointer;
                    }

                    .pc-player-forward-icon {
                        font-size: ${pxXLarge};
                        margin-left: ${pxXLarge};
                        margin-right: ${pxXLarge};
                        cursor: pointer;
                    }
                </style>
        
                <div class="pc-player-container">

                    <div style="padding: calc(10px + 1vmin); display: flex">
                        <div style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1;">
                            <input @input=${(e: Readonly<Event>) => this.timeSliderOnInput(e)} type="range" style="width: 100%; position: absolute; top: 0; height: 0" min="0" max="${getDuration(element)}" .value=${currentEpisode ? currentEpisode.progress : '0'}>
                        </div>
                        <div style="width: ${getProgressPercentage(element)}%; position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(1, 1, 1, .1); z-index: -1"></div>
                        <!-- <i 
                            class="material-icons pc-player-play-icon"
                        >
                            skip_previous
                        </i> -->

                        <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center; flex: 1">
                            <div style="font-size: calc(10px + 1vmin);">${currentEpisode ? secondsToHoursMinutesSeconds(currentEpisode.progress) : ''}</div>
                            <div><hr style="width: 100%"></div>
                            <div style="font-size: calc(10px + 1vmin);">${getDuration(element) ? secondsToHoursMinutesSeconds(getDuration(element)) : ''}</div>
                        </div>

                        <div style="flex: 2; display: flex; align-items: center; justify-content: center">
                            <i 
                                class="material-icons pc-player-backward-icon"
                                @click=${() => skipBack(audio1Element, audio2Element)}
                            >
                                replay_10
                            </i>

                            ${
                                Store.getState().playerPlaying ? 
                                html`
                                    <i 
                                        class="material-icons pc-player-play-icon"
                                        @click=${paused}
                                    >
                                        pause
                                    </i>
                                ` :
                                html`
                                    <i 
                                        class="material-icons pc-player-play-icon"
                                        @click=${played}
                                    >
                                        play_arrow
                                    </i>
                                `
                            }

                            <i 
                                class="material-icons pc-player-forward-icon"
                                @click=${() => skipForward(audio1Element, audio2Element)}
                            >
                                forward_10
                            </i>

                            <!-- <i 
                                class="material-icons pc-player-play-icon"
                            >
                                skip_next
                            </i> -->
                        </div>

                        <div style="flex: 1; display: flex; justify-content: center; align-items: center;">
                            <select @change=${playbackRateChanged} style="border: none; background-color: transparent">
                                <option value=".25" ?selected=${Store.getState().playbackRate === '.25'}>.25x</option>
                                <option value=".5" ?selected=${Store.getState().playbackRate === '.5'}>.5x</option>
                                <option value=".75" ?selected=${Store.getState().playbackRate === '.75'}>.75x</option>
                                <option value="1" ?selected=${Store.getState().playbackRate === '1'}>1x</option>
                                <option value="1.25" ?selected=${Store.getState().playbackRate === '1.25'}>1.25x</option>
                                <option value="1.5" ?selected=${Store.getState().playbackRate === '1.5'}>1.5x</option>
                                <option value="1.75" ?selected=${Store.getState().playbackRate === '1.75'}>1.75x</option>
                                <option value="2" ?selected=${Store.getState().playbackRate === '2'}>2x</option>
                            </select>
                        </div>
                    </div>


                </div>

                <audio
                    id="audio-1"
                    src=${audio1Src}
                    preload="metadata"
                    @loadeddata=${() => loadedData(currentEpisode, audio1Element, audio2Element)}
                    @ended=${audio1Ended}
                    @timeupdate=${(e: any) => timeUpdated(e, audio2Element)}
                    .playbackRate=${parseInt(Store.getState().playbackRate)}
                ></audio>

                <audio
                    id="audio-2"
                    src=${audio2Src}
                    preload="metadata"
                    @loadeddata=${() => loadedData(currentEpisode, audio1Element, audio2Element)}
                    @ended=${audio2Ended}
                    @timeupdate=${(e: any) => timeUpdated(e, audio2Element)}
                    .playbackRate=${parseInt(Store.getState().playbackRate)}
                ></audio>
            `;
        }
    }
    
    window.customElements.define('pc-player', PCPlayer);

});
