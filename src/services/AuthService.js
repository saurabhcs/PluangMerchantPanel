/*
 * created by akul on 2019-06-08
*/

let AuthService = {};
export default AuthService;

import {
    makeRequest
} from "./APIService";
import * as URLS from "./Urls";

const sha256 = require('js-sha256').sha256;

AuthService.ACCESS_TOKEN_KEY = "merchant.pluang.com.token";

AuthService.ACCESS_TOKEN = window.localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);

AuthService.getAccessToken = () => {
    if (!AuthService.ACCESS_TOKEN) {
        AuthService.ACCESS_TOKEN = window.localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);
    }
    return AuthService.ACCESS_TOKEN;
};

AuthService.checkIfLoggedIn = () => {
    AuthService.getAccessToken();
    return !!AuthService.ACCESS_TOKEN;
};

AuthService.login = (email, password) => {
    return new Promise((resolve, reject) => {
        AuthService.logout()
            .then(() => {
                return makeRequest({
                    method: "POST",
                    url: URLS.REMOTE.MERCHANT_LOGIN,
                    data: { email,
                        password: sha256(password)
                    }
                });
            }).then(result => {
                window.localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, result.data.data.token);
                resolve(result.data.data);
            }).catch(reject);
    });
};

AuthService.forgot = (email) => {
    return new Promise((resolve, reject) => {
        makeRequest({
            method: "POST",
            url: URLS.REMOTE.MERCHANT_FORGOT,
            data: { email }
        }).then(result => {
            resolve(result.data);
        }).catch(reject);
    });
};

AuthService.reset = (resetKey, id, password) => {
    return new Promise((resolve, reject) => {
        makeRequest({
            method: "POST",
            url: URLS.REMOTE.ADMIN_RESET,
            data: { reset_key: resetKey, id,
                password: sha256(password)
            }
        }).then(result => {
            resolve(result.data);
        }).catch(error => {
            reject(error.data);
        });
    });
};

AuthService.logout = () => {
    return new Promise((resolve, reject) => {
        const token = AuthService.getAccessToken();
        if (token) {
            makeRequest({
                method: "post",
                url: URLS.REMOTE.MERCHANT_LOGOUT,
                data: {
                    accessToken: window.localStorage.getItem(AuthService.ACCESS_TOKEN_KEY)
                }
            }).then(resp => {
                window.localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
                AuthService.ACCESS_TOKEN = null;
                resolve();
            })
                .catch(reject);
        } else {
            resolve();
        }
    });
};

AuthService.me = () => {
    return new Promise((resolve, reject) => {
        makeRequest({
            url: URLS.REMOTE.ME
        }).then(result => {
            if (!result.data.success || !result.data.data) {
                AuthService.logout();
                reject();
            } else {
                resolve(result.data.data);
            }
        }).catch(error => {
            AuthService.logout();
            reject(error);
        });
    });
};

