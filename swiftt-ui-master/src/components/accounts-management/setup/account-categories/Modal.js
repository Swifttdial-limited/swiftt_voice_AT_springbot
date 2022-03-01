import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Checkbox,
  Input,
  InputNumber,
  Radio,
  Modal,
  LocaleProvider,
  Tooltip,
  Icon,
  Row,
  Col,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountCategorySelect from '../../../common/AccountCategorySelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class AccountCategoryFormModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    isSubCategory: true,
    showCategoryBalanceType: false,
    showCategoryClassification: false,
    showParentAccountCategory: true,
  };

  accountCategoryVisibleToggleHandler = (e) => {
    this.props.form.setFieldsValue({ isVisible: e.target.value });
  }

  subAccountCategorySelectToggleHandler = (e) => {
    e.target.checked ?
      this.setState({ showCategoryBalanceType: false, showCategoryClassification: false, showParentAccountCategory: true })
      :
      this.setState({ showCategoryBalanceType: true, showCategoryClassification: true, showParentAccountCategory: false });
  }

  render() {
    const {
      visible,
      type,
      item = {},
      onOk,
      onCancel,
      form
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue,
    } = form;

    const { isSubCategory, showCategoryBalanceType, showCategoryClassification, showParentAccountCategory } = this.state;

    const accountCategory = (getFieldValue('parentAccount') ? getFieldValue('parentAccount').accountNumberRange : null);

    const accountCategorySelectProps = {
      onAccountCategorySelect(value) {
        setFieldsValue({ parentAccount: value });
      },
    };

    function handleOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = {
          category: true,
          ...getFieldsValue(),
        };
        onOk(data);
      });
    }

    const modalOpts = {
      title: `${type === 'create' ? 'New Account Category' : 'Edit Account Category'}`,
      visible,
      width: 640,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const tips = accountCategory ? 'Allowed account number range ' + accountCategory.minimum + ' - ' + accountCategory.maximum : '';

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                 initialValue: item.name,
                 rules: [
                   {
                     required: true,
                     message: 'Account Category name must be specified',
                  },
                 ],
              })(<Input />)}
            </FormItem>

            { (item.id == undefined || (item.id !== undefined && item.parentAccount === undefined)) && (
              <Row style={{ marginBottom: 10 }}>
                <Col span={14} offset={6}>
                  <Checkbox defaultChecked={isSubCategory}
                    onChange={this.subAccountCategorySelectToggleHandler}>Is a sub-category of?</Checkbox>
                </Col>
              </Row>
            )}

            { showParentAccountCategory || (item.id !== undefined && item.parentAccount !== undefined) ? (
              <FormItem label="Parent Account Category：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parentAccount', {
                  initialValue: item.parentAccount ? item.parentAccount : null,
                  rules: [
                    {
                      required: item.id !== undefined ? false : true,
                      message: 'Parent Account category must be specified',
                   },
                  ],
                })(<AccountCategorySelect
                    editValue={item.parentAccount ? item.parentAccount.name : null}
                    {...accountCategorySelectProps} />)}
              </FormItem>
            ) : null}

            { !showParentAccountCategory ? (
              <div>
                <FormItem
                  label="Account Number："
                  hasFeedback {...formItemLayout}>
                  {getFieldDecorator('code', {
                     initialValue: item.code,
                     rules: [
                       {
                         required: true,
                         message: 'Account Category prefix must be specified',
                      },
                     ],
                  })(<InputNumber min={0} />)}
                </FormItem>

              </div>
            ) : (
              <FormItem
                label="Account Prefix:"
                hasFeedback
                {...formItemLayout}
                help={accountCategory ? tips : null}
                style={{ marginBottom: 10 }} >
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [
                      {
                          required: true,
                          message: 'Account code must be specified',
                      },
                  ],
                  })(<Input
                    addonBefore={accountCategory ? (
                      <Tooltip title="Account Range Minimum allowed value ">
                        <span>{accountCategory.minimum}</span>
                      </Tooltip>) : 'Min'}
                    addonAfter={accountCategory ? (
                      <Tooltip title="Account No Maximum allowed  ">
                        <span>{accountCategory.maximum}</span>
                      </Tooltip>) : 'Max'}
                  />)}
              </FormItem>
            )}

            { (showCategoryClassification || item.id !== undefined) && (
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    Classification&nbsp;
                    <Tooltip title="Balance sheet account: Statement of financial position. Income statement account: Statement of financial activity">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
               )}
                hasFeedback
              >
                {getFieldDecorator('categoryClassification', {
                 initialValue: item.categoryClassification ? item.categoryClassification : null,
                 rules: [
                   {
                     required: true,
                     message: 'Category classification must be specified',
                  },
                 ],
              })(
                <RadioGroup>
                  <Radio value="BALANCESHEET">Balance Sheet</Radio>
                  <Radio value="INCOMESTATEMENT">Income Statement</Radio>
                </RadioGroup>
               )}
              </FormItem>
            )}
            { (showCategoryBalanceType || item.id !== undefined) && (
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    Balance Type&nbsp;
                    <Tooltip title="Debit balance or Credit balance">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
               )}
                hasFeedback
              >
                {getFieldDecorator('categoryBalanceType', {
                 initialValue: item.categoryBalanceType ? item.categoryBalanceType : null,
                 rules: [
                   {
                     required: true,
                     message: 'Balance type must be specified',
                  },
                 ],
              })(
                <RadioGroup>
                  <Radio value="DEBIT_BALANCE">Debit Balance</Radio>
                  <Radio value="CREDIT_BALANCE">Credit Balance</Radio>
                </RadioGroup>
               )}
              </FormItem>
            )}

            <FormItem label="Account No. Range" {...formItemLayout}>
              <Col span={11}>
                <FormItem hasFeedback>
                  {getFieldDecorator('accountNumberRange.minimum', {
                  initialValue: item.accountNumberRange ? item.accountNumberRange.minimum : null,
                  rules: [{
                   required: true,
                   message: 'Account Number Start range must be specified',
                  }],
               })(<InputNumber placeholder="Start" min={0} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
               -
                </span>
              </Col>
              <Col span={11}>
                <FormItem hasFeedback>
                  {getFieldDecorator('accountNumberRange.maximum', {
                  initialValue: item.accountNumberRange ? item.accountNumberRange.maximum : null,
                  rules: [{
                   required: true,
                   message: 'Account Number End range must be specified',
                  }],
               })(<InputNumber placeholder="End" min={0} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </FormItem>
            <Row>
              <Col span={14} offset={6}>
                <FormItem>
                  {getFieldDecorator('visible', {
                  initialValue: item.visible === undefined ? true : item.visible,
                })(
                  <Checkbox
                    defaultChecked={item.visible === undefined ? true : item.visible}
                    onChange={this.accountCategoryVisibleToggleHandler}
                  >
                    <span>Is account category visible?&nbsp;
                      <Tooltip title="Can it be used to do transactions e.g. Billing">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  </Checkbox>)
              }
                </FormItem>
              </Col>
            </Row>
            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
              })(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default AccountCategoryFormModal;
