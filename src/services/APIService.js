/*
 * created by akul on 2019-06-08
*/

import axios from "axios";
import AuthService from "./AuthService";

axios.interceptors.request.use((config) => {
    config.headers["Authorization"] = `Bearer ${AuthService.getAccessToken()}`;

    if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

axios.interceptors.response.use((response) => {
    return response;
}, error => {
    if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
        AuthService.logout();
        window.location.reload();
    }
    return error;
});

export function makeRequest (config) {
    return new Promise((resolve, reject) => {
        try {
            axios({
                method: config.method || "get",
                baseURL: config.baseURL ? config.baseUrl : window.Environment.API_BASE,
                url: config.uri || config.url,
                data: config.data,
                headers: config.headers ? config.headers : {},
                params: config.params,
                timeout: config.timeout ? config.timeout : 100000,
                cancelToken: config.cancelToken,
                validateStatus: false
            }).then((result) => {
                if (result && result.status >= 200 && result.status < 300) {
                    resolve(result);
                } else {
                    errorHandler(reject, result, config.ignoreError);
                }
            }).catch(error => {
                errorHandler(reject, error, config.ignoreError);
            });
        } catch (err) {
            reject(err);
        }
    });
}

export function errorHandler (reject, err, ignoreError) {
    if (err.code === "ECONNABORTED") {
        return reject(err);
    }

    if (err.message === 'Network Error') {
        return reject('cannot connect to server');
    }

    // eslint-disable-next-line no-unused-vars
    let msg = JSON.stringify(err.data);

    switch (err.status) {
        case 401:
        case 503:
            AuthService.logout();
            window.location.href = "/";
            break;
        default:
            if (err.data.errors) {
                msg = "Input is invalid for " + Object.keys(err.data.errors).join(", ");
            } else if (err.data.error_message) {
                msg = err.data.error_message;
            }
            return reject(err.data);
    }
    return reject(err.message);
}

