import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Form, Input, Modal, LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function TaxTypeFormModal({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
  };

  const modalOpts = {
    title: `${type === 'create' ? 'New Tax Type' : 'Edit Tax Type'}`,
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
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: 'Tax type name must be specified',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {})(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

TaxTypeFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(TaxTypeFormModal);
