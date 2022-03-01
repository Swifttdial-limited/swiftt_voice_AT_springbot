import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Checkbox, Input, Radio, Modal, Tooltip, Icon, LocaleProvider, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DiagnosisSelect from './DiagnosisSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class DiagnosesModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  handleOk = () => {
    const { form, onOk } = this.props;
    const { validateFields, getFieldsValue } = form;

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

  render() {
    const { form, visible, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const modalOpts = {
      title: 'Add New Diagnoses',
      visible,
      onOk: this.handleOk,
      onCancel,
      width: 800,
      wrapClassName: 'vertical-center-modal',
    };

    const diagnosesSelectProps = {
      multiSelect: true,
      onDiagnosisSelect(value) {
        setFieldsValue({ encounterDiagnoses: value });
      },
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="Type" hasFeedback>
              {getFieldDecorator('type', {
                  rules: [{ required: true, message: 'Diagnoses type must be specified' }],
              })(
                <RadioGroup style={{ float: 'left' }}>
                  <Radio value="PROVISIONAL">Provisional</Radio>
                  <Radio value="CONFIRMED">Confirmed</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="Diagnoses" hasFeedback {...formItemLayout}>
              {getFieldDecorator('encounterDiagnoses', {
                rules: [
                  {
                    required: true,
                    message: 'Diagnosis must be specified',
                  },
                ],
              })(<DiagnosisSelect {...diagnosesSelectProps} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default DiagnosesModal;
