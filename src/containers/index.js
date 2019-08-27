/*
 * create by aditya on 2019-08-24
*/

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { LOCAL } from "../services/Urls";

import _404 from "./../components/_404";
import SideNavMenu from "./../components/sideNavMenu";
import Header from "./../components/header";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotPassword";
import PurchaseOrders from "./purchaseOrders/ordersList";
import CreatePurchaseOrder from './purchaseOrders/createPurchaseOrder';
import PurchaseOrderDetail from './purchaseOrders/puchaseOrderDetail';
import Home from './home';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            navOpen: true
        };
    }

    render () {
        const { loggedIn, user, dispatch } = this.props;
        const { navOpen } = this.state;

        if (!loggedIn) {
            return (
                <Router>
                    <Switch>
                        <Route path={LOCAL.FORGOT} component={ForgotPassword}/>
                        <Route path="*" component={Login}/>
                    </Switch>
                </Router>
            );
        } else {
            const margin = navOpen ? '240px' : '60px';
            return (
                <Router>
                    <SideNavMenu user={user}/>
                    <div>
                        <div style={{ marginLeft: margin }}>
                            <Header user={user} dispatch={dispatch}/>
                            <div style={{ margin: '1em' }}>
                                <Switch>
                                    <Route path={LOCAL.CREATE_PURCHASE_ORDER} component={CreatePurchaseOrder}/>
                                    <Route path={LOCAL.PURCHASE_ORDER_DETAIL} component={PurchaseOrderDetail}/>
                                    <Route path={LOCAL.PURCHASE_ORDERS} component={PurchaseOrders}/>
                                    <Route path={LOCAL.HOME} component={Home}/>
                                    <Route path="*" component={_404} user={user}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </Router>
            );
        }
    }
}

App.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        ...state.appState
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
