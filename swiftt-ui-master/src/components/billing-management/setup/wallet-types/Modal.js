import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Radio, Modal, Tooltip, Icon, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PriceListSelect from '../../../common/PriceListSelect';
import SchemeCascader from '../../../common/SchemeCascader';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class WalletTypeModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    schemeCascaderDisabled: true,
  };

  handleOk = () => {
    const { form, onOk } = this.props;
    const { validateFields, getFieldsValue } = form;

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

  paymentTypeChangeHandler = (e) => {
    if (e.target.value === 'CREDIT') { this.setState({ schemeCascaderDisabled: false }); } else {
      this.props.form.resetFields(['scheme']);
      this.setState({ schemeCascaderDisabled: true });
    }
  }

  priceListSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    if (value) {
      setFieldsValue({ priceList: value });
    } else {
      setFieldsValue({ priceList: null });
      validateFields();
    }
  }

  render() {
    const {
      visible,
      type,
      item = {},
      onOk,
      onCancel,
      form,
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const { schemeCascaderDisabled } = this.state;

    const priceListSelectProps = {
      multiSelect: false,
    };

    const schemeCascaderProps = {
      multiSelect: false,
      onSchemeSelect(value) {
        setFieldsValue({ scheme: value });
      },
    };

    const modalOpts = {
      title: `${type === 'create' ? 'New Wallet Type' : 'Edit Wallet Type'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      width: 600,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="Payment Type" hasFeedback>
              {getFieldDecorator('paymentType', {
                initialValue: item.paymentType,
                rules: [
                  {
                    required: true,
                    message: 'Payment Type must be specifiedot be Filled',
                 },
                ],
             })(
               <RadioGroup onChange={this.paymentTypeChangeHandler}>
                 <Radio value="CASH_PREPAY">Cash PrePay</Radio>
                 <Radio value="CASH_POSTPAY">Cash PostPay</Radio>
                 <Radio value="CREDIT">Credit</Radio>
               </RadioGroup>
              )}
            </FormItem>

            <FormItem label="Customer：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('scheme', {
                initialValue: item.scheme,
                rules: [
                  {
                    required: !schemeCascaderDisabled,
                    message: 'Scheme must be specified',
                 },
                ],
             })(<SchemeCascader
                editValue={item.scheme ? item.scheme.name : null}
                disabled={schemeCascaderDisabled}
                {...schemeCascaderProps} />)}
            </FormItem>

            <FormItem label="Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [
                  {
                    required: true,
                    message: 'Wallet Type name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Price List：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('priceList', {
                initialValue: item.priceList,
                rules: [
                  {
                    required: true,
                    message: 'Price list must be specified',
                 },
                ],
             })(<PriceListSelect
                  editValue={item.priceList ? item.priceList.name : null}
                  onPriceListSelect={this.priceListSelectHandler} {...priceListSelectProps} />)}
            </FormItem>
            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {})(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default WalletTypeModal;
