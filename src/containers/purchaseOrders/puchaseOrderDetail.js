/*
 * create by aditya on 2019-08-27
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Card,
    Form,
    Table,
    Badge
} from "react-bootstrap";
import { LOCAL, REMOTE } from './../../services/Urls';
import {
    makeRequest
} from "./../../services/APIService";
import { NotificationManager } from "react-notifications";

class PurchaseOrderDetail extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            order: null
        };
    }

    componentDidMount () {
        const { orderId } = this.props.match.params;

        makeRequest({
            uri: REMOTE.MERCHANT_PURCHASE_ORDER_DETAIL.replace(":id", orderId)
        }).then(result => {
            if (result.data.success) {
                this.setState({
                    isLoading: false,
                    order: result.data.data
                });
            } else {
                NotificationManager.error('Ops! Something went wrong', 'Sorry for the inconvenience', 5000);
                this.props.history.push(LOCAL.PURCHASE_ORDERS);
            }
        }).catch(error => {
            debugger;
            if (error.error_message) {
                NotificationManager.error(error.error_message, 'There seems to be some problem', 5000);
            } else {
                NotificationManager.error('Ops! Something went wrong', 'Sorry for the inconvenience', 5000);
            }
            this.props.history.push(LOCAL.PURCHASE_ORDERS);
        });
    }

    render () {
        const { order } = this.state;
        if (!order) {
            return (<div/>);
        }
        const { id, orderReferenceNumber, denominations, status,
            rejectionReason, description, createdAt, orderUrl } = order;
        let statusSection = {
            badge: '',
            description: ''
        };
        switch (status) {
            case 'PENDING':
                statusSection.badge = (<Badge variant="primary">Pending Approval</Badge>);
                statusSection.description = (
                    <div className="order-status-description">Your order will be processed shortly</div>
                );
                break;
            case 'REJECTED':
                statusSection.badge = (<Badge variant="danger">Order Rejected</Badge>);
                statusSection.description = (<div className="order-status-description">{rejectionReason}</div>);
                break;
            case 'ACCEPTED':
                statusSection.badge = (<Badge variant="success">Order Accepted</Badge>);
                statusSection.description = (
                    <div className="order-status-description">
                        Your order has been accepted and will be processed shortly
                    </div>
                );
                break;
            case 'PROCESSED':
                statusSection.badge = (<Badge variant="success">Order Processed</Badge>);
                statusSection.description = (
                    <div className="order-status-description">
                        An email with voucher code has been sent to your registered email
                    </div>
                );
        }

        return (
            <div>
                <Card>
                    <Card.Body>
                        <div className="mainHeading">
                            <div className="row">
                                <div className="col-lg-5">
                                    <h5>Purchase Order Detail</h5>
                                </div>
                                <div className="col aignM">
                                    {
                                        status === 'PROCESSED' && <div className="col aignM">
                                            <a href={orderUrl} className="btn btn-success">
                                                <i className="fa fa-download paddLeft"/>Download
                                            </a>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={"row"}>
                            { <div className={"col"}><Table>
                                <tbody>
                                    <tr>
                                        <td>Order Status</td>
                                        <td>{statusSection.badge}</td>
                                    </tr>
                                    <tr>
                                        <td>Purchase Order Id</td>
                                        <td>{id}</td>
                                    </tr>
                                    <tr>
                                        <td>Order Date</td>
                                        <td>{new Date(createdAt).toDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Order Reference Number</td>
                                        <td>{orderReferenceNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>{description ? description : 'N/A'}</td>
                                    </tr>
                                    {status === 'REJECTED' && <tr>
                                        <td>Rejection Reason</td>
                                        <td>{statusSection.description}</td>
                                    </tr> }
                                </tbody>
                            </Table>
                            </div>
                            }
                        </div>
                        <div className="workingArea">
                            <div className="row">
                                <div className="col-8">
                                    <Form.Label>
                                        Voucher Denominations
                                    </Form.Label>
                                    <Table striped bordered hover style={{ textAlign: 'center' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '50%' }}>Denomination</th>
                                                <th style={{ width: '50%' }}>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                denominations.map((d, idx) => (
                                                    <tr key={idx}>
                                                        <td>{d.denomination}</td>
                                                        <td>{d.quantity}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        {this.state.alert}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

PurchaseOrderDetail.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderDetail);
