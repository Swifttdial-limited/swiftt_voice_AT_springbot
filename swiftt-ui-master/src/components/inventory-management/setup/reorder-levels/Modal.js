import PropTypes from 'prop-types';
import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  LocaleProvider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import LocationSelect from '../../../common/LocationSelect';
import ProductSelect from '../../../common/ProductSelect';

const FormItem = Form.Item;

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

  const modalOpts = {
    title: `${type === 'create' ? 'New Stockable Item Reorder Level' : 'Edit Stockable Item Reorder Level'}`,
    visible,
    onOk: handleOk,
    onCancel,
    width: 600,
    wrapClassName: 'vertical-center-modal',
  };

  const locationSelectProps = {
    multiSelect: false,
    isStore: true,
    onLocationSelect(value) {
      setFieldsValue({ location: value });
    },
  };

  const productSelectProps = {
    activated: true,
    multiSelect: false,
    trackable: true,
    onProductSelect(value) {
      setFieldsValue({ product: value });
    },
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Product" hasFeedback {...formItemLayout}>
            {getFieldDecorator('product', {
              initialValue: item.product ? item.product : null,
              rules: [{
                required: true,
                message: 'Stockable item must be specified',
              }],
            })(<ProductSelect
              editValue={item.product ? item.product.productName : null}
              {...productSelectProps}
            />)}
          </FormItem>
          <FormItem label="Location" hasFeedback {...formItemLayout}>
            {getFieldDecorator('location', {
              initialValue: item.location ? item.location : null,
              rules: [{
                required: true,
                message: 'Location must be specified',
              }],
            })(<LocationSelect
              editValue={item.location ? item.location : null}
              {...locationSelectProps}
            />
            )}
          </FormItem>
          <FormItem label="Reorder Level" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reorderLevel', {
              initialValue: item.reorderLevel,
              rules: [
                {
                  required: true,
                  message: 'Reorder level must be specified',
               },
              ],
           })(<InputNumber min={1} />)}
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
