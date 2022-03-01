import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  LocaleProvider,
  Radio,
  Checkbox,
  Row,
  Col,
  Tooltip,
  Icon
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';
import TradingCurrencySelect from '../../../common/accounting/TradingCurrencySelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class PaymentModeFormModal extends PureComponent {

  static defaultProps = {
    visible: false,
    item: {},
    onOk: () => { },
    onCancel: () => { },
  };

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object.isRequired,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    selectCurrencyDisabled: true,
  };

  paymentReferenceRequiredToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ paymentReferenceRequired: e.target.value });
  }
  paymentModeIsCashierVisibleToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ cashier: e.target.value });
  }

  toggleCurrencySelectHandler = e => {
    this.setState({ selectCurrencyDisabled: !e.target.checked });
  }

  render() {
    const {
      form,
      visible,
      type,
      item,
      onOk,
      onCancel,
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      setFieldsValue,
      getFieldsValue,
    } = form;

    const { selectCurrencyDisabled } = this.state;

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
    function onModeTypeChange(e) {
      setFieldsValue({ bank: e.target.value });
    }

    const accountSelectProps = {
      onAccountSelect(value) {
        setFieldsValue({ assetAccount: value });
      },
    };

    const tradingCurrencySelectProps = {
      disabled: selectCurrencyDisabled,
      onTradingCurrencySelect(value) {
        setFieldsValue({ tradingCurrency: value });
      },
    };

    const modalOpts = {
      title: `${type === 'create' ? 'New Mode of Payment' : 'Edit Mode of Payment'}`,
      width: 600,
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
                    message: 'Payment mode name must be specified',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Account：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('assetAccount', {
                initialValue: item.assetAccount,
                rules: [
                  {
                    required: false,
                    message: 'Account must be specified',
                  },
                ],
              })(<AccountSelect
                editValue={item.assetAccount ? `${item.assetAccount.name}(${item.assetAccount.accountNumber})` : null}
                {...accountSelectProps}
              />)}
            </FormItem>
            <FormItem label="Channel Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('bank', {
                initialValue: item.bank,
                rules: [
                  {
                    required: true,
                    message: 'Payment mode type must be specified',
                  },
                ],
              })(
                <RadioGroup onChange={onModeTypeChange} >
                  <Radio value={false}>Cash</Radio>
                  <Radio value={true}>Bank</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <Row>
              <Col span={14} offset={6}>
                <FormItem hasFeedback>
                  {getFieldDecorator('cashier', {
                    initialValue: item.cashier,
                  })(
                    <Checkbox
                      defaultChecked={item.cashier ? item.cashier : false}
                      onChange={this.paymentModeIsCashierVisibleToggleHandler}>
                      <span>Is visible to cashier?&nbsp;
                        <Tooltip title="Allow cashier to view this payment mode?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={14} offset={6}>
                <FormItem>
                  {getFieldDecorator('paymentReferenceRequired', {
                    initialValue: item.paymentReferenceRequired,
                  })(
                    <Checkbox
                      defaultChecked={item.paymentReferenceRequired ? item.paymentReferenceRequired : false}
                      onChange={this.paymentReferenceRequiredToggleHandler}>
                      <span>Requires payment reference?&nbsp;
                        <Tooltip title="Requires user to specify payment reference">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>
                  )}
                </FormItem>

              </Col>
            </Row>
            <br />
            <Row>
              <Col span={14} offset={6}>
                <Checkbox onChange={this.toggleCurrencySelectHandler}>
                  <span>Uses other currency apart from Base currency?&nbsp;
                    <Tooltip title="Use other trading currency?">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                </Checkbox>
              </Col>
            </Row>
            <br />
            <FormItem label="Trading Currency：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('tradingCurrency', {
                initialValue: item.tradingCurrency,
                rules: [
                  {
                    required: false,
                    message: 'Trading currency must be specified',
                  },
                ],
              })(

                <TradingCurrencySelect
                  editValue={(item.tradingCurrency ? `${item.tradingCurrency.currency.name}(${item.tradingCurrency.currency.code})` : null)}
                  {...tradingCurrencySelectProps}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default PaymentModeFormModal;
