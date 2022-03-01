import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Modal,
  LocaleProvider,
  Checkbox,
  Input,
  InputNumber,
  Tooltip,
  Radio,
  Icon,
  Row,
  Col,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';
import ContactSelect from '../../../common/ContactSelect';
import DepartmentSelect from '../../../common/DepartmentSelect';
import WalletTypeSelect from '../../../common/WalletTypeSelect';
import ProductGroupsTransfer from '../../../common/GroupsTransfer';

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

const headerFormItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

@Form.create()
class BillingGroupModal extends PureComponent {
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

  state = {
    hasLimit: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.item.id) {
      return {
        hasLimit: nextProps.item.typeOfValue ? true : false,
      }
    }

    return null;
  }

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

  hasLimitChangeHandler = (e) => {
    this.setState({ hasLimit: e.target.checked }, () => {
      this.props.form.setFieldsValue({ hasLimit: e.target.checked });
    });
  }

  render() {
    const {
      visible,
      type,
      item = {},
      onOk,
      onCancel,
      form,
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
      getFieldValue,
    } = form;

    const { hasLimit } = this.state;

    const modalOpts = {
      title: `${type === 'create' ? 'New Billing Group' : 'Edit Billing Group'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      width: 840,
      wrapClassName: 'vertical-center-modal',
    };

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'CUSTOMER',
      onContactSelect(value) {
        setFieldsValue({ customer: value });
      },
    };

    const assetAccountSelectProps = {
      onAccountSelect(value) {
        setFieldsValue({ assetAccount: value });
      },
    };

    const expenseAccountSelectProps = {
      onAccountSelect(value) {
        setFieldsValue({ expenseAccount: value });
      },
    };

    const departmentSelectProps = {
      onDepartmentSelect(value) {
        if(value)
          setFieldsValue({ department: value });
        else {
          setFieldsValue({ department: null });
        }
      }
    };

    const walletTypeSelectProps = {
      customer: getFieldValue('customer') ? getFieldValue('customer') : null,
      disabled: getFieldValue('customer') ? false : true,
      onWalletTypeSelect(value) {
        setFieldsValue({ walletType: value });
      },
    }

    const productGroupsSelectProps = {
      disabled: getFieldValue('department') ? false : true,
      multiSelect: true,
      department: getFieldValue('department') ? getFieldValue('department') : null,
      onGroupSelect(value) {
        setFieldsValue({ productGroups: value });
      },
    }

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
                    message: 'Name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Department:" hasFeedback {...headerFormItemLayout}>
              {getFieldDecorator('department', {
                initialValue: item.department ? item.department : null,
                rules: [
                  {
                    required: true,
                    message: 'Filtering department must be specified',
                  },
                ],
              })(<DepartmentSelect editValue={item.department ? item.department.name : null}
                {...departmentSelectProps}
              />)}
            </FormItem>
            <FormItem label="Product Group(s):" hasFeedback {...headerFormItemLayout}>
              {getFieldDecorator('productGroups', {
                initialValue: item.productGroups ? item.productGroups : null,
                rules: [
                  {
                    required: true,
                    message: 'At least one product group must be specified',
                  },
                ],
              })(<ProductGroupsTransfer
                editValue={item.productGroups ? item.productGroups : null}
                {...productGroupsSelectProps}
              />)}
            </FormItem>

            <FormItem label="Customer:" hasFeedback {...headerFormItemLayout}>
              {getFieldDecorator('customer', {
                initialValue: item.customer ? item.customer : null,
                rules: [
                  {
                    required: true,
                    message: 'Customer must be specified',
                  },
                ],
              })(<ContactSelect
                editValue={item.customer ? item.customer.name : null}
                {...contactSelectProps}
              />)}
            </FormItem>

            <FormItem label="Type of Wallet:" hasFeedback {...headerFormItemLayout}>
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
                {...walletTypeSelectProps}
              />)}
            </FormItem>

            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('hasLimit', {
                valuePropName: 'checked',
                initialValue: hasLimit,
             })(
               <Checkbox
                 onChange={this.hasLimitChangeHandler}>
                 <span>Has a billing limit? &nbsp;
                   <Tooltip title="Do the bill items in the billing group have a limit?">
                     <Icon type="question-circle-o" />
                   </Tooltip>
                 </span>
               </Checkbox>)
             }
            </FormItem>

            { hasLimit && (
              <Fragment>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                    Type of Value&nbsp;
                      <Tooltip title="Percentage or Amount">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                  hasFeedback
                >
                  {getFieldDecorator('typeOfValue', {
                    initialValue: item.typeOfValue,
                    rules: [
                      {
                        required: true,
                        message: 'Type of Value must be specified',
                     },
                    ],
                 })(
                   <RadioGroup>
                     <Radio value="AMOUNT">Fixed Amount</Radio>
                     <Radio value="PERCENTAGE">Percentage</Radio>
                   </RadioGroup>
                  )}
                </FormItem>

                <FormItem label="Value：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('value', {
                    initialValue: item.value ? item.value : null,
                    rules: [
                      {
                        required: true,
                        message: 'Value must be specified',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} min={0}/>)}
                </FormItem>

                <FormItem label="Gain Asset Account：" hasFeedback {...formItemLayout}>
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
                    {...assetAccountSelectProps}
                  />)}
                </FormItem>
                <FormItem label="Loss Expense Account：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('expenseAccount', {
                    initialValue: item.expenseAccount,
                    rules: [
                      {
                        required: false,
                        message: 'Expense Account must be specified',
                      },
                    ],
                  })(<AccountSelect
                    editValue={item.expenseAccount ? `${item.expenseAccount.name}(${item.expenseAccount.accountNumber})` : null}
                    {...expenseAccountSelectProps}
                  />)}
                </FormItem>
              </Fragment>
            )}
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default BillingGroupModal;
