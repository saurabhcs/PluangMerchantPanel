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
import Pagination from "react-js-pagination";
import { dateFormatter } from "../../helpers/dateChanger";

const PAGE_SIZE = 10;

class VouchersList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            data: []
        };
    }

    componentDidMount () {
        this.getVouchers();
    }

    handlePageChange (pageNumber) {
        this.setState({ activePage: pageNumber });
        this.getVouchers(pageNumber);
    }

    getVouchers (page = 1) {
        makeRequest({
            uri: REMOTE.MERCHANT_VOUCHERS,
            params: {
                size: PAGE_SIZE,
                page
            }
        }).then(result => {
            this.setState({
                data: result.data.data,
                totalElements: result.data.totalElement,
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
        const { data, totalElements } = this.state;

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
                                    { totalElements > 0 ?
                                        data.map((d, index) => (
                                            <tr key={index} onClick={this.handleTableRowClick.bind(this, index)}>
                                                <td key={"id_" + d.id}>{d.id}</td>
                                                <td key={"purchaseOrder" + d.id}>{d.purchaseOrder.id}</td>
                                                <td key={"code" + d.id}>{d.voucherCode}</td>
                                                <td key={"status" + d.id}>
                                                    <h6>{VouchersList.getStatusBadge(d.state)}</h6>
                                                </td>
                                                <td key={"createdAt" + d.id}>{dateFormatter(d.createdAt)}</td>
                                                <td key={"redeemedAt" + d.id}>{dateFormatter(d.redeemedAt)}</td>
                                            </tr>
                                        )) :
                                        <tr>
                                            <td colSpan={7} className="noFound">No Data Found</td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>
                        <div className={'row'}>
                            <div className="col-md-12">
                                <div style={{ float: "right" }}>
                                    {
                                        totalElements > PAGE_SIZE ? <Pagination
                                            innerClass={'pagination'}
                                            itemClass={'page-item'}
                                            linkClass={'page-link'}
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={PAGE_SIZE}
                                            totalItemsCount={totalElements - 1 | 1}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange.bind(this)}/> : ''
                                    }
                                </div>
                            </div>
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
