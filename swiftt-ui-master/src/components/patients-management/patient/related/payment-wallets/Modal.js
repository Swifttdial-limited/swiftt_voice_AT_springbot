import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Checkbox, Input, Radio, Modal, LocaleProvider, Select, Tooltip, Icon, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import SchemeCascader from '../../../../common/SchemeCascader';
import WalletTypeSelect from '../../../../common/WalletTypeSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class PaymentWalletsModal extends PureComponent {

  static defaultProps = {
    item: {},
    onOk: () => {},
    onCancel: () => {},
  };

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = { schemeCascaderDisabled: true, identificationInputDisabled: true };

  onIsDefaultWalletToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ isDefault: e.target.value });
  }

  paymentTypeSelectHandler = (e) => {
    const { form, item } = this.props;
    const { setFieldsValue } = form;

    this.resetState();

    if (e.target.value === 'CREDIT') {
      this.setState({ identificationInputDisabled: false, schemeCascaderDisabled: false });
    }
  }

  schemeSelectHandler = value => this.props.form.setFieldsValue({ scheme: value })

  handleOk = () => {
    const { form, item, onOk } = this.props;
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

  resetState = () => {
    this.setState({
      schemeCascaderDisabled: true,
      identificationInputDisabled: true,
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    const { schemeCascaderDisabled, identificationInputDisabled } = this.state;

    const schemeCascaderProps = {
      multiSelect: false,
    };

    const walletTypeSelectProps = {
      multiSelect: false,
      paymentType: getFieldValue('paymentType'),
      scheme: getFieldValue('scheme'),
      onWalletTypeSelect(value) {
        setFieldsValue({ walletType: value });
      },
    };

    const modalOpts = {
      title: `${type === 'create' ? 'New Wallet' : 'Edit Wallet'}`,
      visible,
      width: 720,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="Payment Type" hasFeedback>
              {getFieldDecorator('paymentType', {
                initialValue: item.walletType ? item.walletType.paymentType : null,
                rules: [
                  {
                    required: true,
                    message: 'Payment Type must be specified',
                 },
                ],
             })(
               <RadioGroup onChange={this.paymentTypeSelectHandler}>
                 <Radio value="CASH_PREPAY">Cash PrePay</Radio>
                 <Radio value="CASH_POSTPAY">Cash PostPay</Radio>
                 <Radio value="CREDIT">Credit</Radio>
               </RadioGroup>
              )}
            </FormItem>

            <FormItem label="Customer：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('scheme', {
                  initialValue: item.walletType ? item.walletType.scheme : null,
                  rules: [
                    {
                      required: !schemeCascaderDisabled,
                      message: 'Scheme must be specified',
                   },
                  ],
               })(<SchemeCascader
                    disabled={schemeCascaderDisabled}
                    onSchemeSelect={this.schemeSelectHandler}
                    {...schemeCascaderProps} />)}
            </FormItem>

            <FormItem label="Type of Wallet：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('walletType', {
                initialValue: item.walletType ? item.walletType : null,
                rules: [
                  {
                    required: true,
                    message: 'Type of wallet must be specified',
                 },
                ],
             })(<WalletTypeSelect
                  editValue={item.walletType ? item.walletType.name : null}
                  {...walletTypeSelectProps} />)}
            </FormItem>

            <div>
              <FormItem
                label={(
                  <span>
                    Identification&nbsp;
                    <Tooltip title="Like membership number, policy number or social security number">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('identification', {
                    initialValue: item.identification,
                    rules: [
                      {
                        required: !schemeCascaderDisabled,
                        message: 'Identification Number must be specified',
                     },
                    ],
                 })(<Input disabled={identificationInputDisabled} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="Membership Type" hasFeedback>
                {getFieldDecorator('membershipType', {
                    initialValue: item.membershipType,
                    rules: [
                      {
                        required: !schemeCascaderDisabled,
                        message: 'Membership type must be specified',
                     },
                    ],
                 })(
                   <RadioGroup disabled={identificationInputDisabled}>
                     <Radio value="PRINCIPAL">Principal</Radio>
                     <Radio value="DEPENDANT">Dependant</Radio>
                   </RadioGroup>
                  )}
              </FormItem>
            </div>

            <Row>
              <Col span={14} offset={6}>
                <FormItem>
                  {getFieldDecorator('default', {
                    valuePropName: 'checked',
                    initialValue: item.default ? item.default : false,
                  })(
                    <Checkbox>
                      <span>Is this the default payment wallet? &nbsp;
                        <Tooltip title="Can it be used as the default wallet to do transactions e.g. Billing">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>)
                 }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default PaymentWalletsModal;
