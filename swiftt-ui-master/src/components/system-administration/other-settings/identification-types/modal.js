import PropTypes from 'prop-types';
import React from 'react';
import { Form, Checkbox, Input, InputNumber, Tooltip, Icon, Modal, LocaleProvider } from 'antd';

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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
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

  function personToggleHandler(e) {
    setFieldsValue({ person: e.target.value });
  }

  function contactToggleHandler(e) {
    setFieldsValue({ contact: e.target.value });
  }


  const modalOpts = {
    title: `${type === 'create' ? 'New Identification Type' : 'Edit Identification Type'}`,
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
                  message: 'Identification Type name must be specified',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Code：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
           })(<Input />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            {getFieldDecorator('person', {
              valuePropName: 'checked',
              initialValue: item.person,
           })(
             <Checkbox onChange={personToggleHandler}>
               <span>Person?
                 <Tooltip title="Is this person related identification type">
                   <Icon type="question-circle-o" />
                 </Tooltip>
               </span>
             </Checkbox>)
           }
          </FormItem>
          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            {getFieldDecorator('contact', {
              valuePropName: 'checked',
              initialValue: item.contact,
           })(
             <Checkbox onChange={contactToggleHandler}>
               <span>Company?
                 <Tooltip title="Is this company related identification type">
                   <Icon type="question-circle-o" />
                 </Tooltip>
               </span>
             </Checkbox>)
           }
          </FormItem>
          <FormItem
            label={(
              <span>Required Age&nbsp;
                <Tooltip title="Minimum age by which an identification is required">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>)}
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('minimumRequiredAge', {
              initialValue: item.minimumRequiredAge,
           })(<InputNumber min={1} />)}
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
