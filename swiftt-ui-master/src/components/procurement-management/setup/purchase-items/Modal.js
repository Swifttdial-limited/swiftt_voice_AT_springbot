import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Radio, Modal, Tooltip, Icon, LocaleProvider } from 'antd';

import ContactSelect from '../../../common/ContactSelect';
import ProductSelect from '../../../common/ProductSelect';

import enUS from 'antd/lib/locale-provider/en_US';

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

function modal({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
}) {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      };
      onOk(data);
    });
  }

  function contactSelectChangeHandler(value) { setFieldsValue({ vendor: value }); }

  function productSelectChangeHandler(value) { setFieldsValue({ product: value }); }

  const modalOpts = {
    title: `${type === 'create' ? 'New Purchase Item' : 'Edit Purchase Item'}`,
    visible,
    onOk: handleOk,
    onCancel,
    width: 600,
    wrapClassName: 'vertical-center-modal',
  };

  const contactSelectProps = {
    multiSelect: false,
    contactType: 'VENDOR',
  };

  const productSelectProps = {
    multiSelect: false,
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Product：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('product', {
              initialValue: item.product,
              rules: [
                {
                  required: true,
                  message: 'Product name must be specified',
               },
              ],
           })(<ProductSelect {...productSelectProps} onProductSelect={productSelectChangeHandler} />)}
          </FormItem>
          <FormItem label="Vendor / Supplier：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
              initialValue: item.vendor,
              rules: [
                {
                  required: true,
                  message: 'Vendor / Supplier must be specified',
               },
              ],
           })(<ContactSelect {...contactSelectProps} onContactSelect={contactSelectChangeHandler} />)}
          </FormItem>
          <FormItem label="Purchase Price：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: item.price,
              rules: [
                {
                  required: true,
                  message: 'Purchase price name must be specified',
               },
              ],
           })(<InputNumber min={0} />)}
          </FormItem>
          <FormItem label="Purchase Cost：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cost', {
              initialValue: item.cost,
              rules: [
                {
                  required: true,
                  message: 'Purchase cost name must be specified',
               },
              ],
           })(<InputNumber min={0} />)}
          </FormItem>
          <FormItem label="Normal Order Qty：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('normalOrderQuantity', {
              initialValue: item.normalOrderQuantity,
           })(<InputNumber min={0} />)}
          </FormItem>
          <FormItem label="Mininum Order Qty：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('minimumOrderQuantity', {
              initialValue: item.minimumOrderQuantity,
           })(<InputNumber min={0} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

modal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(modal);
