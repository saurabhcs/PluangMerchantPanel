/*
 * create by aditya on 2019-08-25
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Badge,
    Button,
    Card,
    Table
} from "react-bootstrap";
import { LOCAL, REMOTE } from './../../services/Urls';
import {
    makeRequest
} from "./../../services/APIService";

class PurchaseOrders extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {
                content: []
            }
        };
    }

    componentDidMount () {
        return makeRequest({
            uri: REMOTE.MERCHANT_PURCHASE_ORDER
        }).then(result => {
            this.setState({
                data: result.data.data,
                isLoading: false
            });
        }).catch(console.error);
    }

    createOrderButtonHandler () {
        this.props.history.push(LOCAL.CREATE_PURCHASE_ORDER);
    }

    handleTableRowClick (index, event) {
        const orderId = this.state.data.content[index].id;
        this.props.history.push(LOCAL.PURCHASE_ORDER_DETAIL.replace(":orderId", orderId));
    }

    static getStatusBadge (status) {
        switch (status) {
            case 'PENDING':
                return (<Badge variant="primary" style={{ padding: '5px' }}>Pending Approval</Badge>);
            case 'REJECTED':
                return (<Badge variant="danger">Order Rejected</Badge>);
            case 'APPROVED':
                return (<Badge variant="success">Order Approved</Badge>);
            case 'PROCESSED':
                return (<Badge variant="success">Order Processed</Badge>);
            default:
                return status;
        }
    }

    render () {
        const { isLoading, data } = this.state;

        return (
            <Card>
                <Card.Body>
                    <div className="mainHeading">
                        <div className="row">
                            <div className="col">
                                <h1>Your voucher purchase orders</h1>
                            </div>
                            <div className="col text-right">
                                <Button variant="primary" onClick={this.createOrderButtonHandler.bind(this)}>
                                    <i className="fa fa-plus" /> Create Order
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="adminListing">
                        <div className={"table-responsive-xl text-nowrap"}>
                            <Table className="table-striped" hover>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Order Reference Number</th>
                                        <th>Denominations</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !isLoading && !data.content.length ? (
                                            <tr>
                                                <td colSpan={7} className="noFound">No Data Found</td>
                                            </tr>
                                        ) : null
                                    }
                                    {
                                        data.content.map((d, index) => (
                                            <tr key={index} onClick={this.handleTableRowClick.bind(this, index)}>
                                                <td>{d.id}</td>
                                                <td>{d.orderReferenceNumber}</td>
                                                <td>{
                                                    d.denominations.map((deno, idx) => (
                                                        <div key={idx} style={{ padding: '5px 0' }}>
                                                            <span>{deno.denomination}</span>
                                                            <span style={{ margin: '0 1em' }}>x</span>
                                                            <span>{deno.quantity}</span>
                                                        </div>
                                                    ))
                                                }</td>
                                                <td>
                                                    <h6>{PurchaseOrders.getStatusBadge(d.status)}</h6>
                                                </td>
                                                <td>{new Date(d.createdAt).toDateString()}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

PurchaseOrders.propTypes = {
    history: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrders);
