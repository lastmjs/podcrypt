import { createStore } from 'redux';

const InitialState = {
    currentRoute: '/'
};

function RootReducer(state=InitialState, action: any) {
    if (action.type === 'CHANGE_CURRENT_ROUTE') {
        return {
            ...state,
            currentRoute: action.currentRoute
        };
    }

    return state;
}

export const Store = createStore(RootReducer);