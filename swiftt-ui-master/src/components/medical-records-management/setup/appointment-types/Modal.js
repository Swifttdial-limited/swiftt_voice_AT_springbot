import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Modal, LocaleProvider } from 'antd';

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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

function AppointmentTypeModal({
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
    title: `${type === 'create' ? 'New Appointment Type' : 'Edit Appointment Type'}`,
    visible,
    onOk: handleOk,
    onCancel,
    width: 600,
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
                  message: 'Name must be specified.',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Duration (Minutes):" hasFeedback {...formItemLayout}>
            {getFieldDecorator('duration', {
                initialValue: item.duration,
                rules: [
                  {
                    required: true,
                    message: 'Duration must be specified',
                 },
                ],
             })(<InputNumber min={1} />)}
          </FormItem>
          <FormItem label="Description:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
           })(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AppointmentTypeModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AppointmentTypeModal);
