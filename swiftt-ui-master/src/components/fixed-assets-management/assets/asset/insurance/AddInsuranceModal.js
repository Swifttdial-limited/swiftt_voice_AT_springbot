import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Form, Modal, LocaleProvider, Input, DatePicker} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function AddInsuranceFormModal({
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
      setFieldsValue({assignableRoles: value});
    },
  };

  const modalOpts = {
    title: 'Add new Insurance',
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
          <FormItem label="Policy number" hasFeedback {...formItemLayout}>
            {getFieldDecorator('policyNumber', {
              //initialValue: item.policyNumber,
              rules: [
                {
                  required: true,
                  message: 'policy number must be Selected',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="insurance Firm" hasFeedback {...formItemLayout}>
            {getFieldDecorator('insuranceFirm', {
              //initialValue: item.insuranceFirm,
              rules: [
                {
                  required: true,
                  message: 'insurance Firm must be Selected',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="insurance Agent" hasFeedback {...formItemLayout}>
            {getFieldDecorator('insuranceAgent', {
              //initialValue: item.insuranceAgent,
              rules: [
                {
                  required: true,
                  message: 'insurance Agent must be Selected',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="start Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startDate', {
              //initialValue: item.startDate,
              rules: [
                {
                  required: true,
                  message: 'start Date must be Selected',
                },
              ],
            })(<DatePicker
              format={dateFormat}
            />)}
          </FormItem>

          <FormItem label="end Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('endDate', {
              //initialValue: item.endDate,
              rules: [
                {
                  required: true,
                  message: 'end Date must be Selected',
                },
              ],
            })(<DatePicker
              format={dateFormat}
            />)}
          </FormItem>

        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AddInsuranceFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AddInsuranceFormModal);
