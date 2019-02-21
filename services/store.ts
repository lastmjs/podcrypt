import { createStore } from 'redux';

const persistedState = JSON.parse(window.localStorage.getItem('state'));

const InitialState = persistedState || {
    currentRoute: {
        pathname: '/',
        search: '',
        query: {}
    },
    showMainMenu: false,
    currentEpisodeGuid: '',
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

    if (action.type === 'PLAY_EPISODE') {
        return {
            ...state,
            currentEpisodeGuid: action.episode.guid,
            episodes: {
                ...state.episodes,
                [action.episode.guid]: {
                    ...state.episodes[action.episode.guid],
                    ...action.episode
                }
            }
        };
    }

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

        return {
            ...state,
            currentEpisodeGuid,
            currentPlaylistIndex
        };
    }

    if (action.type === 'CURRENT_EPISODE_COMPLETED') {
        const updatedEpisode = {
            ...state.currentEpisode,
            finishedListening: true
        };
        const nextPlaylistIndex = state.currentPlaylistIndex + 1;
        const nextEpisodeGuid = state.playlist[nextPlaylistIndex];
        const nextEpisode = state.episodes[nextEpisodeGuid];

        if (!nextEpisodeGuid) {
            return state;
        }

        return {
            ...state,
            currentEpisode: nextEpisode,
            currentPlaylistIndex: nextPlaylistIndex,
            episodes: {
                ...state.episodes,
                [state.currentEpisode.guid]: updatedEpisode
            }
        };
    }

    return state;
}

export const Store = createStore((state, action) => {
    console.log('action', action);

    const newState = RootReducer(state, action);

    console.log('state', newState);

    window.localStorage.setItem('state', JSON.stringify(newState));

    return newState;
});