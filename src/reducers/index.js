/*
 * created by aditya on 2019-08-24
*/

import { combineReducers } from "redux";
import {
    appStateReducer
} from "./appState/index";
import {
    loginReducer
} from "./login";

import { loadingBarReducer } from 'react-redux-loading-bar';

export default combineReducers({
    appState: appStateReducer,
    login: loginReducer,
    loadingBar: loadingBarReducer
});
