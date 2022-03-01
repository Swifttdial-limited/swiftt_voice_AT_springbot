import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Ajax from 'robe-ajax';
import fileDownload from 'react-file-download';
import {
  Modal,
  LocaleProvider,
  Upload,
  Icon,
  Alert,
  message,
  Form,
  Input,
  DatePicker,
  List,
} from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import { API_URL, api } from '../../../utils/config';

const Dragger = Upload.Dragger;
const headers = {
  Authorization: `Bearer ${sessionStorage.getItem('o_t')}`,
};
const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;
const disabledDate = (current) => {
  if (allowPast) {
    return current && current.valueOf() > Date.now();
  } else if (!allowPast && allowFuture) {
    return current && current.valueOf() < Date.now();
  }
};
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

let payload = {};

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
      url: `${API_URL + api.journalsImport}`,
      method: 'get',
      contentType: 'text/csv',
    }).then(data => {
      fileDownload(data, 'journals-import-template.csv', 'text/csv');
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
    const { form, onCancel, onOk, visible } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const { validationErrors } = this.state;

    const modalOpts = {
      title: 'Import Journal Entries',
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
      action: `${API_URL + api.journalsImport}`,
      data: payload,
      beforeUpload(file, fileList) {
        validateFields((errors) => {
          if (errors) {
            return false;
          }
          payload = {
            ...getFieldsValue(),
          };
        });
      },
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
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Reference：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transactionReference', {
                rules: [],
             })(<Input />)}
            </FormItem>
            <FormItem label="Transaction Date：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transactionDate', {
                initialValue: moment(moment().format(dateFormat), dateFormat),
                rules: [
                  {
                    type: 'object',
                    required: true,
                    message: 'Transaction date must be specified',
                  }
                ],
             })(
               <DatePicker
                 format={dateFormat}
                 disabledDate={disabledDate}
               />
             )}
            </FormItem>
            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                rules: [],
             })(<TextArea rows={2} />)}
            </FormItem>
          </Form>
          <Alert
            description={(
              <div>
                To get started you will need to format journal entries in the correct way. Download a template CSV
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
            <p className="ant-upload-hint">Maximum file size is 2MB.</p>
          </Dragger>
          {validationErrors.length > 0 && (
            <Alert
              message="Validation Errors"
              type="error"
              description={renderValidationErrors()} />
          )}
        </Modal>
      </LocaleProvider>
    );
  }
}

export default Form.create()(ImportModal);
