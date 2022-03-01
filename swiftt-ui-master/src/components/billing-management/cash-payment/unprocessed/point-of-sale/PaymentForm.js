import propTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import PaymentModeSelect from '../../../../common/accounting/PaymentModeSelect';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

class PaymentForm extends PureComponent {


  state = {
    paymentReferenceRequired: false,
  }

  render() {
    const { form, billableTotal } = this.props;
    const { getFieldDecorator, setFieldsValue, validateFields, getFieldsError, getFieldValue } = form;

    let changeAmount = 0;
    let paymentMode = getFieldValue('paymentMode');


    const paymentModeSelectHandler = (value) => {
      setFieldsValue({ receivedAmount: 0 });
      setFieldsValue({ changeAmount: 0 });
      setFieldsValue({ paymentMode: value });

      if (value !== null && value.paymentReferenceRequired !== undefined) {
        this.setState({
          paymentReferenceRequired: value.paymentReferenceRequired
        }, () => {
          this.props.form.validateFields(['paymentReference'], { force: true });
        });
      }
    };
    const calculateChange = (value) => {
      if (paymentMode) {
        if (paymentMode.tradingCurrency && paymentMode.tradingCurrency && paymentMode.tradingCurrency.currency) {
          changeAmount = (value * 1) - ((billableTotal / paymentMode.tradingCurrency.rate) * 1);
        } else {
          changeAmount = (value * 1) - (billableTotal * 1);
        }
        setFieldsValue({ changeAmount });
        validateFields(['changeAmount'], { force: true });
      }
    };
    const validatePayableAmountIsPaidFully = (rule, value, callback) => {
      if (changeAmount < 0) {
        callback([new Error('You need to pay the full payable amount')]);
      } else {
        callback();
      }
    };
    return (
      <Form>
        <FormItem label="Mode of Payment：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('paymentMode', {
            rules: [
              {
                required: true,
                message: 'Mode of Payment must be specified',
              },
            ],
          })(
            <PaymentModeSelect
              bank={false}
              cashier={true}
              onPaymentModeSelect={paymentModeSelectHandler}
            />)}
        </FormItem>


        <FormItem
          label="Payment Reference"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('paymentReference', {
            rules: [
              {
                required: this.state.paymentReferenceRequired,
                message: 'Please input the payment reference ',
              }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="Received Amount"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('receivedAmount', {
            rules: [
              {
                required: true, message: 'Please input the amount paid by customer',
              }],
          })(
            <InputNumber size={"large"} min={0} onChange={e => calculateChange(e)} />
          )}
        </FormItem>
        <FormItem
          label="Change"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('changeAmount', {
            initialValue: changeAmount,
            rules: [
              {
                required: true, message: 'Please input your ',
              },
              {
                validator: validatePayableAmountIsPaidFully,
              },
            ],
          })(
            <InputNumber size={"large"} disabled />
          )}
        </FormItem>
      </Form>

    );
  }
}


export default (Form.create({
  onValuesChange(props, changedValues, allValues) {
    props.onChange(allValues);
    // prop.handleFormValueChange(allValues);
  },
})(PaymentForm));

