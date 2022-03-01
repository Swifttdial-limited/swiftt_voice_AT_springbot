import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  LocaleProvider,
  Row,
  Col,
} from 'antd';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import PaymentModeSelect from '../../common/accounting/PaymentModeSelect';

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

const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

@Form.create()
class PatientDepositModal extends PureComponent {
  static defaultProps = {
    item: {},
    onOk: () => {},
    onCancel: () => {},
  };

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    checkPaymentReference: false
  };

  paymentModeSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    setFieldsValue({ 'reversalPaymentMode': value });

    if (value && value.paymentReferenceRequired != null) {
      this.setState({ checkPaymentReference: value.paymentReferenceRequired }, () => {
        validateFields(['paymentReference'], { force: true });
      });
    } else {
      this.setState({ checkPaymentReference: false });
    }
  }

  render() {
    const {
      visible,
      item = {},
      type,
      onOk,
      onCancel,
      form
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue,
    } = form;

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); }
      else if (!allowPast && allowFuture) { return current && current.valueOf() < Date.now(); }
    };

    function handleOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = {
          ...getFieldsValue(),
        };

        onOk(data);
      });
    }

    const modalOpts = {
      title: 'Patient Deposit Refund',
      visible,
      width: 640,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
      okText: 'Refund',
      cancelText: 'Close',
    };

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Mode of Payment:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reversalPaymentMode', {
                rules: [
                  {
                    required: true,
                    message: 'Mode of Payment must be specified',
                  },
                ],
              })(<PaymentModeSelect
                bank={false}
                cashier={true}
                onPaymentModeSelect={this.paymentModeSelectHandler} />)}
            </FormItem>
            <FormItem label="Payment Reference：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('paymentReference', {
                rules: [{
                  required: this.state.checkPaymentReference,
                  message: 'Payment reference is required',
                }],
              })(<Input />)}
            </FormItem>
            {/*
              <FormItem label="Payment Date:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('paymentDate', {
                  rules: [
                    {
                      required: true,
                      message: 'Payment date must be specified',
                    },
                  ],
                })(<DatePicker format={dateFormat} disabledDate={disabledDate} style={{ float: 'left' }} />)}
              </FormItem>
              <FormItem label="Deposit Amount:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('depositedAmount', {
                  rules: [
                    {
                      required: true,
                      message: 'Received deposit amount must be specified',
                    },
                  ],
                })(<InputNumber min={item.total} />)}
              </FormItem>
            */}
            <FormItem {...formItemLayout} label="Comment" hasFeedback>
              {getFieldDecorator('comment', {})(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default PatientDepositModal;
