/*
 * create by aditya on 28/08/19
*/


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Badge,
    Card,
    Table
} from "react-bootstrap";
import { LOCAL, REMOTE } from './../../services/Urls';
import {
    makeRequest
} from "./../../services/APIService";

class VouchersList extends React.Component {
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
            uri: REMOTE.MERCHANT_VOUCHERS
        }).then(result => {
            this.setState({
                data: result.data.data,
                isLoading: false
            });
        }).catch(console.error);
    }

    handleTableRowClick (index, event) {
        const voucherId = this.state.data.content[index].id;
        this.props.history.push(LOCAL.PURCHASE_ORDER_DETAIL.replace(":voucherId", voucherId));
    }

    static getStatusBadge (status) {
        switch (status) {
            case 'PENDING':
                return (<Badge variant="primary" style={{ padding: '5px' }}>Pending Approval</Badge>);
            case 'REJECTED':
                return (<Badge variant="danger">Order Rejected</Badge>);
            case 'ACCEPTED':
                return (<Badge variant="success">Order ACCEPTED</Badge>);
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
                                <h1>Your vouchers</h1>
                            </div>
                        </div>
                    </div>
                    <div className="adminListing">
                        <div className={"table-responsive-xl text-nowrap"}>
                            <Table className="table-striped" hover>
                                <thead>
                                    <tr>
                                        <th>Voucher ID</th>
                                        <th>Purchase Order ID</th>
                                        <th>Voucher Code</th>
                                        <th>Status</th>
                                        <th>Date Generated</th>
                                        <th>Date Redeemed</th>
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
                                                <td>{d.purchaseOrder.id}</td>
                                                <td>Masked Code</td>
                                                <td>
                                                    <h6>{VouchersList.getStatusBadge(d.status)}</h6>
                                                </td>
                                                <td>{new Date(d.updatedAt).toDateString()}</td>
                                                <td>{new Date(d.redeemedAt)}</td>
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

VouchersList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(VouchersList);
