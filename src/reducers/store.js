/*
 * created by aditya on 2019-08-24
*/

import {
    createStore,
    applyMiddleware,
    compose
} from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import reducers from "./index";

let middleware = [thunk, logger];

export function configureStore () {
    // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const composeEnhancers = compose;
    return createStore(
        reducers,
        composeEnhancers(applyMiddleware(...middleware))
    );
}
