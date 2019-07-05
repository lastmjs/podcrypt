export function PlaylistReducer(
    state: Readonly<State>, 
    action:
        SetPlaybackRateAction |
        TogglePlaybackRateMenuAction |
        SubscribeToPodcastAction |
        SetPreparingPlaylistAction |
        PlayPreviousEpisodeAction |
        PlayNextEpisodeAction |
        AddEpisodeToPlaylistAction |
        PlayEpisodeFromPlaylistAction |
        PauseEpisodeFromPlaylistAction |
        CurrentEpisodeCompletedAction |
        UpdateCurrentEpisodeProgressAction |
        UpdateCurrentEpisodeProgressFromSliderAction |
        CurrentEpisodePlayedAction |
        CurrentEpisodePausedAction |
        RemoveEpisodeFromPlaylistAction |
        MoveEpisodeUpAction |
        MoveEpisodeDownAction |
        SetCurrentEpisodeAction |
        SetPreviousEpisodeGuidAction |
        MarkEpisodeListenedAction |
        MarkEpisodeUnlistenedAction
): Readonly<State> {

    if (action.type === 'MARK_EPISODE_LISTENED') {

        const newEpisode: Readonly<Episode> = {
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

    if (action.type === 'MARK_EPISODE_UNLISTENED') {

        const newEpisode: Readonly<Episode> = {
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

    if (action.type === 'SET_PREVIOUS_EPISODE_GUID') {
        return {
            ...state,
            previousEpisodeGuid: action.previousEpisodeGuid
        };
    }

    if (action.type === 'SET_PLAYBACK_RATE') {
        return {
            ...state,
            playbackRate: action.playbackRate
        };
    }

    if (action.type === 'TOGGLE_PLAYBACK_RATE_MENU') {
        return {
            ...state,
            showPlaybackRateMenu: !state.showPlaybackRateMenu
        };
    }

    // if (action.type === 'PLAY_EPISODE') {
    //     return {
    //         ...state,
    //         currentEpisodeGuid: action.episode.guid,
    //         episodes: {
    //             ...state.episodes,
    //             [action.episode.guid]: {
    //                 ...state.episodes[action.episode.guid],
    //                 ...action.episode
    //             }
    //         }
    //     };
    // }

    if (action.type === 'SUBSCRIBE_TO_PODCAST') {
        const podcastInState: Readonly<Podcast> = state.podcasts[action.podcast.feedUrl];
        const podcastAlreadyExists: boolean = podcastInState !== null && podcastInState !== undefined;

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
        }
        else {
            return {
                ...state,
                podcasts: {
                    ...state.podcasts,
                    [action.podcast.feedUrl]: action.podcast
                }
            };
        }
    }

    if (action.type === 'SET_PREPARING_PLAYLIST') {
        return {
            ...state,
            preparingPlaylist: action.preparingPlaylist
        };
    }

    if (action.type === 'PLAY_PREVIOUS_EPISODE') {
        const newCurrentPlaylistIndex: number = state.currentPlaylistIndex - 1 >= 0 ? state.currentPlaylistIndex - 1 : 0;
        
        if (newCurrentPlaylistIndex === state.currentPlaylistIndex) {
            return state;
        }
        
        const newCurrentEpisodeGuid: EpisodeGuid = state.playlist[newCurrentPlaylistIndex];
        const newCurrentEpisode: Readonly<Episode> = {
            ...state.episodes[newCurrentEpisodeGuid],
            playing: true
        };
        const newCurrentPodcast = {
            ...state.podcasts[newCurrentEpisode.feedUrl],
            lastStartDate: new Date().getTime()

        };
        const oldCurrentEpisode: Readonly<Episode> = {
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
            }
        };
    }

    if (action.type === 'PLAY_NEXT_EPISODE') {
        const newCurrentPlaylistIndex: number = state.currentPlaylistIndex + 1 < state.playlist.length - 1 ? state.currentPlaylistIndex + 1 : state.playlist.length - 1;
        
        if (newCurrentPlaylistIndex === state.currentPlaylistIndex) {
            return state;
        }
        
        const newCurrentEpisodeGuid: EpisodeGuid = state.playlist[newCurrentPlaylistIndex];
        const newCurrentEpisode: Readonly<Episode> = {
            ...state.episodes[newCurrentEpisodeGuid],
            playing: true
        };
        const newCurrentPodcast = {
            ...state.podcasts[newCurrentEpisode.feedUrl],
            lastStartDate: new Date().getTime()

        };
        const oldCurrentEpisode: Readonly<Episode> = {
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
            }
        };
    }

    if (action.type === 'ADD_EPISODE_TO_PLAYLIST') {
        const episodeInPlaylist: boolean = state.playlist.includes(action.episode.guid);

        if (episodeInPlaylist) {
            return state;
        }
        else {
            const episodeInState: Readonly<Episode> = state.episodes[action.episode.guid];
            const episodeAlreadyExists: boolean = episodeInState !== null && episodeInState !== undefined;

            if (episodeAlreadyExists) {
                return {
                    ...state,
                    currentEpisodeGuid: state.currentEpisodeGuid === 'NOT_SET' ? action.episode.guid : state.currentEpisodeGuid,
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
            }
            else {
                const podcastInState: Readonly<Podcast> = state.podcasts[action.podcast.feedUrl];
                const podcastAlreadyExists: boolean = podcastInState !== null && podcastInState !== undefined;

                if (podcastAlreadyExists) {
                    return {
                        ...state,
                        currentEpisodeGuid: state.currentEpisodeGuid === 'NOT_SET' ? action.episode.guid : state.currentEpisodeGuid,
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
                }
                else {
                    return {
                        ...state,
                        currentEpisodeGuid: state.currentEpisodeGuid === 'NOT_SET' ? action.episode.guid : state.currentEpisodeGuid,
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

    if (action.type === 'PLAY_EPISODE_FROM_PLAYLIST') {
        const newCurrentPlaylistIndex: number = state.playlist.indexOf(action.episodeGuid);
        const newCurrentEpisodeGuid: EpisodeGuid = state.playlist[newCurrentPlaylistIndex];
        const newCurrentEpisode: Readonly<Episode> = state.episodes[newCurrentEpisodeGuid];
        const newCurrentPodcast: Readonly<Podcast> = state.podcasts[newCurrentEpisode.feedUrl];

        const modifiedNewCurrentEpisode: Readonly<Episode> = {
            ...newCurrentEpisode,
            playing: true
        };

        const modifiedNewCurrentPodcast: Readonly<Podcast> = {
            ...newCurrentPodcast,
            lastStartDate: new Date().getTime()
        };

        // TODO this is dirty clean it up
        if (state.currentEpisodeGuid === 'NOT_SET') {
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
                }
            };
        }
        else if (newCurrentEpisodeGuid === state.currentEpisodeGuid) {
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
        }
        else {
            const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];

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
                }
            };
        }
    }

    if (action.type === 'PAUSE_EPISODE_FROM_PLAYLIST') {
        const episodeGuid: EpisodeGuid = action.episodeGuid;
        const isCurrentEpisode: boolean = episodeGuid === state.currentEpisodeGuid;

        const episode: Readonly<Episode> = state.episodes[episodeGuid];
        const podcast: Readonly<Podcast> = state.podcasts[episode.feedUrl];

        const podcastLastStartDate: Milliseconds = podcast.lastStartDate === 'NEVER' ? new Date().getTime() : podcast.lastStartDate;
        const timeDifference: Milliseconds = new Date().getTime() - podcastLastStartDate;    

        const newEpisode: Readonly<Episode> = {
            ...episode,
            playing: false
        };

        const newPodcast: Readonly<Podcast> = {
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

    if (action.type === 'CURRENT_EPISODE_COMPLETED') {
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const currentPodcast: Readonly<Podcast> = state.podcasts[currentEpisode.feedUrl];
        
        const newCurrentEpisode: Readonly<Episode> = {
            ...currentEpisode,
            finishedListening: true,
            progress: '0',
            playing: false
        };

        const currentPodcastLastStartDate: Milliseconds = currentPodcast.lastStartDate === 'NEVER' ? new Date().getTime() : currentPodcast.lastStartDate;
        const timeDifference: Milliseconds = new Date().getTime() - currentPodcastLastStartDate;

        const newCurrentPodcast: Readonly<Podcast> = {
            ...currentPodcast,
            timeListenedSincePreviousPayoutDate: currentPodcast.timeListenedSincePreviousPayoutDate + timeDifference,
            timeListenedTotal: currentPodcast.timeListenedTotal + timeDifference
        };

        const nextPlaylistIndex: number = state.currentPlaylistIndex + 1;
        const nextCurrentEpisodeGuid: EpisodeGuid = state.playlist[nextPlaylistIndex];

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

        const nextCurrentEpisode: Readonly<Episode> = state.episodes[nextCurrentEpisodeGuid];
        const nextCurrentPodcast: Readonly<Podcast> = state.podcasts[nextCurrentEpisode.feedUrl];

        const newNextCurrentEpisode: Readonly<Episode> = {
            ...nextCurrentEpisode,
            playing: true
        };

        const newNextCurrentPodcast: Readonly<Podcast> = {
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
            }
        };
    }

    if (action.type === 'UPDATE_CURRENT_EPISODE_PROGRESS') {
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const currentPodcast: Readonly<Podcast> = state.podcasts[currentEpisode.feedUrl];

        const newCurrentEpisode: Readonly<Episode> = {
            ...currentEpisode,
            progress: action.progress
        };

        const currentPodcastLastStartDate: Milliseconds = currentPodcast.lastStartDate === 'NEVER' ? new Date().getTime() : currentPodcast.lastStartDate;
        const timeDifference: Milliseconds = new Date().getTime() - currentPodcastLastStartDate;    

        const newCurrentPodcast: Readonly<Podcast> = {
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

    if (action.type === 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER') {
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const newCurrentEpisode: Readonly<Episode> = {
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

    if (action.type === 'CURRENT_EPISODE_PLAYED') {
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const currentPodcast: Readonly<Podcast> = state.podcasts[currentEpisode.feedUrl];

        const newCurrentPodcast: Readonly<Podcast> = {
            ...currentPodcast,
            lastStartDate: new Date().getTime()
        };

        const newCurrentEpisode: Readonly<Episode> = {
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

    if (action.type === 'CURRENT_EPISODE_PAUSED') {
        const currentEpisode: Readonly<Episode> = state.episodes[state.currentEpisodeGuid];
        const currentPodcast: Readonly<Podcast> = state.podcasts[currentEpisode.feedUrl];

        const currentPodcastLastStartDate: Milliseconds = currentPodcast.lastStartDate === 'NEVER' ? new Date().getTime() : currentPodcast.lastStartDate;
        const timeDifference: Milliseconds = new Date().getTime() - currentPodcastLastStartDate;

        const newCurrentPodcast: Readonly<Podcast> = {
            ...currentPodcast,
            timeListenedTotal: currentPodcast.timeListenedTotal + timeDifference,
            timeListenedSincePreviousPayoutDate: currentPodcast.timeListenedSincePreviousPayoutDate + timeDifference
        };

        const newCurrentEpisode: Readonly<Episode> = {
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

    if (action.type === 'REMOVE_EPISODE_FROM_PLAYLIST') {
        const playlistIndex = state.playlist.indexOf(action.episodeGuid);

        return {
            ...state,
            currentPlaylistIndex: state.currentPlaylistIndex > playlistIndex ? state.currentPlaylistIndex - 1 : state.currentPlaylistIndex,
            playlist: state.playlist.filter((episodeGuid: string, index: number) => {
                return playlistIndex !== index;
            })
        };
    }

    if (action.type === 'MOVE_EPISODE_UP') {
        const playlistIndex = state.playlist.indexOf(action.episodeGuid);

        return {
            ...state,
            currentPlaylistIndex: getCurrentPlaylistIndexAfterMoveUp(state, playlistIndex),
            playlist: state.playlist.map((episodeGuid: string, index: number) => {
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

    if (action.type === 'MOVE_EPISODE_DOWN') {

        const playlistIndex = state.playlist.indexOf(action.episodeGuid);

        return {
            ...state,
            currentPlaylistIndex: getCurrentPlaylistIndexAfterMoveDown(state, playlistIndex),
            playlist: state.playlist.map((episodeGuid: string, index: number) => {
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

    if (action.type === 'SET_CURRENT_EPISODE') {
        const newCurrentPlaylistIndex: number = state.playlist.indexOf(action.episode.guid);
        const newCurrentEpisodeGuid: EpisodeGuid = action.episode.guid;

        return {
            ...state,
            currentPlaylistIndex: newCurrentPlaylistIndex,
            currentEpisodeGuid: newCurrentEpisodeGuid
        };
    }

    return state;
}

function getCurrentPlaylistIndexAfterMoveUp(state: Readonly<State>, playlistIndex: number): number {

    if (
        playlistIndex === state.currentPlaylistIndex &&
        playlistIndex !== 0
    ) {
        return state.currentPlaylistIndex - 1;
    }

    if (
        playlistIndex === state.currentPlaylistIndex + 1
    ) {
        return state.currentPlaylistIndex + 1;
    }

    return state.currentPlaylistIndex;
}

function getCurrentPlaylistIndexAfterMoveDown(state: Readonly<State>, playlistIndex: number) {

    if (
        playlistIndex === state.currentPlaylistIndex &&
        playlistIndex !== state.playlist.length - 1
    ) {
        return state.currentPlaylistIndex + 1;
    }

    if (
        playlistIndex === state.currentPlaylistIndex - 1
    ) {
        return state.currentPlaylistIndex - 1;
    }

    return state.currentPlaylistIndex;
}