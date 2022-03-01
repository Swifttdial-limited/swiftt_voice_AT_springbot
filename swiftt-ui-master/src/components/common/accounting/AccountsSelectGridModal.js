import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../AccountSelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function AccountsSelectGridModal({
  visible,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
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

  const accountSelectProps = {
    multiSelect: true,
    onAccountSelect(value) {
      setFieldsValue({ accounts: value });
    },
  };

  const modalOpts = {
    title: 'Add Accounts',
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
          <FormItem label="Accounts：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accounts', {
              rules: [
                {
                  required: true,
                  message: 'Accounts must be specified',
               },
              ],
           })(<AccountSelect {...accountSelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AccountsSelectGridModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AccountsSelectGridModal);
