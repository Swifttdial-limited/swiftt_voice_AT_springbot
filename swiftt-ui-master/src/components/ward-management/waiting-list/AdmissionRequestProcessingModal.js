import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider, Select, Tooltip, Icon, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import BedCascader from '../../common/BedCascader';
import DiagnosisSelect from '../../common/diagnosis/DiagnosisSelect';
import UserSelect from '../../common/UserSelect';

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

function AdmissionRequestProcessingModal({
  visible,
  type,
  item,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
}) {
  const bedCascaderProps = {
    onBedSelect(value) {
      setFieldsValue({ bed: value });
    },
  };

  const diagnosesSelectProps = {
    multiSelect: true,
    onDiagnosisSelect(value) {
      setFieldsValue({ diagnoses: value });
    },
  };

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

  const doctorInChargeSelectHandler = (value) => {
    setFieldsValue({ doctorInCharge: value });
  }

  const modalOpts = {
    title: 'Process Admission request',
    visible,
    width: 600,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem
            label={(
              <span>
              Bed&nbsp;
                <Tooltip title="Assign an unassigned bed to this admission request">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('bed', {
              rules: [
                {
                  required: true,
                  message: 'Bed must be specified',
               },
              ],
           })(<BedCascader {...bedCascaderProps} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Doctor In Charge:" hasFeedback>
            {getFieldDecorator('doctorInCharge', {
              rules: [{
                required: true,
                message: 'Doctor In Charge must be specified',
              }],
            })(<UserSelect onUserSelect={doctorInChargeSelectHandler} />)}
          </FormItem>
          <FormItem label="Diagnoses" hasFeedback {...formItemLayout}>
            {getFieldDecorator('diagnoses', {
              rules: [
                {
                  required: true,
                  message: 'Diagnosis must be specified',
                },
              ],
            })(<DiagnosisSelect {...diagnosesSelectProps} />)}
          </FormItem>
          <FormItem label="Comment:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comment', {})(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AdmissionRequestProcessingModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AdmissionRequestProcessingModal);
