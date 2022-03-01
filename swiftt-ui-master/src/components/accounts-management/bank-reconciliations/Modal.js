import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Checkbox,
  Input,
  InputNumber,
  Modal,
  LocaleProvider,
  Tooltip,
  Icon,
  Row,
  Col,
  DatePicker,
} from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import { query } from '../../../services/accounting/bankReconciliations';
import PaymentModeSelect from '../../common/accounting/PaymentModeSelect';

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class BankReconciliationFormormModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  paymentModeSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    setFieldsValue({ beginningBalance: 0.00 });
    setFieldsValue({ paymentMode: value });

    if (value) {
      query({
        account: value.assetAccount.publicId,
        size: 1,
      }).then((response) => {
        if (response.content.length > 0) {
          setFieldsValue({ beginningBalance: response.content[0].statementEndingBalance });
        }
      })
    }
  }

  render() {
    const {
      visible,
      type,
      item = {},
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

    const paymentModeSelectProps = {
      multiSelect: false,
      bank: true,
    };

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); }
      else if (!allowPast && allowFuture) {
        return current && current.valueOf() > Date.now();
      }
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
      title: `${type === 'create' ? 'New Bank Reconciliation' : 'Edit Bank Reconciliation'}`,
      visible,
      width: 720,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>

            { type === 'create' && (
              <div>
                <FormItem label="Payment Mode:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('paymentMode', {
                    initialValue: item.paymentMode,
                    rules: [
                        {
                            required: true,
                            message: 'Payment mode must be specified',
                        },
                    ],
                  })(<PaymentModeSelect
                      {...paymentModeSelectProps}
                      editValue={item.paymentMode ? item.paymentMode.name : null}
                      onPaymentModeSelect={this.paymentModeSelectHandler} />)}
                </FormItem>

                <FormItem label="Beginning Balance" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('beginningBalance', {
                    initialValue: item.beginningBalance,
                    rules: [
                      {
                        required: true,
                        message: 'Beginning balance must be specified'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
              </div>
            )}

            <FormItem label="Statement Reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('statementReference', {
                initialValue: item.statementReference,
                rules: [
                  {
                    required: true,
                    message: 'Bank statement reference must be specified'
                  }
                ]
              })(<Input />)}
            </FormItem>

            <FormItem label="Statement Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('statementEndingDate', {
                initialValue: item.statementEndingDate ? moment(item.statementEndingDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                rules: [
                  {
                      type: 'object',
                      required: true,
                      message: 'Statement ending date must be specified',
                  },
                ],
              })(<DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate} />)}
            </FormItem>

            <FormItem label="Statement Ending Balance" hasFeedback {...formItemLayout}>
              {getFieldDecorator('statementEndingBalance', {
                initialValue: item.statementEndingBalance,
                rules: [
                  {
                    required: true,
                    message: 'Bank statement ending balance must be specified'
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>

          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default BankReconciliationFormormModal;
