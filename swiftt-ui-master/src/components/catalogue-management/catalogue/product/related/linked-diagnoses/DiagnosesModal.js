import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DiagnosisSelect from '../../../../../common/diagnosis/DiagnosisSelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function DiagnosesFormModal({
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

  const diagnosisSelectProps = {
    multiSelect: true,
    onDiagnosisSelect(value) {
      setFieldsValue({ diagnoses: value });
    },
  };

  const modalOpts = {
    title: 'Link Diagnoses',
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
          <FormItem label="Diagnoses：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('diagnoses', {
              rules: [
                {
                  required: true,
                  message: 'Diagnoses must be specified',
               },
              ],
           })(<DiagnosisSelect {...diagnosisSelectProps} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

DiagnosesFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(DiagnosesFormModal);
