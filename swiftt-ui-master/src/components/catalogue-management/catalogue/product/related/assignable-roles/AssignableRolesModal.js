import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import RoleSelect from '../../../../../common/RoleSelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function AssignableRoleFormModal({
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
    multiSelect: true,
    onRoleSelect(value) {
      setFieldsValue({ assignableRoles: value });
    },
  };

  const modalOpts = {
    title: 'New Assignable roles',
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
          <FormItem label="Assignable Roles：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('assignableRoles', {
              rules: [
                {
                  required: true,
                  message: 'Assignable role must be specified',
               },
              ],
           })(<RoleSelect {...roleSelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AssignableRoleFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AssignableRoleFormModal);
