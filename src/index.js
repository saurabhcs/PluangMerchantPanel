/*
 * created by aditya on 2019-08-24
*/

'use strict';

import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";

import "./../node_modules/react-bootstrap/dist/react-bootstrap.min";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";

import 'bootstrap/dist/css/bootstrap.css';
import "./assets/style/index.css";

import { configureStore } from "./reducers/store";

import AuthService from "./services/AuthService";
import {
    APP_STATE_USER
} from "./reducers/appState";
import App from "./containers";
import LoadingBar from "react-redux-loading-bar";

import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

const store = configureStore();

const Panel = () => {
    return (
        <Provider store={store}>
            <NotificationContainer />
            <LoadingBar style={{ backgroundColor: '#FFD700', height: '5px', zIndex: 100 }}/>
            <App/>
        </Provider>
    );
};

function render () {
    ReactDOM.render(
        <Panel/>,
        document.getElementById('root')
    );
}

if (AuthService.checkIfLoggedIn()) {
    AuthService.me()
        .then(result => {
            store.dispatch({
                type: APP_STATE_USER,
                user: result,
                loggedIn: true
            });
        })
        .catch(error => {
            store.dispatch({
                type: APP_STATE_USER,
                user: null,
                loggedIn: false
            });
        })
        .finally(() => {
            render();
        });
} else {
    render();
}
