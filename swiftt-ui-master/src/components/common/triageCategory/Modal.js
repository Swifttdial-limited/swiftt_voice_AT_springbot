import PropTypes from 'prop-types';
import React from 'react';
import { Form, Modal, LocaleProvider, Button } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import TriageCategorySelect from './TriageCategorySelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function TriageCategorysModal({
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
    title: 'Set Triage Category',
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const triageCategorySelectProps = {
    multiSelect: false,
    onTriageCategorySelect(value) {
      setFieldsValue({ triageCategory: value });
    },
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Triage Category：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('triageCategory', {
            rules: [
              {
                required: true,
                message: 'Triage category must be specified',
             },
            ],
         })(<TriageCategorySelect {...triageCategorySelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

TriageCategorysModal.propTypes = {
  dispatch: PropTypes.func,
  visible: PropTypes.any,
  onCancel: PropTypes.func,
};

export default Form.create()(TriageCategorysModal);
