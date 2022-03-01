import PropTypes from 'prop-types';
import React from 'react';
import {
  Form,
  Modal,
  LocaleProvider,
} from 'antd';

import RoleSelect from '../../../common/RoleSelect';
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
      };
      onOk(Object.assign({}, data, { parentRole: item.id ? item : null }));
    });
  }

  const modalOpts = {
    title: 'New Organogram Node',
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const roleSelectProps = {
    multiSelect: false,
    onRoleSelect(value) {
      setFieldsValue({ role: value });
    },
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Role：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('role', {
              rules: [
                {
                  required: true,
                  message: 'Role must be specified',
               },
              ],
           })(<RoleSelect {...roleSelectProps} />)}
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
