import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Form, Modal, LocaleProvider, Input, InputNumber, DatePicker} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import ContactSelect from '../../../../../components/common/ContactSelect';
import AssetCategoriesSelect from '../../../../../components/common/AssetMaintenanceCategoriesSelect';

const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function AddMaintenanceFormModal({
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

  const contactChangeHandler = value => setFieldsValue({ supplier: value });

  const categorySelectProps = {
    multiSelect: false,
    onGroupSelect(value) {
      setFieldsValue({ category: value });
    },
  };

  const contactSelectProps = {
    multiSelect: false,
    contactType: 'VENDOR',
  };

  const modalOpts = {
    title: 'Add new Maintenance',
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

          <FormItem label="Category" hasFeedback {...formItemLayout}>
            {getFieldDecorator('category', {
              //initialValue: item.endDate,
              rules: [
                {
                  required: true,
                  message: 'end Date must be Selected',
                },
              ],
            })(<AssetCategoriesSelect
              {...categorySelectProps}
            />)}
          </FormItem>

          <FormItem label="Cost Amount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('costAmount', {
              //initialValue: item.insuredAmount,
              rules: [
                {
                  required: true,
                  message: 'insured Amount must be Selected',
                },
              ],
            })(<InputNumber  />)}
          </FormItem>

          <FormItem label="Supplier:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('supplier', {
              rules: [
                {
                  required: true,
                  message: 'supplier must be specified',
                },
              ],
            })(<ContactSelect
              onContactSelect={contactChangeHandler}
              {...contactSelectProps}
            />)}
          </FormItem>

          <FormItem label="Reason：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reason', {
              //initialValue: item.reason,
            })(<TextArea rows={4} />)}
          </FormItem>

        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AddMaintenanceFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AddMaintenanceFormModal);
