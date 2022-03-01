import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider, Select, Tooltip, Icon, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import MedicalHistoryTypeSelect from './MedicalHistoryTypeSelect';

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

function MedicalHistoryEntryModal({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  visible,
  type,
  item,
  onOk,
  onCancel,
}) {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue() };
      onOk(data);
    });
  }

  const medicalHistorySelectProps = {
    multiSelect: false,
    onMedicalHistoryEntrySelect(value) {
      setFieldsValue({ type: value });
    },
  };

  const modalOpts = {
    title: `${type === 'create' ? 'New Medical History Entry' : 'Edit Medical History Entry'}`,
    visible,
    width: 900,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="Medical History Entry Type" hasFeedback>
            {getFieldDecorator('type', {
              initialValue: item.type,
              rules: [
                {
                  required: true,
                  message: 'Medical history entry type must be specified',
               },
              ],
           })(<MedicalHistoryTypeSelect
                editValue={item.type ? item.type : null}
                {...medicalHistorySelectProps} />)}
          </FormItem>
          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description ? item.description : null,
              rules: [
                {
                  required: true,
                  message: 'Medical history entry must be specified',
               },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

MedicalHistoryEntryModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(MedicalHistoryEntryModal);
