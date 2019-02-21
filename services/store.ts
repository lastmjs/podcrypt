import { createStore } from 'redux';

const persistedState = JSON.parse(window.localStorage.getItem('state'));

const InitialState = persistedState || {
    currentRoute: {
        pathname: '/',
        search: '',
        query: {}
    },
    showMainMenu: false,
    currentEpisodeGuid: null,
    previousEpisodeGuid: null, // TODO I might not need this at all
    playlist: [],
    currentPlaylistIndex: 0,
    episodes: {}
};

function RootReducer(state=InitialState, action: any) {
    if (action.type === 'CHANGE_CURRENT_ROUTE') {
        return {
            ...state,
            currentRoute: action.currentRoute
        };
    }

    if (action.type === 'TOGGLE_SHOW_MAIN_MENU') {
        return {
            ...state,
            showMainMenu: !state.showMainMenu
        }
    }

    // if (action.type === 'PLAY_EPISODE') {
    //     return {
    //         ...state,
    //         currentEpisodeGuid: action.episode.guid,
    //         previousEpisodeGuid: state.episode.guid,
    //         episodes: {
    //             ...state.episodes,
    //             [action.episode.guid]: {
    //                 ...state.episodes[action.episode.guid],
    //                 ...action.episode
    //             }
    //         }
    //     };
    // }

    if (action.type === 'ADD_EPISODE_TO_PLAYLIST') {
        return {
            ...state,
            playlist: [...state.playlist, action.episode.guid],
            episodes: {
                ...state.episodes,
                [action.episode.guid]: {
                    ...state.episodes[action.episode.guid],
                    ...action.episode
                }
            }
        };
    }

    if (action.type === 'PLAY_EPISODE_FROM_PLAYLIST') {
        const currentPlaylistIndex = action.playlistIndex;
        const currentEpisodeGuid = state.playlist[currentPlaylistIndex];
        const previousEpisodeGuid = state.currentPlaylistIndex === action.playlistIndex ? state.previousEpisodeGuid : state.currentEpisodeGuid;

        return {
            ...state,
            currentEpisodeGuid,
            previousEpisodeGuid,
            currentPlaylistIndex
        };
    }

    if (action.type === 'CURRENT_EPISODE_COMPLETED') {
        const nextPlaylistIndex = state.currentPlaylistIndex + 1;
        const nextEpisodeGuid = state.playlist[nextPlaylistIndex];

        if (!nextEpisodeGuid) {
            return {
                ...state,
                episodes: {
                    ...state.episodes,
                    [state.currentEpisodeGuid]: {
                        ...state.episodes[state.currentEpisodeGuid],
                        finishedListening: true
                    }
                }
            };
        }

        return {
            ...state,
            currentEpisodeGuid: nextEpisodeGuid,
            previousEpisodeGuid: state.currentEpisodeGuid,
            currentPlaylistIndex: nextPlaylistIndex,
            episodes: {
                ...state.episodes,
                [state.currentEpisodeGuid]: {
                    ...state.episodes[state.currentEpisodeGuid],
                    finishedListening: true
                }
            }
        };
    }

    if (action.type === 'UPDATE_CURRENT_EPISODE_PROGRESS') {
        return {
            ...state,
            episodes: {
                ...state.episodes,
                [state.currentEpisodeGuid]: {
                    ...state.episodes[state.currentEpisodeGuid],
                    progress: action.progress
                }
            }
        };
    }

    if (action.type === 'CURRENT_EPISODE_PLAYED') {
        return {
            ...state,
            episodes: {
                ...state.episodes,
                [state.currentEpisodeGuid]: {
                    ...state.episodes[state.currentEpisodeGuid],
                    playing: true
                }
            }
        };
    }

    if (action.type === 'CURRENT_EPISODE_PAUSED') {
        return {
            ...state,
            episodes: {
                ...state.episodes,
                [state.currentEpisodeGuid]: {
                    ...state.episodes[state.currentEpisodeGuid],
                    playing: false
                }
            }
        };
    }

    return state;
}

export const Store = createStore((state, action) => {

    if (action.type !== 'UPDATE_CURRENT_EPISODE_PROGRESS') {
        console.log('action', action);
    }

    const newState = RootReducer(state, action);

    if (action.type !== 'UPDATE_CURRENT_EPISODE_PROGRESS') {
        console.log('state', newState);
    }

    window.localStorage.setItem('state', JSON.stringify(newState));

    return newState;
});