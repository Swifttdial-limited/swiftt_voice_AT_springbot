import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, Form, Button, Radio, Modal, LocaleProvider, Select, Icon, Row, Col } from 'antd';
import Fingerprint from '../../../../common/Fingerprint';
import enUS from 'antd/lib/locale-provider/en_US';
import fingerImage from '../../../../../../public/finger-print-hang.png';
import DescriptionList from '../../../../DescriptionList';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Description = DescriptionList.Description;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class BiometricsModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      isCaptureDeviceReady: false,
      showCapturedPrintView: false,
      showFingerSelectionFormItem: false,
      fingerPrint: null,
    });
  }

  componentWillUnmount() {}

  onFingerTypeChangeHandler = (e) => {
    this.setState({ showCapturedPrintView: true });
    // send command to device to arm it for capture
  }

  onHandTypeChangeHandler = (e) => {
    this.setState({ showFingerSelectionFormItem: true });
  }

  handleBiometrics = (fingerPrintData) => {
    this.setState(() => ({ ...fingerPrintData }));
  }

  handleOk = () => {
    const { form, onOk } = this.props;
    const { validateFields, getFieldsValue, getFieldValue } = form;
    const { fingerPrint, fingerprintReader } = this.state;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        fingerPrint,
        fingerprintReader,
        fingerName: `${getFieldValue('hand')}_${getFieldValue('fingerName')}`,
      };
      delete data.biometrics;
      onOk(data);
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const { isCaptureDeviceReady, showCapturedPrintView, showFingerSelectionFormItem, fingerPrint, activateCapture } = this.state;


    const modalOpts = {
      title: `${type === 'create' ? 'New Biometric Registration' : 'Verify Biometric '}`,
      visible,
      width: 600,
      onOk: this.handleOk,
      onCancel,
      // okText: '',
      // cancelText: '',
      // footer: !isCaptureDeviceReady ? null : {},
      wrapClassName: 'vertical-center-modal',
    };
    const finger = item.fingerName ? item.fingerName.split('_') : null;
    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            {getFieldDecorator('biometrics')(
              <Fingerprint onChange={this.handleBiometrics} />
            )}
            {isCaptureDeviceReady && activateCapture && type === 'create' && (
            <FormItem label="Hand" hasFeedback {...formItemLayout}>
              {getFieldDecorator('hand', {
                                        rules: [
                                          {
                                            required: true,
                                            message: 'You must select a hand',
                                        },
                                        ],
                                    })(
                                      <RadioGroup onChange={this.onHandTypeChangeHandler}>
                                        <Radio value="LEFT">Left Hand</Radio>
                                        <Radio value="RIGHT">Right Hand</Radio>
                                      </RadioGroup>
                                      )}
            </FormItem>
            )}
            {isCaptureDeviceReady && activateCapture && showFingerSelectionFormItem && type === 'create' && (
            <FormItem label="Type of finger" hasFeedback {...formItemLayout}>
              {getFieldDecorator('fingerName', {
                                          rules: [
                                            {
                                              required: true,
                                              message: 'Type of finger must be specified',
                                          },
                                          ],
                                      })(
                                        <Select style={{ width: 200 }} onChange={this.onFingerTypeChangeHandler}>
                                          <Option value="THUMB">Thumb</Option>
                                          <Option value="INDEX">Index</Option>
                                          <Option value="MIDDLE">Middle</Option>
                                          <Option value="RING">Ring</Option>
                                          <Option value="PINKY">Pinky</Option>
                                        </Select>
                                        )}
            </FormItem>
           )}
            {isCaptureDeviceReady && type === 'verify' && (
            <div>
              <DescriptionList col={2}>
                <Description term="Hand">{finger && finger[0] ? finger[0] : '---NOT SET--'}</Description>
                <Description term="Finger">{finger && finger[1] ? finger[1] : '---NOT SET--'}</Description>
              </DescriptionList>
            </div>
           )}
            <Row gutter={20}>
              <Col offset={6} span={14}>
                {isCaptureDeviceReady && showCapturedPrintView && fingerPrint ? (
                  <div style={{
                    background: `url(data:image/jpeg;base64,${fingerPrint})`,
                    width: '176px',
                    height: '219px',
                    backgroundPosition: 'center center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                  }}
                  />
                ) : (
                  <img src={fingerImage} alt="Finger Print" />
                )}
              </Col>
            </Row>


          </Form>

        </Modal>
      </LocaleProvider>
    );
  }
}

BiometricsModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(BiometricsModal);
