import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Radio, Modal, LocaleProvider, Tooltip, Icon } from 'antd';

import AccountSelect from '../../../common/AccountSelect';
import TaxTypeSelect from '../../../common/accounting/TaxTypeSelect';

import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class TaxCodeFormModal extends PureComponent {

  taxAccountSelectHandler = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ taxAccount: value });
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

  taxTypeSelectHandler = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ taxType: value });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const modalOpts = {
      title: `${type === 'create' ? 'New Tax Rate' : 'Edit Tax Rate'}`,
      width: 640,
      visible,
      onOk: this.handleOk,
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
                    message: 'Account name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Tax Type：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('taxType', {
                initialValue: item.taxType,
                rules: [
                  {
                    required: true,
                    message: 'Tax Type must be filled',
                 },
                ],
              })(<TaxTypeSelect onTaxTypeSelect={this.taxTypeSelectHandler} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                Type&nbsp;
                  <Tooltip title="Balance sheet account: Statement of financial position. Income statement account: Statement of financial activity">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('formula', {
                initialValue: item.formula,
                rules: [
                  {
                    required: true,
                    message: 'Tax Code type must be specified',
                 },
                ],
             })(
               <RadioGroup>
                 <Radio value="EXCLUSIVE">Exclusive</Radio>
                 <Radio value="INCLUSIVE">Inclusive</Radio>
                 <Radio value="EXEMPT">Exempt</Radio>
               </RadioGroup>
              )}
            </FormItem>
            <FormItem label="Percentage：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('percentage', {
                initialValue: item.type,
                rules: [
                  {
                    required: true,
                    message: 'Tax Code percentage must be specified',
                 },
                ],
              })(<InputNumber min={0} />)}
            </FormItem>

            <FormItem label="Tax Account：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('taxAccount', {
                initialValue: item.taxAccount,
                rules: [
                  {
                    required: true,
                    message: 'Tax Account must be specified',
                 },
                ],
              })(<AccountSelect
                  editValue={item.taxAccount ? item.taxAccount.name : null}
                  onAccountSelect={this.taxAccountSelectHandler} />)}
            </FormItem>

            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {})(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

TaxCodeFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(TaxCodeFormModal);
