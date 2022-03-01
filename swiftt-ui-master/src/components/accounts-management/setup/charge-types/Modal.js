import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function ChargeTypeFormModal({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
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
    title: `${type === 'create' ? 'New Charge Type' : 'Edit Charge Type'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const expenseAccountSelectProps = {
    multiSelect: false,
    onAccountSelect(value) {
      setFieldsValue({ expenseAccount: value });
    },
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
                        message: 'Payment mode name must be specified',
                    },
                ],
            })(<Input />)}
          </FormItem>
          <FormItem label="Account：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expenseAccount', {
              initialValue: item.expenseAccount ? item.expenseAccount : null,
              rules: [
                  {
                      required: true,
                      message: 'Account must be specified',
                  },
              ],
            })(<AccountSelect
                editValue={item.expenseAccount ? item.expenseAccount.name : null}
                {...expenseAccountSelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

ChargeTypeFormModal.defaultProps = {
  visible: false,
  item: {},
  onOk: () => {},
  onCancel: () => {},
};

ChargeTypeFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(ChargeTypeFormModal);
