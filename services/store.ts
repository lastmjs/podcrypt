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
        const query = parseQueryString(action.currentRoute.search);

        // TODO we are moving the query string parsing into redux
        // TODO we will then pass in query parameters as properties to elements that need them during routing
        // TODO that is how an element can update when the url updates

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

function parseQueryString(queryString) {
    return queryString.split('&').reduce((result, keyAndValue) => {
        const keyAndValueArray = keyAndValue.split('=');
        const key = keyAndValueArray[0];
        const value = keyAndValueArray[1];
        return {
            ...result,
            [key]: value
        };
    }, {});
}