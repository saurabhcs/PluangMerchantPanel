/*
 * created by aditya on 2019-08-24
*/

'use strict';

import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import "./style.css";
import AuthService from "../../services/AuthService";
import { APP_STATE_USER } from "../../reducers/appState";

export default class Header extends React.Component {
    constructor (props) {
        super(props);
    }

    logout () {
        AuthService.logout();
        this.props.dispatch({
            type: APP_STATE_USER,
            user: null,
            loggedIn: false
        });
    }

    render () {
        const { user } = this.props;
        return (

            <Navbar className="top-header">
                <div className="logoArea"><img src={require('../../assets/images/logo.png')}/></div>
                <div className="navbar-header"/>
                <div className="mr-auto navbar-nav">

                    <div className="row">
                        {user.name}
                    </div>

                </div>

                <div className="navbar-nav">
                    <Button variant="outline-primary" onClick={this.logout.bind(this)}>logout</Button>
                </div>
            </Navbar>

        );
    }
}

Header.propTypes = {
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};
