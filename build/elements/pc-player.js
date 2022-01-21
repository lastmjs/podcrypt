import {
  html,
  render as litRender
} from "../_snowpack/pkg/lit-html.js";
import {StorePromise} from "../state/store.js";
import {
  pxXXLarge,
  pxXLarge,
  alertPadding
} from "../services/css.js";
import BigNumber from "../_snowpack/pkg/bignumberjs.js";
import {pcAlert} from "./pc-modal.js";
StorePromise.then((Store) => {
  class PCPlayer extends HTMLElement {
    constructor() {
      super();
      this.counter = 0;
      Store.subscribe(() => litRender(this.render(Store.getState()), this));
    }
    async connectedCallback() {
      Store.dispatch({
        type: "RENDER"
      });
      setTimeout(() => {
        Store.dispatch({
          type: "RENDER"
        });
      }, 5e3);
    }
    async audioEnded(currentEpisode, audioElement) {
      Store.dispatch({
        type: "CURRENT_EPISODE_COMPLETED"
      });
    }
    playbackRateChanged(e) {
      if (e.target === null || e.target === void 0) {
        const message = "Could not set the playback rate";
        pcAlert(html`
                    <div style="${alertPadding}">${message}</div>
                `, Store.getState().screenType);
        throw new Error(message);
      }
      const playbackSelect = e.target;
      Store.dispatch({
        type: "SET_PLAYBACK_RATE",
        playbackRate: playbackSelect.value
      });
    }
    async currentTimeChanged(newCurrentTime, audioElement) {
      Store.dispatch({
        type: "UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER",
        progress: new BigNumber(audioElement.currentTime).toString()
      });
      audioElement.currentTime = newCurrentTime;
    }
    async skipBack(audioElement) {
      const newCurrentTime = audioElement.currentTime - 10 < 0 ? 0 : audioElement.currentTime - 10;
      audioElement.currentTime = newCurrentTime;
    }
    async skipForward(audioElement) {
      const newCurrentTime = audioElement.currentTime + 10 >= audioElement.duration ? audioElement.duration - 1 : audioElement.currentTime + 10;
      audioElement.currentTime = newCurrentTime;
    }
    async timeUpdated(currentEpisode, audioElement) {
      this.counter = this.counter + 1;
      if (this.counter < 4) {
        return;
      }
      this.counter = 0;
      const progress = audioElement.currentTime;
      if (progress === 0) {
        return;
      }
      if (audioElement.paused) {
        return;
      }
      Store.dispatch({
        type: "UPDATE_CURRENT_EPISODE_PROGRESS",
        progress: new BigNumber(progress).toString()
      });
    }
    played() {
      Store.dispatch({
        type: "CURRENT_EPISODE_PLAYED"
      });
    }
    paused() {
      Store.dispatch({
        type: "CURRENT_EPISODE_PAUSED"
      });
    }
    async playOrPause(currentEpisode, audioElement) {
      if (this.changingEpisodes === true) {
        return;
      }
      try {
        if (currentEpisode.playing === true) {
          await audioElement.play();
        }
        if (currentEpisode.playing === false) {
          audioElement.pause();
        }
      } catch (error) {
        audioElement.currentTime = parseFloat(currentEpisode.progress);
        console.log(error);
      }
    }
    setupMediaNotification(currentPodcast, currentEpisode, audioElement) {
      const navigator = window.navigator;
      if (navigator.mediaSession !== null && navigator.mediaSession !== void 0) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentEpisode.title,
          artist: currentPodcast.artistName,
          album: currentPodcast.title,
          artwork: [
            {
              src: currentPodcast.imageUrl
            }
          ]
        });
        navigator.mediaSession.setActionHandler("play", () => {
          Store.dispatch({
            type: "CURRENT_EPISODE_PLAYED"
          });
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          Store.dispatch({
            type: "CURRENT_EPISODE_PAUSED"
          });
        });
        navigator.mediaSession.setActionHandler("seekbackward", () => {
          this.skipBack(audioElement);
        });
        navigator.mediaSession.setActionHandler("seekforward", () => {
          this.skipForward(audioElement);
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          Store.dispatch({
            type: "PLAY_PREVIOUS_EPISODE"
          });
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          Store.dispatch({
            type: "PLAY_NEXT_EPISODE"
          });
        });
      }
    }
    render(state) {
      const audioElement = this.querySelector("audio");
      const currentEpisode = state.episodes[state.currentEpisodeGuid];
      const currentPodcast = currentEpisode ? state.podcasts[currentEpisode.feedUrl] : null;
      const duration = currentEpisode && audioElement ? getDuration(audioElement) : "UNKNOWN";
      const progressPercentage = currentEpisode && duration !== "UNKNOWN" ? getProgressPercentage(currentEpisode, duration) : "UNKNOWN";
      const progress = currentEpisode && !isNaN(parseFloat(currentEpisode.progress)) ? parseFloat(currentEpisode.progress) : "UNKNOWN";
      const formattedDuration = duration !== "UNKNOWN" ? secondsToHoursMinutesSeconds(duration) : "UNKNOWN";
      const formattedProgress = progress !== "UNKNOWN" ? secondsToHoursMinutesSeconds(progress) : "UNKNOWN";
      if (state.currentEpisodeChangedManually && currentPodcast !== null && currentPodcast !== void 0 && currentEpisode !== null && currentEpisode !== void 0 && audioElement !== null) {
        this.changingEpisodes = true;
        Store.dispatch({
          type: "SET_CURRENT_EPISODE_CHANGED_MANUALLY",
          currentEpisodeChangedManually: false
        });
        audioElement.currentTime = parseFloat(currentEpisode.progress);
        this.setupMediaNotification(currentPodcast, currentEpisode, audioElement);
        this.changingEpisodes = false;
      }
      if (currentEpisode && audioElement) {
        this.playOrPause(currentEpisode, audioElement);
      }
      return html`
                <style>
                    .pc-player-container {
                        position: fixed;
                        bottom: 0;
                        width: ${state.screenType === "DESKTOP" ? "50vw" : "100vw"};
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
                        <div 
                            style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1;"
                        >
                            <input 
                                @input=${(e) => {
        if (audioElement) {
          this.currentTimeChanged(parseFloat(e.target.value), audioElement);
        }
      }}
                                type="range"
                                style="width: 100%; position: absolute; top: 0; height: 0"
                                min="0"
                                max="${duration}"
                                .value=${progress.toString()}
                                ?hidden=${formattedDuration === "UNKNOWN" || formattedProgress === "UNKNOWN"}
                            >
                        </div>
                        <div style="width: ${progressPercentage}%; position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(1, 1, 1, .1); z-index: -1"></div>
                        <!-- <i 
                            class="material-icons pc-player-play-icon"
                        >
                            skip_previous
                        </i> -->

                        <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center; flex: 1">
                            ${formattedDuration !== "UNKNOWN" && formattedProgress !== "UNKNOWN" ? html`
                                    <div style="font-size: calc(10px + 1vmin);">${formattedProgress === "UNKNOWN" ? "" : formattedProgress}</div>
                                    <div><hr style="width: 100%"></div>
                                    <div style="font-size: calc(10px + 1vmin);">${formattedDuration === "UNKNOWN" ? "" : formattedDuration}</div>                                
                                ` : ""}
                        </div>

                        <div style="flex: 2; display: flex; align-items: center; justify-content: center">
                            <i 
                                class="material-icons pc-player-backward-icon"
                                @click=${() => {
        if (audioElement) {
          this.skipBack(audioElement);
        }
      }}
                            >
                                replay_10
                            </i>

                            ${state.playerPlaying ? html`
                                    <i 
                                        class="material-icons pc-player-play-icon"
                                        @click=${() => this.paused()}
                                    >
                                        pause
                                    </i>
                                ` : html`
                                    <i 
                                        class="material-icons pc-player-play-icon"
                                        @click=${() => this.played()}
                                    >
                                        play_arrow
                                    </i>
                                `}

                            <i 
                                class="material-icons pc-player-forward-icon"
                                @click=${() => {
        if (audioElement) {
          this.skipForward(audioElement);
        }
      }}
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
                            <select @change=${(e) => this.playbackRateChanged(e)} style="border: none; background-color: transparent">
                                <option value=".25" ?selected=${state.playbackRate === ".25"}>.25x</option>
                                <option value=".5" ?selected=${state.playbackRate === ".5"}>.5x</option>
                                <option value=".75" ?selected=${state.playbackRate === ".75"}>.75x</option>
                                <option value="1" ?selected=${state.playbackRate === "1"}>1x</option>
                                <option value="1.25" ?selected=${state.playbackRate === "1.25"}>1.25x</option>
                                <option value="1.5" ?selected=${state.playbackRate === "1.5"}>1.5x</option>
                                <option value="1.75" ?selected=${state.playbackRate === "1.75"}>1.75x</option>
                                <option value="2" ?selected=${state.playbackRate === "2"}>2x</option>
                            </select>
                        </div>
                    </div>


                </div>

                <audio
                    src=${getSrc(currentEpisode, this)}
                    preload="metadata"
                    @ended=${() => {
        if (currentEpisode !== null && currentEpisode !== void 0 && audioElement !== null && audioElement !== void 0) {
          this.audioEnded(currentEpisode, audioElement);
        }
      }}
                    @loadeddata=${() => {
        if (currentEpisode && audioElement) {
          audioElement.currentTime = parseFloat(currentEpisode.progress);
          this.playOrPause(currentEpisode, audioElement);
        }
      }}
                    @timeupdate=${(e) => {
        if (currentEpisode && audioElement) {
          this.timeUpdated(currentEpisode, audioElement);
        }
      }}
                    .playbackRate=${parseFloat(state.playbackRate)}
                    .defaultPlaybackRate=${parseFloat(state.playbackRate)}
                ></audio>
            `;
    }
  }
  window.customElements.define("pc-player", PCPlayer);
  function getSrc(currentEpisode, pcPlayer) {
    if (currentEpisode === null || currentEpisode === void 0) {
      return "";
    }
    if (currentEpisode.downloadState === "DOWNLOADED") {
      return `https://proxy.podcrypt.app/downloaded/${currentEpisode.src}`;
    } else {
      return currentEpisode.src;
    }
  }
  function secondsToHoursMinutesSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const hoursRemainder = seconds % 3600;
    const minutes = Math.floor(hoursRemainder / 60);
    const totalSeconds = Math.floor(hoursRemainder % 60);
    return `${hours === 0 ? "" : `${hours}:`}${minutes < 10 ? `0${minutes}` : minutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`;
  }
  function getDuration(audioElement) {
    if (!isNaN(audioElement.duration)) {
      return audioElement.duration;
    } else {
      return "UNKNOWN";
    }
  }
  function getProgressPercentage(currentEpisode, duration) {
    return parseFloat(currentEpisode.progress) / duration * 100;
  }
});
