import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import FolderSelect from './FolderSelect';
import RoleSelect from '../RoleSelect';

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

function FolderFormModal({
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
    title: `${type === 'create' ? 'New Folder' : 'Edit Folder'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const parentFolderSelectProps = {
    multiSelect: false,
    onFolderSelect(value) {
      setFieldsValue({ parentFolder: value });
    }
  };

  const roleSelectProps = {
    multiSelect: true,
    onRoleSelect(value) {
      setFieldsValue({ roles: value });
    }
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Folder Name：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('folderName', {
              initialValue: item.folderName ? item.folderName : null,
              rules: [
                {
                  required: true,
                  message: 'Account name must be specified',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description ? item.description : null,
            })(<TextArea rows={4} />)}
          </FormItem>
          <FormItem label="Parent Folder：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('parentFolder', {
              initialValue: item.parentFolder ? item.parentFolder : null,
            })(<FolderSelect
                editValue={item.parentFolder ? item.parentFolder : null}
                {...parentFolderSelectProps} />)}
          </FormItem>
          <FormItem label="Accessible By：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('roles', {
              initialValue: (item.roles !== undefined && item.roles.length > 0) ? item.roles : null,
            })(<RoleSelect
              editValue={(item.roles !== undefined && item.roles.length > 0) ? item.roles : null}
              {...roleSelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

FolderFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(FolderFormModal);
