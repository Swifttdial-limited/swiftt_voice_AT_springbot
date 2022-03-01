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

import AccountSelect from '../../../common/AccountSelect';
import AccountCategorySelect from '../../../common/AccountCategorySelect';
import TagSelect from '../../../common/TagSelect';

import { queryNextAccountNumber } from '../../../../services/accounting/accounts';

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
class AccountFormModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    isSubAccount: false,
    showParentAccountSelect: false,
  };

  onSubAccountAccountSelectToggleHandler = (e) => {
    e.target.checked ?
      this.setState({ showParentAccountSelect: true })
      :
      this.setState({ showParentAccountSelect: false });
  }

  accountsCategorySelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    setFieldsValue({ parentAccount: value });

    if (value) {
      queryNextAccountNumber({
        publicId: value.publicId,
        actionType: 'NEXT_ACCOUNT_NUMBER',
      }).then((response) => {
          if(response.value) {
            setFieldsValue({ code: response.value });
          } else {
            setFieldsValue({ code: null });
          }
        });
    } else {
      setFieldsValue({ code: null });
    }

    validateFields(['code'], { force: true });
  }

  parentAccountSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    setFieldsValue({ parentAccount: value });
  }

  accountVisibleToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ visible: e.target.value });
  }

  accountIsControlAccountToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ controlAccount: e.target.value });
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

    const { isSubAccount, showParentAccountSelect } = this.state;

    const parentAccount = (getFieldValue('parentAccount') ? getFieldValue('parentAccount').accountNumberRange : null);

    const incomeAccountsSelectProps = {
      multiSelect: false,
      onAccountSelect(value) {
        setFieldsValue({ incomeAccounts: value });
      },
    };

    const tagSelectProps = {
      multiSelect: true,
      onTagSelect(value) {
        setFieldsValue({ objects: value });
      },
    };

    function handleOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = {
          category: false,
          ...getFieldsValue(),
        };
        onOk(data);
      });
    }

    const modalOpts = {
      title: `${type === 'create' ? 'New Account' : 'Edit Account'}`,
      visible,
      width: 640,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const tips = parentAccount ? 'Allowed account number range ' + parentAccount.minimum + ' - ' + parentAccount.maximum : '';

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>

            <FormItem label="Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [
                    {
                        required: true,
                        message: 'Account name must be specified',
                    },
                ],
              })(<Input placeholder="Account name" />)}
            </FormItem>

            { (item.id == undefined || (item.id !== undefined && item.parentAccount === undefined)) && (
              <Row style={{ marginBottom: 10 }}>
                <Col span={14} offset={6}>
                  <Checkbox defaultChecked={isSubAccount}
                    onChange={this.onSubAccountAccountSelectToggleHandler}>Is a sub-account of</Checkbox>
                </Col>
              </Row>
            )}

            {(item.id == undefined && showParentAccountSelect) && (
              <FormItem label="Parent Account：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parentAccount', {
                  initialValue: item.parentAccount ? item.parentAccount : null,
                  rules: [
                      {
                          required: true,
                          message: 'Parent Account must be specified',
                      },
                  ],
                })(<AccountSelect
                    editValue={item.parentAccount ? item.parentAccount.name : null}
                    onAccountSelect={this.parentAccountSelectHandler} />)}
              </FormItem>
            )}

            {(item.id == undefined && !showParentAccountSelect) && (
              <FormItem label="Account Category：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parentAccount', {
                  initialValue: item.parentAccount,
                  rules: [
                      {
                          required: true,
                          message: 'Account category must be specified',
                      },
                  ],
                })(<AccountCategorySelect
                  editValue={item.parentAccount ? item.parentAccount.name : null}
                  onAccountCategorySelect={this.accountsCategorySelectHandler}
                />)}
              </FormItem>
            )}

            {(item.id != undefined && item.parentAccount && item.parentAccount.category) && (
              <FormItem label="Account Category：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parentAccount', {
                  initialValue: item.parentAccount,
                  rules: [
                      {
                          required: true,
                          message: 'Account category must be specified',
                      },
                  ],
                })(<AccountCategorySelect
                  editValue={item.parentAccount ? item.parentAccount.name : null}
                  onAccountCategorySelect={this.accountsCategorySelectHandler}
                />)}
              </FormItem>
            )}

            {(item.id != undefined && item.parentAccount && !item.parentAccount.category) && (
              <FormItem label="Parent Account：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parentAccount', {
                  initialValue: item.parentAccount ? item.parentAccount : null,
                  rules: [
                      {
                          required: true,
                          message: 'Parent Account must be specified',
                      },
                  ],
                })(<AccountSelect
                    editValue={item.parentAccount ? item.parentAccount : null}
                    onAccountSelect={this.parentAccountSelectHandler} />)}
              </FormItem>
            )}

            { showParentAccountSelect ? (
              <FormItem label="Account No:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [
                      {
                          required: true,
                          message: 'Account code must be specified',
                      },
                  ],
                })(<Input length={4} placeholder="Account code" />)}
              </FormItem>
            ) : (
              <FormItem
                label="Account No:"
                hasFeedback
                {...formItemLayout}
                help={parentAccount ? tips : null}
                style={{ marginBottom: 10 }} >
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [
                      {
                          required: true,
                          message: 'Account code must be specified',
                      },
                  ],
                  })(<Input placeholder="Account code"
                    addonBefore={parentAccount ? (
                      <Tooltip title="Account Range Minimum allowed value ">
                        <span>{parentAccount.minimum}</span>
                      </Tooltip>) : 'Min'}
                    addonAfter={parentAccount ? (
                      <Tooltip title="Account No Maximum allowed  ">
                        <span>{parentAccount.maximum}</span>
                      </Tooltip>) : 'Max'}
                  />)}
              </FormItem>
            )}


            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
              })(<TextArea rows={4} />)}
            </FormItem>

            <FormItem label="Tags:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('objects', {
                initialValue: (item.objects !== undefined && item.objects.length > 0) ? item.objects : null,
              })
              (<TagSelect
                editValue={item.objects ? item.objects : null}
                {...tagSelectProps} />)}
            </FormItem>

            <FormItem {...noLabelTailFormItemLayout}>
              {getFieldDecorator('controlAccount', {
                initialValue: item.controlAccount,
              })(
                <Checkbox
                  defaultChecked={item.controlAccount ? item.controlAccount : false}
                  onChange={this.accountIsControlAccountToggleHandler}
                >
                  <span>Is it a control account?&nbsp;
                    <Tooltip title="Can it be used to record the balances on a number of subsidiary accounts and to provide a cross-check on them?">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                </Checkbox>)}
            </FormItem>

            <FormItem {...noLabelTailFormItemLayout}>
              {getFieldDecorator('visible', {
                initialValue: item.visible === undefined ? true : item.visible,
              })(
                <Checkbox
                  defaultChecked={item.visible === undefined ? true : item.visible}
                  onChange={this.accountVisibleToggleHandler}
                >
                  <span>Is account visible?&nbsp;
                    <Tooltip title="Can it be used to do transactions e.g. Billing">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                </Checkbox>)}
            </FormItem>

          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default AccountFormModal;
