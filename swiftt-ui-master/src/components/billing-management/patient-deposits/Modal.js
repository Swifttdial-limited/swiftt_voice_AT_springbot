import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Form,
  DatePicker,
  Input,
  InputNumber,
  Button,
  LocaleProvider,
  Tooltip,
  Icon,
  Card,
  Modal,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DepositDefinitionSelect from '../../common/DepositDefinitionSelect';
import PaymentModeSelect from '../../common/accounting/PaymentModeSelect';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

@Form.create()
class AppointmentModal extends PureComponent {

  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
  };

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    checkPaymentReference: false
  };

  handleOk = () => {
    const { form, item, onOk } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        depositRequests: item.depositRequests,
        ...getFieldsValue(),
      };

      if(item.total > 0)
        onOk(data);
    });
  }

  paymentModeSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    setFieldsValue({ 'paymentMode': value });

    if (value && value.paymentReferenceRequired != null) {
      this.setState({ checkPaymentReference: value.paymentReferenceRequired }, () => {
        validateFields(['paymentReference'], { force: true });
      });
    } else {
      this.setState({ checkPaymentReference: false });
    }
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); } else if (!allowPast && allowFuture) { return current && current.valueOf() < Date.now(); }
    };

    const modalOpts = {
      title: 'New Deposit',
      visible,
      width: 640,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Mode of Payment:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('paymentMode', {
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
            <FormItem label="Payment Reference：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('paymentReference', {
                rules: [{
                  required: this.state.checkPaymentReference,
                  message: 'Payment reference is required',
                }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Comment" hasFeedback>
              {getFieldDecorator('comment', {})(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default AppointmentModal;
