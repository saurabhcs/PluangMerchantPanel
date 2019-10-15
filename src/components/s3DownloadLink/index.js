import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { makeRequest } from "../../services/APIService";
import { REMOTE } from "../../services/Urls";
import { hideLoading, showLoading } from "react-redux-loading-bar";
import { downloadFile } from '../../helpers/downloadFile';
import { NotificationManager } from 'react-notifications';

class S3DownloadLink extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    downloadFile () {
        this.setState({
            loading: true
        });
        this.props.showLoading();
        makeRequest({
            url: REMOTE.FILE_DOWNLOAD,
            params: {
                url: this.props.url
            },
            responseType: 'blob',
            ignoreError: true
        }).then(result => {
            if (result && result.data) {
                let urlParts = this.props.url.split('/');
                downloadFile(
                    result.data.Body,
                    result.data.Metadata.originalname || urlParts[urlParts.length - 1] || 'data',
                    result.data.ContentType || 'text/csv'
                );
            }
        })
            .catch(error => {
                console.log(error);
                NotificationManager.error('Error occurred while downloading file');
            })
            .finally(() => {
                this.props.hideLoading();
                this.setState({
                    loading: false
                });
            });
    }

    render () {
        return (<button
            disabled={this.state.loading}
            onClick={this.downloadFile.bind(this)}
            className="btn btn-success">
            <i className="fa fa-download "/> {this.props.label ? this.props.label : 'Download'}
        </button>);
    }
}

S3DownloadLink.propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.string,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        showLoading: () => dispatch(showLoading()),
        hideLoading: () => dispatch(hideLoading())
    };
};

export default connect(null, mapDispatchToProps)(S3DownloadLink);
