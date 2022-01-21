import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {StorePromise} from "../state/store.js";
import BigNumber from "../_snowpack/pkg/bignumberjs.js";
import {
  pxXXLarge,
  pxXLarge
} from "../services/css.js";
import {get} from "../_snowpack/pkg/idb-keyval.js";
let audio1Playing = true;
let audio2Playing = false;
let audio1Src = "";
let audio2Src = "";
StorePromise.then((Store) => {
  customElement("pc-player", async ({constructing, update, element}) => {
    if (constructing) {
      Store.subscribe(update);
    }
    const state = Store.getState();
    const audio1Element = element.querySelector("#audio-1");
    const audio2Element = element.querySelector("#audio-2");
    const currentEpisode = state.episodes[state.currentEpisodeGuid];
    const currentPodcast = currentEpisode ? state.podcasts[currentEpisode.feedUrl] : void 0;
    if (currentEpisode && currentPodcast) {
      setupMediaNotification(currentPodcast, currentEpisode, audio1Element, audio2Element);
      await handleEpisodeSwitching(state, currentEpisode, audio1Element, audio2Element);
      await playOrPause(currentEpisode, audio1Element, audio2Element);
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
                    <div style="width: 100%; position: absolute; top: 0; right: 0; height: 100%; background-color: rgba(1, 1, 1, .05); z-index: -1;">
                        <input @input=${(e) => timeSliderOnInput(e, element)} type="range" style="width: 100%; position: absolute; top: 0; height: 0" min="0" max="${getDuration(element)}" .value=${currentEpisode ? currentEpisode.progress : "0"}>
                    </div>
                    <div style="width: ${getProgressPercentage(element)}%; position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(1, 1, 1, .1); z-index: -1"></div>
                    <!-- <i 
                        class="material-icons pc-player-play-icon"
                    >
                        skip_previous
                    </i> -->

                    <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center; flex: 1">
                        <div style="font-size: calc(10px + 1vmin);">${currentEpisode ? secondsToHoursMinutesSeconds(currentEpisode.progress) : ""}</div>
                        <div><hr style="width: 100%"></div>
                        <div style="font-size: calc(10px + 1vmin);">${getDuration(element) ? secondsToHoursMinutesSeconds(getDuration(element)) : ""}</div>
                    </div>

                    <div style="flex: 2; display: flex; align-items: center; justify-content: center">
                        <i 
                            class="material-icons pc-player-backward-icon"
                            @click=${() => skipBack(audio1Element, audio2Element)}
                        >
                            replay_10
                        </i>

                        ${Store.getState().playerPlaying ? html`
                                <i 
                                    class="material-icons pc-player-play-icon"
                                    @click=${paused}
                                >
                                    pause
                                </i>
                            ` : html`
                                <i 
                                    class="material-icons pc-player-play-icon"
                                    @click=${played}
                                >
                                    play_arrow
                                </i>
                            `}

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
                            <option value=".25" ?selected=${Store.getState().playbackRate === ".25"}>.25x</option>
                            <option value=".5" ?selected=${Store.getState().playbackRate === ".5"}>.5x</option>
                            <option value=".75" ?selected=${Store.getState().playbackRate === ".75"}>.75x</option>
                            <option value="1" ?selected=${Store.getState().playbackRate === "1"}>1x</option>
                            <option value="1.25" ?selected=${Store.getState().playbackRate === "1.25"}>1.25x</option>
                            <option value="1.5" ?selected=${Store.getState().playbackRate === "1.5"}>1.5x</option>
                            <option value="1.75" ?selected=${Store.getState().playbackRate === "1.75"}>1.75x</option>
                            <option value="2" ?selected=${Store.getState().playbackRate === "2"}>2x</option>
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
                @timeupdate=${(e) => timeUpdated(e, audio2Element)}
                .playbackRate=${parseInt(Store.getState().playbackRate)}
            ></audio>

            <audio
                id="audio-2"
                src=${audio2Src}
                preload="metadata"
                @loadeddata=${() => loadedData(currentEpisode, audio1Element, audio2Element)}
                @ended=${audio2Ended}
                @timeupdate=${(e) => timeUpdated(e, audio2Element)}
                .playbackRate=${parseInt(Store.getState().playbackRate)}
            ></audio>
        `;
  });
  function setupMediaNotification(currentPodcast, currentEpisode, audio1Element, audio2Element) {
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
        skipBack(audio1Element, audio2Element);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        skipForward(audio1Element, audio2Element);
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
  async function handleEpisodeSwitching(state, currentEpisode, audio1Element, audio2Element) {
    const currentEpisodeGuid = state.currentEpisodeGuid;
    const previousEpisodeGuid = state.previousEpisodeGuid;
    const episodeChanged = currentEpisodeGuid !== previousEpisodeGuid;
    if (episodeChanged) {
      if (audio1Element && audio2Element) {
        audio1Element.pause();
        audio1Element.src = "";
        audio2Element.pause();
        audio2Element.src = "";
        Store.dispatch({
          type: "SET_PREVIOUS_EPISODE_GUID",
          previousEpisodeGuid: currentEpisodeGuid
        });
        const audioSources = await getAudioSources(currentEpisode);
        audio1Src = audioSources.audio1Src;
        audio2Src = audioSources.audio2Src;
        audio1Element.src = audio1Src;
        audio2Element.src = audio2Src;
        setTimeout(() => {
          if (parseInt(currentEpisode.progress) <= audio1Element.duration) {
            audio1Playing = true;
            audio2Playing = false;
            audio1Element.currentTime = parseInt(currentEpisode.progress);
            audio2Element.currentTime = 0;
          }
          if (parseInt(currentEpisode.progress) > audio1Element.duration) {
            audio1Playing = false;
            audio2Playing = true;
            audio1Element.currentTime = 0;
            audio2Element.currentTime = parseInt(currentEpisode.progress) - audio1Element.duration;
          }
          Store.dispatch({
            type: "RENDER"
          });
        }, 1e3);
      }
    }
  }
  function loadedData(currentEpisode, audio1Element, audio2Element) {
    playOrPause(currentEpisode, audio1Element, audio2Element);
  }
  async function playOrPause(currentEpisode, audio1Element, audio2Element) {
    try {
      if (audio1Element && audio2Element && currentEpisode.playing === true) {
        if (audio1Playing) {
          audio2Element.pause();
          await audio1Element.play();
        }
        if (audio2Playing) {
          audio1Element.pause();
          await audio2Element.play();
        }
      }
      if (audio1Element && audio2Element && currentEpisode.playing === false) {
        audio1Element.pause();
        audio2Element.pause();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAudioSources(episode) {
    const arrayBuffer = await get(`${episode.guid}-audio-file-array-buffer`);
    if (arrayBuffer) {
      let middleIndex = Math.floor(arrayBuffer.byteLength / 2);
      const arrayBuffer1 = arrayBuffer.slice(0, middleIndex);
      const arrayBuffer2 = arrayBuffer.slice(middleIndex, arrayBuffer.byteLength);
      const blob1 = new Blob([arrayBuffer1], {type: "audio/mpeg"});
      const blob2 = new Blob([arrayBuffer2], {type: "audio/mpeg"});
      return {
        audio1Src: window.URL.createObjectURL(blob1),
        audio2Src: window.URL.createObjectURL(blob2)
      };
    } else {
      return {
        audio1Src: episode.src,
        audio2Src: "NOT_SET"
      };
    }
  }
  function timeSliderOnInput(e, element) {
    const progress = e.target.value;
    const audio1Element = element.querySelector("#audio-1");
    const audio2Element = element.querySelector("#audio-2");
    if (audio1Element && audio2Element) {
      if (audio1Playing) {
        if (progress <= audio1Element.duration) {
          audio1Element.currentTime = progress;
        } else {
          audio1Playing = false;
          audio2Playing = true;
          audio2Element.currentTime = progress - audio1Element.duration;
        }
      }
      if (audio2Playing) {
        if (progress <= audio1Element.duration) {
          audio1Playing = true;
          audio2Playing = false;
          audio1Element.currentTime = progress;
        } else {
          audio2Element.currentTime = progress - audio1Element.duration;
        }
      }
    }
    Store.dispatch({
      type: "UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER",
      progress: new BigNumber(progress).toString()
    });
  }
  function getProgressPercentage(element) {
    const audio1Element = element.querySelector("#audio-1");
    const audio2Element = element.querySelector("#audio-2");
    const duration = getDuration(element);
    if (audio1Element && audio2Element && !isNaN(duration) && !isNaN(audio1Element.currentTime)) {
      if (audio1Playing) {
        return audio1Element.currentTime / duration * 100;
      }
      if (audio2Playing) {
        return (audio1Element.duration + audio2Element.currentTime) / duration * 100;
      }
    } else {
      return 0;
    }
  }
  function getDuration(element) {
    const audio1Element = element.querySelector("#audio-1");
    const audio2Element = element.querySelector("#audio-2");
    if (audio1Element && audio2Element) {
      if (audio2Src === "NOT_SET") {
        return audio1Element.duration;
      } else {
        return audio1Element.duration + audio2Element.duration;
      }
    }
  }
  function secondsToHoursMinutesSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const hoursRemainder = seconds % 3600;
    const minutes = Math.floor(hoursRemainder / 60);
    const totalSeconds = Math.floor(hoursRemainder % 60);
    return `${hours === 0 ? "" : `${hours}:`}${minutes < 10 ? `0${minutes}` : minutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`;
  }
  function playbackRateChanged(e) {
    Store.dispatch({
      type: "SET_PLAYBACK_RATE",
      playbackRate: e.target.value
    });
  }
  function skipBack(audio1Element, audio2Element) {
    if (audio1Element && audio2Element) {
      if (audio1Playing) {
        audio1Element.currentTime = audio1Element.currentTime - 10;
        Store.dispatch({
          type: "UPDATE_CURRENT_EPISODE_PROGRESS",
          progress: new BigNumber(audio1Element.currentTime).toString()
        });
      }
      if (audio2Playing && audio2Element.currentTime === 0) {
        audio1Playing = true;
        audio2Playing = false;
        audio1Element.currentTime = audio1Element.duration - 10;
        Store.dispatch({
          type: "UPDATE_CURRENT_EPISODE_PROGRESS",
          progress: new BigNumber(audio1Element.duration).toString()
        });
      }
      if (audio2Playing) {
        audio2Element.currentTime = audio2Element.currentTime - 10;
        Store.dispatch({
          type: "UPDATE_CURRENT_EPISODE_PROGRESS",
          progress: new BigNumber(audio1Element.duration + audio2Element.currentTime).toString()
        });
      }
    }
  }
  function skipForward(audio1Element, audio2Element) {
    if (audio1Element && audio2Element) {
      const audioElement = audio1Playing ? audio1Element : audio2Element;
      audioElement.currentTime = audioElement.currentTime + 10;
      Store.dispatch({
        type: "UPDATE_CURRENT_EPISODE_PROGRESS",
        progress: new BigNumber(audioElement.currentTime).toString()
      });
    }
  }
  function audio1Ended() {
    if (audio2Src === "NOT_SET") {
      Store.dispatch({
        type: "CURRENT_EPISODE_COMPLETED"
      });
    } else {
      audio1Playing = false;
      audio2Playing = true;
      Store.dispatch({
        type: "RENDER"
      });
    }
  }
  function audio2Ended() {
    Store.dispatch({
      type: "CURRENT_EPISODE_COMPLETED"
    });
  }
  let counter = 1;
  function timeUpdated(e, audio2Element) {
    const progress = audio1Playing ? e.target.currentTime : e.target.currentTime + audio2Element.duration;
    if (progress === 0) {
      return;
    }
    if (e.target.paused) {
      return;
    }
    if (counter % 4 !== 0) {
      counter = counter + 1;
      return;
    } else {
      counter = 1;
    }
    Store.dispatch({
      type: "UPDATE_CURRENT_EPISODE_PROGRESS",
      progress: new BigNumber(progress).toString()
    });
  }
  function played() {
    Store.dispatch({
      type: "CURRENT_EPISODE_PLAYED"
    });
  }
  function paused() {
    Store.dispatch({
      type: "CURRENT_EPISODE_PAUSED"
    });
  }
});
