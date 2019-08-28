/*
 * created by aditya on 2019-08-24
*/

'use strict';

import React from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './style.css';
import MetisMenu from 'react-metismenu';
import NavLink from './navLink';
import { LOCAL } from './../../services/Urls';

const content = [
    {
        icon: 'fas fa-shopping-bag',
        label: 'Purchase Orders',
        to: LOCAL.PURCHASE_ORDERS
    },
    {
        icon: 'fas fa-plus',
        label: 'Create Purchase Order',
        to: LOCAL.CREATE_PURCHASE_ORDER
    },
    {
        icon: 'fas fa-code',
        label: 'Vouchers',
        to: LOCAL.VOUCHERS
    }
];

class SideNavMenu extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            content
        };
    }

    static getDerivedStateFromProps (props, state) {
        if (state && props.id !== state.prevId) {
            return {
                prevId: props.id,
                navItemSelected: props.location.pathname
            };
        }
        return null;
    }

    render () {
        return (
            <div>
                <MetisMenu className="menu"
                    iconNameStateVisible="minus"
                    iconNameStateHidden="plus"
                    content={this.state.content} LinkComponent={NavLink}
                />
            </div>
        );
    }
}

SideNavMenu.propTypes = {
    id: Proptypes.string,
    history: Proptypes.object,
    location: Proptypes.object,
    expanded: Proptypes.bool,
    user: Proptypes.object
};

export default withRouter(SideNavMenu);
