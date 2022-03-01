import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function DeductionTypeFormModal({
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
    title: `${type === 'create' ? 'New Deduction Type' : 'Edit Deduction Type'}`,
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
                        message: 'Payment mode name must be specified',
                    },
                ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

DeductionTypeFormModal.defaultProps = {
  visible: false,
  item: {},
  onOk: () => {},
  onCancel: () => {},
};

DeductionTypeFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(DeductionTypeFormModal);
