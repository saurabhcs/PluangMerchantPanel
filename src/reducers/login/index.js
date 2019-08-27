/*
 * created by akul on 2019-06-08
*/

export const LOGIN_EMAIL = "LOGIN_EMAIL";
export const LOGIN_PASSWORD = "LOGIN_PASSWORD";
export const LOGIN_IS_LOADING = "LOGIN_IS_LOADING";

let defaultState = {
    isLoading: false,
    email: "",
    password: ""
};

export function loginReducer (state = defaultState, action) {
    switch (action.type) {
        case LOGIN_EMAIL:
            return {
                ...state,
                email: action.email
            };
        case LOGIN_PASSWORD:
            return {
                ...state,
                password: action.password
            };
        case LOGIN_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        default:
            return state;
    }
}
