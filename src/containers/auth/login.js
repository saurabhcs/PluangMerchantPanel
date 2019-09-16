/*
 * create by aditya on 2019-08-24
*/

'use strict';

import React from "react";
import {
    Form,
    Button
} from "react-bootstrap";
import "./style.css";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    LOGIN_EMAIL,
    LOGIN_PASSWORD
} from "./../../reducers/login/index";
import {
    APP_STATE_USER
} from "./../../reducers/appState/index";
import AuthService from "../../services/AuthService";
import Validators from "./../../helpers/validators";
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link } from 'react-router-dom';
import { LOCAL } from "../../services/Urls";

class Login extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showError: false,
            errorMessage: null
        };
    }

    setError (showError, errorMessage) {
        this.setState({
            showError,
            errorMessage
        });
    }

    handleSubmitClick (event) {
        event.preventDefault();
        event.stopPropagation();

        const { email, password } = this.props;
        if (Validators.validateEmail(email) && Validators.validatePassword(password)) {
            this.props.dispatch(showLoading());
            this.setError(false, "");

            AuthService.login(email, password)
                .then((data) => {
                    this.props.dispatch({
                        type: APP_STATE_USER,
                        user: data.user,
                        loggedIn: true
                    });
                    this.props.history.push(LOCAL.PURCHASE_ORDERS);
                })
                .catch((error) => {
                    this.setError(true, error.error_message);
                })
                .finally(() => {
                    this.props.dispatch(hideLoading());
                });
        } else {
            this.setError(true, "Please check your input");
        }
    }

    handlerInputChange (elementType, event) {
        if (elementType === "email") {
            this.props.dispatch({
                type: LOGIN_EMAIL,
                email: event.target.value.toLowerCase()
            });
        } else {
            this.props.dispatch({
                type: LOGIN_PASSWORD,
                password: event.target.value
            });
        }
    }

    render () {
        const { showError } = this.state;
        return (
            <div className="login-page-container">
                <div className="loginBox">

                    <div className="adminLogo"/>
                    <div className="loginArea">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email"
                                    onChange={this.handlerInputChange.bind(this, 'email')}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                    onChange={this.handlerInputChange.bind(this, 'password')}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleSubmitClick.bind(this)}>
                                Submit
                            </Button>
                        </Form>
                        <div className="forgotPass"><Link to={LOCAL.FORGOT}> Forgot Password?</Link></div>
                        {showError ? (
                            <div className="invalid">Invalid email or password</div>
                        ) : ""}

                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        ...state.login,
        loggedIn: state.appState.loggedIn
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
