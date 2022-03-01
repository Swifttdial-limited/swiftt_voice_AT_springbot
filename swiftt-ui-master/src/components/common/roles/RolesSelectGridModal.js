import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import RoleSelect from '../RoleSelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function RolesSelectGridModal({
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

  const roleSelectProps = {
    multiSelect: false,
    onRoleSelect(value) {
      setFieldsValue({ role: value });
    },
  };

  const modalOpts = {
    title: 'Add Roles',
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

RolesSelectGridModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(RolesSelectGridModal);
