import { createStore } from 'redux';

const InitialState = {
    currentRoute: {
        pathname: '/',
        search: '',
        query: {}
    },
    previousRoute: null,
    showMainMenu: false
};

function RootReducer(state=InitialState, action: any) {
    if (action.type === 'CHANGE_CURRENT_ROUTE') {
        return {
            ...state,
            currentRoute: action.currentRoute,
            previousRoute: state.currentRoute
        };
    }

    if (action.type === 'TOGGLE_SHOW_MAIN_MENU') {
        return {
            ...state,
            showMainMenu: !state.showMainMenu
        }
    }

    return state;
}

export const Store = createStore(RootReducer);