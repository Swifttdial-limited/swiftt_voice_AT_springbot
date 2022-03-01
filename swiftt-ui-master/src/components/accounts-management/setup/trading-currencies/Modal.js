import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  InputNumber,
  Checkbox,
  Modal,
  LocaleProvider,
  Row,
  Col,
  Tooltip,
  Icon
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import CurrencySelect from '../../../common/accounting/CurrencySelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class CurrencyFormModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  currencySelectHandler = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ currency: value });
  }

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

  render() {
    const {
      form,
      visible,
      type,
      item = {},
      onOk,
      onCancel
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
    } = form;

    const modalOpts = {
      title: `${type === 'create' ? 'New Trading Currency' : 'Edit Trading Currency'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    getFieldDecorator('trading', { initialValue: false });

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Currency：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('currency', {
                initialValue: item.id ? item.name : null,
                rules: [
                  {
                    required: true,
                    message: 'Currency must be specified',
                 },
                ],
             })(<CurrencySelect
                  editValue={item.id ? item.name : null}
                  onCurrencySelect={this.currencySelectHandler} />)}
            </FormItem>
            <Row>
              <Col span={14} offset={6}>
                <FormItem>
                  {getFieldDecorator('trading', {
                    valuePropName: 'checked',
                    initialValue: item.trading,
                  })(
                    <Checkbox>
                      <span>Enable trading?&nbsp;
                        <Tooltip title="Can it be used to?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={14} offset={6}>
                <FormItem>
                  {getFieldDecorator('autoUpdateRate', {
                    valuePropName: 'checked',
                    initialValue: item.autoUpdateRate ? item.autoUpdateRate : false,
                  })(
                    <Checkbox disabled={!getFieldValue('trading')}>
                      <span>Enable automatic update of exchange rate?&nbsp;
                        <Tooltip title="Can it be used to?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>)}
                </FormItem>
              </Col>
            </Row>
            <FormItem label={(
              <span>Exchange Rate&nbsp;
                <Tooltip title="1 Foreign currency = ? Base / Home currency">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
              )} hasFeedback {...formItemLayout}>
              {getFieldDecorator('rate', {
                initialValue: item.rate,
                rules: [
                  {
                    required: true,
                    message: 'Exchange Rate must be specified'
                  }
                ]
              })(<InputNumber disabled={!getFieldValue('trading')} min={0} />)}
            </FormItem>
            <Row>
              <Col span={14} offset={6}>
                <p>1 Foreign currency = ? Base / Home currency</p>
              </Col>
            </Row>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default CurrencyFormModal;
