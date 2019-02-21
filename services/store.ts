import { createStore } from 'redux';

const InitialState = {
    currentRoute: {
        pathname: '/',
        search: '',
        query: {}
    },
    showMainMenu: false,
    currentEpisode: {
        src: ''
    },
    playlist: []
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

    if (action.type === 'SET_CURRENT_EPISODE') {
        return {
            ...state,
            currentEpisode: action.currentEpisode
        };
    }

    if (action.type === 'ADD_EPISODE_TO_PLAYLIST') {
        return {
            ...state,
            playlist: [...state.playlist, action.episode]
        };
    }

    return state;
}

export const Store = createStore(RootReducer);