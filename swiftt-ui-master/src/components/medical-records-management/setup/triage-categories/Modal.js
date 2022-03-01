import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Radio, Modal, LocaleProvider } from 'antd';
import { CompactPicker } from 'react-color';
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
  function colorChangeHandler(value) {
    setFieldsValue({ colorCode: value.hex });
  }

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
    title: `${type === 'create' ? 'New Triage Category' : 'Edit Triage Category'}`,
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
                  message: 'Name must be specified.',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Priority：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priority', {
              initialValue: item.priority,
              rules: [
                {
                  required: true,
                  message: 'Priority must be specified.',
               },
              ],
           })(<InputNumber min={0} max={99} />)}
          </FormItem>
          <FormItem label="Color Code：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('colorCode', {
              initialValue: item.colorCode,
              rules: [
                {
                  required: true,
                  message: 'Color code must be specified.',
               },
              ],
            })(<CompactPicker onChangeComplete={colorChangeHandler} />)}
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

modal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(modal);
