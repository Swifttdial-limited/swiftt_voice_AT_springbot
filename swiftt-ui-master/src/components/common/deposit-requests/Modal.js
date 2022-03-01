import PropTypes from 'prop-types';
import React from 'react';
import { Form, Modal, LocaleProvider, Input } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DepositDefinitionSelect from '../DepositDefinitionSelect';

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

function DepositRequestModal({
  onOk,
  onCancel,
  visible,
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
    title: 'New Deposit Request',
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const depositDefinitionSelectProps = {
    onDepositDefinitionSelect(value) {
      setFieldsValue({ depositDefinition: value });
    },
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
        <FormItem label="Type of Deposit：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('depositDefinition', {
              rules: [
                {
                  required: true,
                  message: 'Deposit definition must be specified.',
                },
              ],
            })(<DepositDefinitionSelect {...depositDefinitionSelectProps} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Comment" hasFeedback>
            {getFieldDecorator('comment', {})(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

DepositRequestModal.propTypes = {
  dispatch: PropTypes.func,
  visible: PropTypes.any,
  onCancel: PropTypes.func,
};

export default Form.create()(DepositRequestModal);
