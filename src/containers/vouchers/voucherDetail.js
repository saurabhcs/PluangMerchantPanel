/*
 * create by aditya on 28/08/19
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Card,
    Form,
    Badge
} from "react-bootstrap";
import { LOCAL, REMOTE } from './../../services/Urls';
import {
    makeRequest
} from "./../../services/APIService";
import { NotificationManager } from "react-notifications";

class VoucherDetail extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            order: null
        };
    }

    componentDidMount () {
        const { voucherId } = this.props.match.params;

        makeRequest({
            uri: REMOTE.MERCHANT_VOUCHER_DETAIL.replace(":id", voucherId)
        }).then(result => {
            if (result.data.success) {
                this.setState({
                    isLoading: false,
                    voucher: result.data.data
                });
            } else {
                NotificationManager.error('Ops! Something went wrong', 'Sorry for the inconvenience', 5000);
                this.props.history.push(LOCAL.VOUCHERS);
            }
        }).catch(error => {
            debugger;
            if (error.error_message) {
                NotificationManager.error(error.error_message, 'There seems to be some problem', 5000);
            } else {
                NotificationManager.error('Ops! Something went wrong', 'Sorry for the inconvenience', 5000);
            }
            this.props.history.push(LOCAL.VOUCHERS);
        });
    }

    render () {
        const { voucher } = this.state;
        if (!voucher) {
            return (<div/>);
        }
        const { status } = voucher;
        let statusSection = {
            badge: '',
            description: ''
        };
        switch (status) {
            case 'ALLOCATED':
                statusSection.badge = (<Badge variant="primary">Unsold</Badge>);
                break;
            case 'REDEEMED':
                statusSection.badge = (<Badge variant="success">Redeemed</Badge>);
                statusSection.description = (
                    <div className="order-status-description">
                        Voucher has been redeemed
                    </div>
                );
                break;
            case 'EXPIRED':
                statusSection.badge = (<Badge variant="danger">Expired</Badge>);
                statusSection.description = (
                    <div className="order-status-description">
                        Voucher has been expired
                    </div>
                );
                break;
            case 'DEACTIVATED':
                statusSection.badge = (<Badge variant="success">Deactivated</Badge>);
                statusSection.description = (
                    <div className="order-status-description">
                        Voucher has been deactivated
                    </div>
                );
        }

        return (
            <div>
                <Card>
                    <Card.Body>
                        <div className="formHeading">
                            Voucher Details &nbsp;<span className="">{statusSection.badge}</span>
                        </div>
                        <div className="workingArea">
                            <div className="row">
                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>
                                            Voucher Status
                                        </Form.Label>
                                        <div>
                                            {statusSection.badge}
                                            {statusSection.description}
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

VoucherDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(VoucherDetail);

