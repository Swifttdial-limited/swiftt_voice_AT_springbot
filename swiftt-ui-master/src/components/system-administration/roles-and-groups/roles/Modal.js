import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider, Row, Col } from 'antd';

import DepartmentSelect from '../../../common/DepartmentSelect';
import UserGroupSelect from '../../../common/UserGroupSelect';

import enUS from 'antd/lib/locale-provider/en_US';

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
      onOk(data);
    });
  }

  const modalOpts = {
    title: `${type === 'create' ? 'New Role' : 'Edit Role'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const departmentSelectHandler = value => setFieldsValue({ department: value });

  const userGroupSelectHandler = value => setFieldsValue({ actor: value });

  const departmentSelectProps = {
    multiSelect: false,
  };

  const userGroupSelectProps = {
    multiSelect: false,
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="User Group:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('actor', {
              initialValue: item.actor,
              rules: [
                {
                  required: true,
                  message: 'User group must be specified',
               },
              ],
           })(<UserGroupSelect
             editValue={item.actor ? item.actor.name : null}
             {...userGroupSelectProps}
             onUserGroupSelect={userGroupSelectHandler}
           />)}
          </FormItem>
          <FormItem label="Name：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: 'Group name must be specified',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Department:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('department', {
              initialValue: item.department,
              rules: [
                {
                  required: false,
                  message: 'Department must be specified',
               },
              ],
           })(<DepartmentSelect
             editValue={item.department ? item.department.name : null}
             {...departmentSelectProps}
             onDepartmentSelect={departmentSelectHandler}
           />)}
          </FormItem>
          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
           })(<TextArea rows={4} />)}
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
