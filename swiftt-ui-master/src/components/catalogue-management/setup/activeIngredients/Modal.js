import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Modal,
  LocaleProvider
} from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 },
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
    getFieldValue,
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
    title: `${type === 'create' ? 'New Active Ingredient' : 'Edit Active Ingredient'}`,
    // width: 600,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Name：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('activeIngredientName', {
              initialValue: item.activeIngredientName,
              rules: [
                {
                  required: true,
                  message: 'Product activeIngredient name must be specified',
               },
              ],
           })(<Input />)}
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
