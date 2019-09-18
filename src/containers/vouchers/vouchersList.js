/*
 * create by aditya on 28/08/19
*/


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Badge,
    Card,
    Button,
    Form,
    Table
} from "react-bootstrap";
import { REMOTE } from './../../services/Urls';
import {
    makeRequest
} from "./../../services/APIService";
import Pagination from "react-js-pagination";
import { dateFormatter } from "../../helpers/dateChanger";
// import DatetimeRangePicker from './../../components/datetimerangepicker';
import moment from "moment";

const PAGE_SIZE = 10;

class VouchersList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            activePage: 1,
            startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
            endDate: moment().add(1, 'd').format('YYYY-MM-DD'),
            totalElements: 0,
            totalPages: 0,
            voucherCode: "",
            voucherId: "",
            purchaseOrderId: "",
            data: []
        };
    }

    componentDidMount () {
        debugger;
        this.getVouchers();
    }

    handlePageChange (pageNumber) {
        debugger;
        this.setState({ activePage: pageNumber });
        this.getVouchers(pageNumber);
    }
    handlerInputChange (elementType, event) {
        this.setState({
            [elementType]: event.target.value && typeof event.target.value === 'string' ?
                event.target.value : event.target.value
        });
    }
    showAll (e) {
        e.preventDefault();
        this.setState(
            {
                activePage: 1,
                startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
                endDate: moment().add(1, 'd').format('YYYY-MM-DD'),
                totalElements: 0,
                totalPages: 0,
                voucherCode: "",
                voucherId: "",
                purchaseOrderId: "",
                data: []
            }, () => {
                this.getVouchers();
            }
        );
        return false;
    }
    submitQuery (e) {
        this.setState({
            isButtonDisabled: true
        });
        e.preventDefault();
        this.getVouchers();
    }

    getVouchers (page = 1) {
        debugger;
        makeRequest({
            uri: REMOTE.MERCHANT_VOUCHERS,
            params: {
                page: page, startDate: this.state.startDate, endDate: this.state.endDate, size: PAGE_SIZE,
                voucherId: this.state.voucherId && this.state.voucherId !== '' ? this.state.voucherId : null,
                voucherCode: this.state.voucherCode && this.state.voucherCode !== '' ? this.state.voucherCode : null,
                state: this.state.state !== "all" ? this.state.state : null,
                purchaseOrderId: this.state.purchaseOrderId &&
                this.state.purchaseOrderId !== '' ? this.state.purchaseOrderId : null
            }
        }).then(result => {
            this.setState({
                data: result.data.data,
                totalElements: result.data.totalElement,
                isLoading: false
            });
        }).finally(() => {
            this.setState({
                isButtonDisabled: false
            });
        }).catch(console.error);
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
        const { totalElements, data, voucherId, voucherCode, purchaseOrderId } = this.state;

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

                    <Card.Title>Filter</Card.Title>
                    <Form onSubmit={this.submitQuery.bind(this)}>
                        <div className="row">
                            <div className="col">
                                <Form.Group controlId="formVoucherId">
                                    <Form.Control
                                        type="text" placeholder="Voucher Id"
                                        value={voucherId}
                                        onChange={this.handlerInputChange.bind(this, 'voucherId')}/>
                                </Form.Group>
                            </div>
                            <div className="col">
                                <Form.Group controlId="formVoucherCode">
                                    <Form.Control
                                        type="text" placeholder="Voucher Code"
                                        value={voucherCode}
                                        onChange={this.handlerInputChange.bind(this, 'voucherCode')}/>
                                </Form.Group>
                            </div>
                            <div className="col">
                                <Form.Group controlId="formPurchaseOrderId">
                                    <Form.Control
                                        type="text" placeholder="PurchaseOrder Id"
                                        value={purchaseOrderId}
                                        onChange={this.handlerInputChange.bind(this, 'purchaseOrderId')}/>
                                </Form.Group>
                            </div>
                            <div className="col-xl-4 paddLeft">
                                <Button type={"submit"} disabled={this.state.isButtonDisabled} variant="primary">
                                    <i className="fa fa-search" /> Search
                                </Button>
                                <button type="button" className="btn btn-info btnLeft"
                                    onClick={this.showAll.bind(this)}>
                                    <i className="fa fa-filter" /> Reset Filters
                                </button>
                            </div>
                        </div>
                        <div className="adminListing">
                            <div className={"table-responsive-xl"}>
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
                                                <tr key={index}>
                                                    <td key={"id_" + d.id}>{d.id}</td>
                                                    <td key={"purchaseOrder" + d.id}>{d.purchaseOrder.id}</td>
                                                    <td key={"code" + d.id}>{d.voucherCode}</td>
                                                    <td key={"status" + d.id}>
                                                        <h6>{VouchersList.getStatusBadge(d.state)}</h6>
                                                    </td>
                                                    <td key={"createdAt" + d.id}>{dateFormatter(d.updatedAt)}</td>
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
                    </Form>
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
