/*
 * create by aditya on 2019-08-26
*/

import React from 'react';
import PropTypes from 'prop-types';
import { LOCAL } from "../../services/Urls";

class Home extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.history.push(LOCAL.PURCHASE_ORDERS);
    }

    render () {
        return (
            <div/>
        );
    }
}

Home.propTypes = {
    history: PropTypes.object.isRequired
};

export default Home;
