/*
 * create by aditya on 2019-08-25
*/

import React from "react";
import {
    Form,
    Button
} from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    LOGIN_EMAIL
} from "./../../reducers/login/index";
import { NotificationManager } from "react-notifications";
import AuthService from "../../services/AuthService";
import Validators from "./../../helpers/validators";
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { LOCAL } from "../../services/Urls";

class Forgot extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            errorMessage: null
        };
    }

    handleSubmitClick (event) {
        event.preventDefault();
        event.stopPropagation();

        const { email } = this.props;
        if (Validators.validateEmail(email)) {
            this.props.dispatch(showLoading());
            AuthService.forgot(email)
                .then((data) => {
                    NotificationManager.success(
                        'An email with new password has been sent!',
                        'Password Reset Done',
                        5000
                    );
                    this.props.history.push(LOCAL.LOGIN);
                })
                .finally(() => {
                    this.props.dispatch(hideLoading());
                });
        } else {
            NotificationManager.error('Please recheck the email entered', 'Email Invalid', 5000);
        }
    }

    handlerInputChange (elementType, event) {
        if (elementType === "email") {
            this.props.dispatch({
                type: LOGIN_EMAIL,
                email: event.target.value.toLowerCase()
            });
        }
    }

    render () {
        return (
            <div className="login-page-container">
                <div className="forgotBox">
                    <div className="adminLogo" />
                    <div className="loginArea">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email"
                                    onChange={this.handlerInputChange.bind(this, 'email')}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleSubmitClick.bind(this)}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

Forgot.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        ...state.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);
