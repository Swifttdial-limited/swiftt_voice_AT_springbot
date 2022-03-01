import PropTypes from 'prop-types';
import React from 'react';
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

function ContactFormModal({
  visible,
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
      };
      onOk(data);
    });
  }

  const modalOpts = {
    title: 'Edit Contact',
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
                        message: 'Contact name must be specified',
                    },
                ],
            })(<Input />)}
          </FormItem>
          <FormItem label="Code：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

ContactFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(ContactFormModal);
