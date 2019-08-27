/*
 * created by akul on 2019-06-08
*/

export const APP_STATE_LOGIN = "APP_STATE_LOGIN";
export const APP_STATE_USER = "APP_STATE_USER";

let defaultState = {
    loggedIn: false,
    user: null
};

export function appStateReducer (state = defaultState, action) {
    switch (action.type) {
        case APP_STATE_LOGIN:
            return {
                ...state,
                loggedIn: action.loggedIn
            };
        case APP_STATE_USER:
            return {
                ...state,
                user: action.user,
                loggedIn: action.loggedIn
            };
        default:
            return state;
    }
}
