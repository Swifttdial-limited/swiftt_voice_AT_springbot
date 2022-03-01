import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Ajax from 'robe-ajax';
import fileDownload from 'react-file-download';
import { Modal, LocaleProvider, Upload, Icon, Alert, message, List } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { API_URL, api } from '../../../utils/config';

const Dragger = Upload.Dragger;
const headers = {
  Authorization: `Bearer ${sessionStorage.getItem('o_t')}`,
};

class ImportModal extends PureComponent {
  static defaultProps = {
    visible: false,
    onCancel: () => {},
    onOk: () => {},
  };

  static propTypes = {
    visible: PropTypes.any,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    validationErrors: [],
  };

  downloadFile = () => {
    Ajax.ajax({
      headers,
      url: `${API_URL + api.contactsImport}`,
      method: 'get',
      contentType: 'text/csv',
    }).then(data => {
      fileDownload(data, 'contacts-import-template.csv', 'text/csv');
    }).fail((error) => {
      console.log(error)
    });
  }

  draggerOnChangeHandler = (info) => {
    const status = info.file.status;
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file import successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file import failed.`);
      this.setState({
        validationErrors: info.file.response.validationErrors ? info.file.response.validationErrors : [],
      });
    }
  }

  render() {
    const { onCancel, onOk, visible } = this.props;

    const { validationErrors } = this.state;

    const modalOpts = {
      title: 'Import Contacts',
      visible,
      footer: null,
      onCancel,
      width: 720,
      wrapClassName: 'vertical-center-modal',
    };

    const props = {
      name: 'file',
      multiple: false,
      showUploadList: true,
      accept: '.csv',
      headers,
      action: `${API_URL + api.contactsImport}`,
      data: {},
      onChange: this.draggerOnChangeHandler,
    };

    const renderValidationErrors = () => {
      return (
        <ul>
          {validationErrors.map((importError, index) => <li key={index}>{importError.fieldName} : {importError.message}</li>)}
        </ul>
      );
    }

    return (
      <Modal {...modalOpts}>
        <Alert
          description={(
            <div>
              To get started you'll need to format contacts in the correct way. Download a template CSV
              <a onClick={this.downloadFile}> here</a>.
            </div>
          )}
          type="info"
          showIcon
          style={{ marginBottom: 10 }}
        />
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Maximum file size is 5MB.</p>
        </Dragger>
        {validationErrors.length > 0 && (
          <Alert
            message="Validation Errors"
            type="error"
            description={renderValidationErrors()} />
        )}
      </Modal>
    );
  }
}

export default ImportModal;
