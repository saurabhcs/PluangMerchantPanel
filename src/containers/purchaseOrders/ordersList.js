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
    Table,
    Form
} from "react-bootstrap";
import { LOCAL, REMOTE } from './../../services/Urls';
import {
    makeRequest
} from "./../../services/APIService";
import { dateFormatter } from "../../helpers/dateChanger";
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import DatetimeRangePicker from './../../components/datetimerangepicker';
import moment from "moment";
import Pagination from "react-js-pagination";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const PAGE_SIZE = 10;
class PurchaseOrders extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {
                content: []
            },
            activePage: 1,
            startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
            endDate: moment().add(1, 'd').format('YYYY-MM-DD'),
            totalElements: 0,
            totalPages: 0,
            status: "all",
            orderId: "",
            orderReferenceNumber: ""
        };
    }

    componentDidMount () {
        this.getVouchers();
    }
    getVouchers (page = 1) {
        const { dispatch } = this.props;
        dispatch({ type: "PURCHASE_ORDERS_LOADING", isLoading: true });
        dispatch(showLoading());

        makeRequest({
            url: `${REMOTE.MERCHANT_PURCHASE_ORDER}`,
            params: {
                page: page, size: PAGE_SIZE,
                status: this.state.status && this.state.status !== 'all' ? this.state.status : null,
                startDate: this.state.startDate, endDate: this.state.endDate,
                orderReferenceNumber: this.state.orderReferenceNumber &&
                this.state.orderReferenceNumber !== '' ? this.state.orderReferenceNumber : null
            }
        }).then(result => {
            if (result.data && result.data.data) {
                this.setState({
                    activePage: page,
                    data: result.data.data,
                    totalPages: result.data.data.totalPages,
                    totalElements: result.data.data.totalElements
                });
            }
        }).finally(() => {
            console.log("Hello", this.state.data);
            dispatch(hideLoading());
            this.setState({
                isButtonDisabled: false
            });
        });
    }
    submitQuery (e) {
        this.setState({
            isButtonDisabled: true
        });
        e.preventDefault();
        this.getVouchers();
    }
    showAll (e) {
        e.preventDefault();
        this.setState(
            {
                merchantId: "",
                orderReferenceNumber: "",
                startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
                endDate: moment().add(1, 'd').format('YYYY-MM-DD'),
                status: "all"
            }, () => {
                this.getVouchers();
            }
        );
        return false;
    }
    handlerInputChange (elementType, event) {
        this.setState({
            [elementType]: event.target.value && typeof event.target.value === 'string' ?
                event.target.value.trimEnd() : event.target.value
        });
    }
    handleApply (event, picker) {
        debugger;
        this.setState({
            startDate: picker.startDate.format('YYYY-MM-DD'),
            endDate: picker.endDate.format('YYYY-MM-DD')
        });
    }
    handlePageChange (pageNumber) {
        this.setState({ activePage: pageNumber });
        this.getVouchers(pageNumber);
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
                return (<Badge variant="secondary" style={{ padding: '5px' }}>Pending Approval</Badge>);
            case 'REJECTED':
                return (<Badge variant="danger">Order Rejected</Badge>);
            case 'ACCEPTED':
                return (<Badge variant="primary">Order ACCEPTED</Badge>);
            case 'PROCESSED':
                return (<Badge variant="success">Order Processed</Badge>);
            default:
                return status;
        }
    }

    render () {
        const { data, orderReferenceNumber, startDate, endDate, status, totalElements } = this.state;


        return (
            <Card>
                <Card.Body>
                    <div className="mainHeading">
                        <div className="row">
                            <div className="col">
                                <h1>Purchase orders</h1>
                            </div>
                            <div className="col text-right">
                                <Button variant="primary" onClick={this.createOrderButtonHandler.bind(this)}>
                                    <i className="fa fa-plus" /> Create Order
                                </Button>
                            </div>
                        </div>
                    </div>


                    <Card.Title>Filter</Card.Title>
                    <Form onSubmit={this.submitQuery.bind(this)}>
                        <div className="row">
                            <div className="col-md-2 ">
                                <Form.Group controlId="formOrderReferenceId">
                                    <Form.Control
                                        type="text" placeholder="Order Ref No."
                                        value={orderReferenceNumber}
                                        onChange={this.handlerInputChange.bind(this, 'orderReferenceNumber')}/>
                                </Form.Group>
                            </div>
                            <div className="col-md-2">
                                <Form.Group controlId="formStatus">
                                    <Form.Control as="select" value={status}
                                        onChange={this.handlerInputChange.bind(this, 'status')}>
                                        <option value={"all"}>All</option>
                                        <option value={"REJECTED"}>Rejected</option>
                                        <option value={"ACCEPTED"}>Accepted</option>
                                        <option value={"PROCESSED"}>Processed</option>
                                        <option value={"PENDING"}>Pending</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <DatetimeRangePicker
                                        showDropdowns
                                        startDate={moment(startDate, 'YYYY-MM-DD')}
                                        endDate={moment(endDate, 'YYYY-MM-DD')}
                                        maxDate={moment().add(1, 'days')}
                                        onApply={this.handleApply.bind(this)}>
                                        <div className="input-group">
                                            <input
                                                type="text" className="form-control"
                                                value={startDate + " - " + endDate} readOnly/>
                                            <span className="input-group-btn">
                                                <Button style={{
                                                    border: '1px solid',
                                                    borderTopLeftRadius: 0,
                                                    borderBottomLeftRadius: 0,
                                                    borderColor: '#ccc'
                                                }} variant={'default'} className="default date-range-toggle">
                                                    <i className="fa fa-calendar"/>
                                                </Button>
                                            </span>
                                        </div>
                                    </DatetimeRangePicker>
                                </Form.Group>
                            </div>
                            <div className="col-md-3 ">
                                <Button type={"submit"} disabled={this.state.isButtonDisabled} variant="primary">
                                    <i className="fa fa-search" /> Search
                                </Button>
                                <button type="button" className="btn btn-info btnLeft"
                                    onClick={this.showAll.bind(this)}>
                                    <i className="fa fa-filter" /> Reset Filter</button>
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
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { totalElements > 0 ?
                                            data.content.map((d, index) => (
                                                <tr key={index}>
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
                                                        { d.status === "PROCESSED" || d.status === 'PROCESSED' ?
                                                            <a href={d.orderUrl} className="btn btn-success">
                                                                <i className="fa fa-download paddLeft"/>Download
                                                            </a> : <h6>{PurchaseOrders.getStatusBadge(d.status)}</h6>
                                                        }
                                                    </td>
                                                    <td>{dateFormatter(d.createdAt)}</td>
                                                    <td>
                                                        <button title="View" type="button"
                                                            onClick={this.handleTableRowClick.bind(this, index)}
                                                            className="btn btn-primary btnAction">
                                                            <i className="far fa-eye"/>
                                                        </button>
                                                    </td>
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

PurchaseOrders.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    totalElements: PropTypes.number,
    maxDate: PropTypes.string
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
