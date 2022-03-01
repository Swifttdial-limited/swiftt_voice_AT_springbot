import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Form, Modal, LocaleProvider, Input, DatePicker} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import LocationSelect from "../../../../../components/common/LocationSelect";

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function AddTransferFormModal({
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

  const locationSelectProps = {
    multiSelect: false,
  };

  const locationSelectHandler = value => setFieldsValue({ newLocation: value });

  const modalOpts = {
    title: 'Add new Transfer',
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
          <FormItem label="Transfer Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transferDate', {
              //initialValue: item.startDate,
              rules: [
                {
                  required: true,
                  message: 'transfer Date must be Selected',
                },
              ],
            })(<DatePicker
              format={dateFormat}
            />)}
          </FormItem>

          <FormItem label="New Location:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('newLocation', {
              rules: [
                {
                  required: false },
              ],
            })(<LocationSelect {...locationSelectProps} onLocationSelect={locationSelectHandler} />)}
          </FormItem>

          <FormItem label="Reason" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reason', {
              //initialValue: item.startDate,
              rules: [
                {
                  required: true,
                  message: 'notes on the reason for transfer asset must be Selected',
                },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AddTransferFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AddTransferFormModal);
