export function PlaylistReducer(state, action) {
  if (action.type === "SET_CURRENT_EPISODE_CHANGED_MANUALLY") {
    return {
      ...state,
      currentEpisodeChangedManually: action.currentEpisodeChangedManually
    };
  }
  if (action.type === "MARK_EPISODE_LISTENED") {
    const newEpisode = {
      ...state.episodes[action.episodeGuid],
      finishedListening: true
    };
    return {
      ...state,
      episodes: {
        ...state.episodes,
        [newEpisode.guid]: newEpisode
      }
    };
  }
  if (action.type === "MARK_EPISODE_UNLISTENED") {
    const newEpisode = {
      ...state.episodes[action.episodeGuid],
      finishedListening: false
    };
    return {
      ...state,
      episodes: {
        ...state.episodes,
        [newEpisode.guid]: newEpisode
      }
    };
  }
  if (action.type === "SET_PREVIOUS_EPISODE_GUID") {
    return {
      ...state,
      previousEpisodeGuid: action.previousEpisodeGuid
    };
  }
  if (action.type === "SET_PLAYBACK_RATE") {
    return {
      ...state,
      playbackRate: action.playbackRate
    };
  }
  if (action.type === "TOGGLE_PLAYBACK_RATE_MENU") {
    return {
      ...state,
      showPlaybackRateMenu: !state.showPlaybackRateMenu
    };
  }
  if (action.type === "ADD_OR_UPDATE_EPISODE") {
    const episodeInState = state.episodes[action.episode.guid];
    const episodeAlreadyExists = episodeInState !== null && episodeInState !== void 0;
    if (episodeAlreadyExists) {
      return {
        ...state,
        episodes: {
          ...state.episodes,
          [action.episode.guid]: {
            ...state.episodes[action.episode.guid],
            title: action.episode.title,
            src: action.episode.src
          }
        },
        podcasts: {
          ...state.podcasts,
          [action.podcast.feedUrl]: {
            ...state.podcasts[action.podcast.feedUrl],
            title: action.podcast.title,
            description: action.podcast.description,
            imageUrl: action.podcast.imageUrl,
            ethereumAddress: action.podcast.ethereumAddress,
            email: action.podcast.email
          }
        }
      };
    } else {
      const podcastInState = state.podcasts[action.podcast.feedUrl];
      const podcastAlreadyExists = podcastInState !== null && podcastInState !== void 0;
      if (podcastAlreadyExists) {
        return {
          ...state,
          episodes: {
            ...state.episodes,
            [action.episode.guid]: action.episode
          },
          podcasts: {
            ...state.podcasts,
            [action.podcast.feedUrl]: {
              ...state.podcasts[action.podcast.feedUrl],
              title: action.podcast.title,
              description: action.podcast.description,
              imageUrl: action.podcast.imageUrl,
              ethereumAddress: action.podcast.ethereumAddress,
              email: action.podcast.email,
              episodeGuids: [...podcastInState.episodeGuids, action.episode.guid]
            }
          }
        };
      } else {
        return {
          ...state,
          episodes: {
            ...state.episodes,
            [action.episode.guid]: action.episode
          },
          podcasts: {
            ...state.podcasts,
            [action.podcast.feedUrl]: {
              ...action.podcast,
              episodeGuids: [action.episode.guid]
            }
          }
        };
      }
    }
  }
  if (action.type === "SUBSCRIBE_TO_PODCAST") {
    const podcastInState = state.podcasts[action.podcast.feedUrl];
    const podcastAlreadyExists = podcastInState !== null && podcastInState !== void 0;
    if (podcastAlreadyExists) {
      return {
        ...state,
        podcasts: {
          ...state.podcasts,
          [action.podcast.feedUrl]: {
            ...state.podcasts[action.podcast.feedUrl],
            artistName: action.podcast.artistName,
            title: action.podcast.title,
            description: action.podcast.description,
            imageUrl: action.podcast.imageUrl,
            ethereumAddress: action.podcast.ethereumAddress,
            email: action.podcast.email
          }
        }
      };
    } else {
      return {
        ...state,
        podcasts: {
          ...state.podcasts,
          [action.podcast.feedUrl]: action.podcast
        }
      };
    }
  }
  if (action.type === "SET_PREPARING_PLAYLIST") {
    return {
      ...state,
      preparingPlaylist: action.preparingPlaylist
    };
  }
  if (action.type === "PLAY_PREVIOUS_EPISODE") {
    const newCurrentPlaylistIndex = state.currentPlaylistIndex - 1 >= 0 ? state.currentPlaylistIndex - 1 : 0;
    if (newCurrentPlaylistIndex === state.currentPlaylistIndex) {
      return state;
    }
    const newCurrentEpisodeGuid = state.playlist[newCurrentPlaylistIndex];
    const newCurrentEpisode = {
      ...state.episodes[newCurrentEpisodeGuid],
      playing: true
    };
    const newCurrentPodcast = {
      ...state.podcasts[newCurrentEpisode.feedUrl],
      lastStartDate: new Date().getTime()
    };
    const oldCurrentEpisode = {
      ...state.episodes[state.currentEpisodeGuid],
      playing: false
    };
    return {
      ...state,
      currentPlaylistIndex: newCurrentPlaylistIndex,
      currentEpisodeGuid: newCurrentEpisodeGuid,
      podcasts: {
        ...state.podcasts,
        [newCurrentPodcast.feedUrl]: newCurrentPodcast
      },
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode,
        [oldCurrentEpisode.guid]: oldCurrentEpisode
      },
      currentEpisodeChangedManually: true
    };
  }
  if (action.type === "PLAY_NEXT_EPISODE") {
    const newCurrentPlaylistIndex = state.currentPlaylistIndex + 1 < state.playlist.length - 1 ? state.currentPlaylistIndex + 1 : state.playlist.length - 1;
    if (newCurrentPlaylistIndex === state.currentPlaylistIndex) {
      return state;
    }
    const newCurrentEpisodeGuid = state.playlist[newCurrentPlaylistIndex];
    const newCurrentEpisode = {
      ...state.episodes[newCurrentEpisodeGuid],
      playing: true
    };
    const newCurrentPodcast = {
      ...state.podcasts[newCurrentEpisode.feedUrl],
      lastStartDate: new Date().getTime()
    };
    const oldCurrentEpisode = {
      ...state.episodes[state.currentEpisodeGuid],
      playing: false
    };
    return {
      ...state,
      currentPlaylistIndex: newCurrentPlaylistIndex,
      currentEpisodeGuid: newCurrentEpisodeGuid,
      podcasts: {
        ...state.podcasts,
        [newCurrentPodcast.feedUrl]: newCurrentPodcast
      },
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode,
        [oldCurrentEpisode.guid]: oldCurrentEpisode
      },
      currentEpisodeChangedManually: true
    };
  }
  if (action.type === "ADD_EPISODE_TO_PLAYLIST") {
    const episodeInPlaylist = state.playlist.includes(action.episode.guid);
    if (episodeInPlaylist) {
      return state;
    } else {
      const episodeInState = state.episodes[action.episode.guid];
      const episodeAlreadyExists = episodeInState !== null && episodeInState !== void 0;
      if (episodeAlreadyExists) {
        return {
          ...state,
          currentEpisodeGuid: state.currentEpisodeGuid === "NOT_SET" ? action.episode.guid : state.currentEpisodeGuid,
          playlist: [...state.playlist, action.episode.guid],
          episodes: {
            ...state.episodes,
            [action.episode.guid]: {
              ...state.episodes[action.episode.guid],
              title: action.episode.title,
              src: action.episode.src
            }
          },
          podcasts: {
            ...state.podcasts,
            [action.podcast.feedUrl]: {
              ...state.podcasts[action.podcast.feedUrl],
              title: action.podcast.title,
              description: action.podcast.description,
              imageUrl: action.podcast.imageUrl,
              ethereumAddress: action.podcast.ethereumAddress,
              email: action.podcast.email
            }
          }
        };
      } else {
        const podcastInState = state.podcasts[action.podcast.feedUrl];
        const podcastAlreadyExists = podcastInState !== null && podcastInState !== void 0;
        if (podcastAlreadyExists) {
          return {
            ...state,
            currentEpisodeGuid: state.currentEpisodeGuid === "NOT_SET" ? action.episode.guid : state.currentEpisodeGuid,
            playlist: [...state.playlist, action.episode.guid],
            episodes: {
              ...state.episodes,
              [action.episode.guid]: action.episode
            },
            podcasts: {
              ...state.podcasts,
              [action.podcast.feedUrl]: {
                ...state.podcasts[action.podcast.feedUrl],
                title: action.podcast.title,
                description: action.podcast.description,
                imageUrl: action.podcast.imageUrl,
                ethereumAddress: action.podcast.ethereumAddress,
                email: action.podcast.email,
                episodeGuids: [...podcastInState.episodeGuids, action.episode.guid]
              }
            }
          };
        } else {
          return {
            ...state,
            currentEpisodeGuid: state.currentEpisodeGuid === "NOT_SET" ? action.episode.guid : state.currentEpisodeGuid,
            playlist: [...state.playlist, action.episode.guid],
            episodes: {
              ...state.episodes,
              [action.episode.guid]: action.episode
            },
            podcasts: {
              ...state.podcasts,
              [action.podcast.feedUrl]: {
                ...action.podcast,
                episodeGuids: [action.episode.guid]
              }
            }
          };
        }
      }
    }
  }
  if (action.type === "PLAY_EPISODE_FROM_PLAYLIST") {
    const newCurrentPlaylistIndex = state.playlist.indexOf(action.episodeGuid);
    const newCurrentEpisodeGuid = state.playlist[newCurrentPlaylistIndex];
    const newCurrentEpisode = state.episodes[newCurrentEpisodeGuid];
    const newCurrentPodcast = state.podcasts[newCurrentEpisode.feedUrl];
    const modifiedNewCurrentEpisode = {
      ...newCurrentEpisode,
      playing: true
    };
    const modifiedNewCurrentPodcast = {
      ...newCurrentPodcast,
      lastStartDate: new Date().getTime()
    };
    if (state.currentEpisodeGuid === "NOT_SET") {
      return {
        ...state,
        currentEpisodeGuid: newCurrentEpisodeGuid,
        currentPlaylistIndex: newCurrentPlaylistIndex,
        playerPlaying: true,
        podcasts: {
          ...state.podcasts,
          [modifiedNewCurrentPodcast.feedUrl]: modifiedNewCurrentPodcast
        },
        episodes: {
          ...state.episodes,
          [modifiedNewCurrentEpisode.guid]: modifiedNewCurrentEpisode
        },
        currentEpisodeChangedManually: true
      };
    } else if (newCurrentEpisodeGuid === state.currentEpisodeGuid) {
      return {
        ...state,
        playerPlaying: true,
        podcasts: {
          ...state.podcasts,
          [modifiedNewCurrentPodcast.feedUrl]: modifiedNewCurrentPodcast
        },
        episodes: {
          ...state.episodes,
          [modifiedNewCurrentEpisode.guid]: modifiedNewCurrentEpisode
        }
      };
    } else {
      const currentEpisode = state.episodes[state.currentEpisodeGuid];
      return {
        ...state,
        currentEpisodeGuid: newCurrentEpisodeGuid,
        currentPlaylistIndex: newCurrentPlaylistIndex,
        playerPlaying: true,
        podcasts: {
          ...state.podcasts,
          [modifiedNewCurrentPodcast.feedUrl]: modifiedNewCurrentPodcast
        },
        episodes: {
          ...state.episodes,
          [modifiedNewCurrentEpisode.guid]: modifiedNewCurrentEpisode,
          [currentEpisode.guid]: {
            ...currentEpisode,
            playing: false
          }
        },
        currentEpisodeChangedManually: true
      };
    }
  }
  if (action.type === "PAUSE_EPISODE_FROM_PLAYLIST") {
    const episodeGuid = action.episodeGuid;
    const isCurrentEpisode = episodeGuid === state.currentEpisodeGuid;
    const episode = state.episodes[episodeGuid];
    const podcast = state.podcasts[episode.feedUrl];
    const podcastLastStartDate = podcast.lastStartDate === "NEVER" ? new Date().getTime() : podcast.lastStartDate;
    const timeDifference = new Date().getTime() - podcastLastStartDate;
    const newEpisode = {
      ...episode,
      playing: false
    };
    const newPodcast = {
      ...podcast,
      timeListenedTotal: podcast.timeListenedTotal + timeDifference,
      timeListenedSincePreviousPayoutDate: podcast.timeListenedSincePreviousPayoutDate + timeDifference
    };
    return {
      ...state,
      playerPlaying: isCurrentEpisode ? false : state.playerPlaying,
      podcasts: {
        ...state.podcasts,
        [newPodcast.feedUrl]: newPodcast
      },
      episodes: {
        ...state.episodes,
        [newEpisode.guid]: newEpisode
      }
    };
  }
  if (action.type === "CURRENT_EPISODE_COMPLETED") {
    const currentEpisode = state.episodes[state.currentEpisodeGuid];
    const currentPodcast = state.podcasts[currentEpisode.feedUrl];
    const newCurrentEpisode = {
      ...currentEpisode,
      finishedListening: true,
      progress: "0",
      playing: false
    };
    const currentPodcastLastStartDate = currentPodcast.lastStartDate === "NEVER" ? new Date().getTime() : currentPodcast.lastStartDate;
    const timeDifference = new Date().getTime() - currentPodcastLastStartDate;
    const newCurrentPodcast = {
      ...currentPodcast,
      timeListenedSincePreviousPayoutDate: currentPodcast.timeListenedSincePreviousPayoutDate + timeDifference,
      timeListenedTotal: currentPodcast.timeListenedTotal + timeDifference
    };
    const nextPlaylistIndex = state.currentPlaylistIndex + 1;
    const nextCurrentEpisodeGuid = state.playlist[nextPlaylistIndex];
    if (!nextCurrentEpisodeGuid) {
      return {
        ...state,
        playerPlaying: false,
        podcasts: {
          ...state.podcasts,
          [newCurrentPodcast.feedUrl]: newCurrentPodcast
        },
        episodes: {
          ...state.episodes,
          [newCurrentEpisode.guid]: newCurrentEpisode
        }
      };
    }
    const nextCurrentEpisode = state.episodes[nextCurrentEpisodeGuid];
    const nextCurrentPodcast = state.podcasts[nextCurrentEpisode.feedUrl];
    const newNextCurrentEpisode = {
      ...nextCurrentEpisode,
      playing: true
    };
    const newNextCurrentPodcast = {
      ...nextCurrentPodcast,
      lastStartDate: new Date().getTime()
    };
    return {
      ...state,
      currentEpisodeGuid: nextCurrentEpisodeGuid,
      currentPlaylistIndex: nextPlaylistIndex,
      playerPlaying: true,
      podcasts: {
        ...state.podcasts,
        [newCurrentPodcast.feedUrl]: newCurrentPodcast,
        [newNextCurrentPodcast.feedUrl]: newNextCurrentPodcast
      },
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode,
        [newNextCurrentEpisode.guid]: newNextCurrentEpisode
      },
      currentEpisodeChangedManually: true
    };
  }
  if (action.type === "UPDATE_CURRENT_EPISODE_PROGRESS") {
    const currentEpisode = state.episodes[state.currentEpisodeGuid];
    const currentPodcast = state.podcasts[currentEpisode.feedUrl];
    const newCurrentEpisode = {
      ...currentEpisode,
      progress: action.progress
    };
    const currentPodcastLastStartDate = currentPodcast.lastStartDate === "NEVER" ? new Date().getTime() : currentPodcast.lastStartDate;
    const timeDifference = new Date().getTime() - currentPodcastLastStartDate;
    const newCurrentPodcast = {
      ...currentPodcast,
      timeListenedSincePreviousPayoutDate: currentPodcast.timeListenedSincePreviousPayoutDate + timeDifference,
      timeListenedTotal: currentPodcast.timeListenedTotal + timeDifference,
      lastStartDate: new Date().getTime()
    };
    return {
      ...state,
      podcasts: {
        ...state.podcasts,
        [newCurrentPodcast.feedUrl]: newCurrentPodcast
      },
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode
      }
    };
  }
  if (action.type === "UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER") {
    const currentEpisode = state.episodes[state.currentEpisodeGuid];
    const newCurrentEpisode = {
      ...currentEpisode,
      progress: action.progress
    };
    return {
      ...state,
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode
      }
    };
  }
  if (action.type === "CURRENT_EPISODE_PLAYED") {
    const currentEpisode = state.episodes[state.currentEpisodeGuid];
    const currentPodcast = state.podcasts[currentEpisode.feedUrl];
    const newCurrentPodcast = {
      ...currentPodcast,
      lastStartDate: new Date().getTime()
    };
    const newCurrentEpisode = {
      ...currentEpisode,
      playing: true
    };
    return {
      ...state,
      playerPlaying: true,
      podcasts: {
        ...state.podcasts,
        [newCurrentPodcast.feedUrl]: newCurrentPodcast
      },
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode
      }
    };
  }
  if (action.type === "CURRENT_EPISODE_PAUSED") {
    const currentEpisode = state.episodes[state.currentEpisodeGuid];
    const currentPodcast = state.podcasts[currentEpisode.feedUrl];
    const currentPodcastLastStartDate = currentPodcast.lastStartDate === "NEVER" ? new Date().getTime() : currentPodcast.lastStartDate;
    const timeDifference = new Date().getTime() - currentPodcastLastStartDate;
    const newCurrentPodcast = {
      ...currentPodcast,
      timeListenedTotal: currentPodcast.timeListenedTotal + timeDifference,
      timeListenedSincePreviousPayoutDate: currentPodcast.timeListenedSincePreviousPayoutDate + timeDifference
    };
    const newCurrentEpisode = {
      ...currentEpisode,
      playing: false
    };
    return {
      ...state,
      playerPlaying: false,
      podcasts: {
        ...state.podcasts,
        [newCurrentPodcast.feedUrl]: newCurrentPodcast
      },
      episodes: {
        ...state.episodes,
        [newCurrentEpisode.guid]: newCurrentEpisode
      }
    };
  }
  if (action.type === "REMOVE_EPISODE_FROM_PLAYLIST") {
    const playlistIndex = state.playlist.indexOf(action.episodeGuid);
    return {
      ...state,
      currentPlaylistIndex: state.currentPlaylistIndex > playlistIndex ? state.currentPlaylistIndex - 1 : state.currentPlaylistIndex,
      playlist: state.playlist.filter((episodeGuid, index) => {
        return playlistIndex !== index;
      })
    };
  }
  if (action.type === "MOVE_EPISODE_UP") {
    const playlistIndex = state.playlist.indexOf(action.episodeGuid);
    return {
      ...state,
      currentPlaylistIndex: getCurrentPlaylistIndexAfterMoveUp(state, playlistIndex),
      playlist: state.playlist.map((episodeGuid, index) => {
        if (playlistIndex === 0) {
          return episodeGuid;
        }
        if (index === playlistIndex - 1) {
          return state.playlist[playlistIndex];
        }
        if (index === playlistIndex) {
          return state.playlist[playlistIndex - 1];
        }
        return episodeGuid;
      })
    };
  }
  if (action.type === "MOVE_EPISODE_DOWN") {
    const playlistIndex = state.playlist.indexOf(action.episodeGuid);
    return {
      ...state,
      currentPlaylistIndex: getCurrentPlaylistIndexAfterMoveDown(state, playlistIndex),
      playlist: state.playlist.map((episodeGuid, index) => {
        if (playlistIndex === state.playlist.length - 1) {
          return episodeGuid;
        }
        if (index === playlistIndex + 1) {
          return state.playlist[playlistIndex];
        }
        if (index === playlistIndex) {
          return state.playlist[playlistIndex + 1];
        }
        return episodeGuid;
      })
    };
  }
  if (action.type === "SET_CURRENT_EPISODE") {
    const newCurrentPlaylistIndex = state.playlist.indexOf(action.episode.guid);
    const newCurrentEpisodeGuid = action.episode.guid;
    return {
      ...state,
      currentPlaylistIndex: newCurrentPlaylistIndex,
      currentEpisodeGuid: newCurrentEpisodeGuid
    };
  }
  if (action.type === "SET_AUDIO_1_PLAYING") {
    return {
      ...state,
      audio1Playing: action.audio1Playing
    };
  }
  if (action.type === "SET_AUDIO_2_PLAYING") {
    return {
      ...state,
      audio2Playing: action.audio2Playing
    };
  }
  if (action.type === "SET_AUDIO_1_SRC") {
    return {
      ...state,
      audio1Src: action.audio1Src
    };
  }
  if (action.type === "SET_AUDIO_2_SRC") {
    return {
      ...state,
      audio2Src: action.audio2Src
    };
  }
  if (action.type === "SET_CURRENT_EPISODE_DOWNLOAD_INDEX") {
    return {
      ...state,
      currentEpisodeDownloadIndex: action.currentEpisodeDownloadIndex
    };
  }
  return state;
}
function getCurrentPlaylistIndexAfterMoveUp(state, playlistIndex) {
  if (playlistIndex === state.currentPlaylistIndex && playlistIndex !== 0) {
    return state.currentPlaylistIndex - 1;
  }
  if (playlistIndex === state.currentPlaylistIndex + 1) {
    return state.currentPlaylistIndex + 1;
  }
  return state.currentPlaylistIndex;
}
function getCurrentPlaylistIndexAfterMoveDown(state, playlistIndex) {
  if (playlistIndex === state.currentPlaylistIndex && playlistIndex !== state.playlist.length - 1) {
    return state.currentPlaylistIndex + 1;
  }
  if (playlistIndex === state.currentPlaylistIndex - 1) {
    return state.currentPlaylistIndex - 1;
  }
  return state.currentPlaylistIndex;
}
