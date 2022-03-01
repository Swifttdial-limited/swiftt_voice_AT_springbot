import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';

const { TextArea } = Input;
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

  function liabilityAccountSelectHandler(value) {
    setFieldsValue({ liabilityAccount: value });
  }

  const liabilityAccountSelectProps = {
    multiSelect: false,
  };

  const modalOpts = {
    title: `${type === 'create' ? 'New Deposit definition' : 'Edit Deposit definition'}`,
    visible,
    width: 600,
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
                  message: 'Name must be specified',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
           })(<TextArea rows={4} />)}
          </FormItem>
          <FormItem label="Account：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('liabilityAccount', {
              initialValue: item.liabilityAccount,
              rules: [
                {
                  required: true,
                  message: 'Deposit account must be specified',
               },
              ],
           })(<AccountSelect
                editValue={item.liabilityAccount ? item.liabilityAccount.name : null}
                {...liabilityAccountSelectProps}
                onAccountSelect={liabilityAccountSelectHandler}/>)}
          </FormItem>
          <FormItem label="Amount：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('requiredDepositAmount', {
              initialValue: item.requiredDepositAmount,
              rules: [
                {
                  required: true,
                  message: 'Deposit account must be specified',
               },
              ],
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
