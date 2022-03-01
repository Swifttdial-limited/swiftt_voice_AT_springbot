import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../../../common/AccountSelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function IncomeAccountsFormModal({
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
      setFieldsValue({ incomeAccounts: value });
    },
  };

  const modalOpts = {
    title: 'New Product income accounts',
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
          <FormItem label="Income Accounts：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('incomeAccounts', {
              rules: [
                {
                  required: true,
                  message: 'Income accounts must be specified',
               },
              ],
           })(<AccountSelect {...accountSelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

IncomeAccountsFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(IncomeAccountsFormModal);
