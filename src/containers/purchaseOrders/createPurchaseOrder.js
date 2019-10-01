/*
 * create by aditya on 2019-08-25
*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Card,
    Form,
    Button
} from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    makeRequest
} from "./../../services/APIService";
import { LOCAL, REMOTE } from "./../../services/Urls";
import Validators from "../../helpers/validators";

const VOUCHER_DENOMINATIONS = [{
    displayValue: "20K",
    value: 20000
}, {
    displayValue: "25K",
    value: 25000
}, {
    displayValue: "50K",
    value: 50000
}, {
    displayValue: "100K",
    value: 100000
}, {
    displayValue: "200K",
    value: 200000
}, {
    displayValue: "500K",
    value: 500000
}, {
    displayValue: "1jt'",
    value: 1000000
}];

class CreatePurchaseOrder extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            isButtonDisabled: false,
            orderReferenceNumber: "",
            validated: false,
            errors: {}
        };
    }

    static placePurchaseOrder (data) {
        return new Promise(((resolve, reject) => {
            makeRequest({
                method: "POST",
                uri: REMOTE.MERCHANT_PURCHASE_ORDER,
                data
            }).then(result => {
                if (result.data.success) {
                    NotificationManager.success("We will process the order shortly!", "Order Received", 10000);
                    resolve();
                } else {
                    reject();
                }
            }).catch(error => {
                if (error.error_message) {
                    NotificationManager.error(error.error_message);
                } else {
                    NotificationManager.error("Ops! Something went wrong");
                }
                reject(error);
            });
        }));
    }

    handleSubmit (event) {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        this.setState({
            validated: true
        });
        if (form.checkValidity()) {
            if (!this.state.isLoading) {
                let data = {
                    orderReferenceNumber: form.orderReferenceNumber.value,
                    denominations: {},
                    description: form.description.value
                };
                let valuesValid = false;
                for (let i = 1; i < form.length - 2; i++) {
                    const val = parseInt(form[i].value, 10);
                    // eslint-disable-next-line max-depth
                    if (val > 0) {
                        valuesValid = true;
                        data.denominations[VOUCHER_DENOMINATIONS[i - 1].value] = val;
                    }
                }
                if (!Validators.validateText(data.orderReferenceNumber)) {
                    this.setState({
                        validated: false
                    });
                    return NotificationManager.error('Length Should be between 4-10/Special Char not Allowed',
                        'Order Reference Number');
                }
                if (!valuesValid) {
                    this.setState({
                        validated: false
                    });
                    // eslint-disable-next-line max-len
                    return NotificationManager.error('Select at-least one denomination', 'No denominations selected', 5000);
                }
                this.setState({
                    isLoading: true
                });
                showLoading();

                CreatePurchaseOrder.placePurchaseOrder(data)
                    .then(() => {
                        this.props.history.push(LOCAL.PURCHASE_ORDERS);
                    })
                    .catch(() => {
                        hideLoading();
                        this.setState({
                            isLoading: false
                        });
                    });
            }
        }
    }

    pushBack () {
        this.props.history.push("../");
    }

    render () {
        const { errors, validated, isLoading } = this.state;

        return (
            <Card>
                <Card.Body>
                    <div className="formHeading">Create Voucher Purchase Order</div>
                    <Form
                        noValidate
                        onSubmit={this.handleSubmit.bind(this)}
                        disabled={this.state.isButtonDisabled}
                        validated={validated}>
                        <div className="workingArea">
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="orderReferenceNumber">
                                        <Form.Label>
                                            Order Reference Number <span className={"redStar"}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Unique number to identify the PO"
                                            name={"orderReferenceNumber"}
                                            isValid={validated}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.orderReferenceNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>
                                            Voucher Denominations
                                        </Form.Label>
                                        <div style={{ textAlign: 'center', width: '50%' }}>
                                            {
                                                VOUCHER_DENOMINATIONS.map((voucher, index) => (
                                                    <div key={index} className="row" style={{ padding: '0.5em' }}>
                                                        <div className="col-3">
                                                            <span style={{ verticalAlign: "sub" }}>
                                                                {voucher.displayValue}
                                                            </span>
                                                        </div>
                                                        <div className="col-3">
                                                            <span style={{ verticalAlign: "middle" }}>x</span>
                                                        </div>
                                                        <div className="col-4">
                                                            <Form.Control
                                                                style={{ textAlign: "center" }}
                                                                type="number"
                                                                min={0}
                                                                max={10000}
                                                                defaultValue={0}
                                                                name={`quantity${index}`}
                                                                isValid={validated}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="description">
                                        <Form.Label>
                                            Description
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            type="text"
                                            placeholder="Any more information you would like to provide"
                                            name={"description"}
                                            isValid={validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Button type="submit" disabled={isLoading}>Place Order</Button>
                                    <button type="button" className="btn btn-warning btnLeft"
                                        onClick={this.pushBack.bind(this)}>
                                        <i className="fa fa-reply" /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

CreatePurchaseOrder.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreatePurchaseOrder);
