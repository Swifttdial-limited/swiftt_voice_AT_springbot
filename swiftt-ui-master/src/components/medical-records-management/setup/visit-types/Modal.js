import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Modal,
  Tooltip,
  Icon,
  LocaleProvider,
  Row,
  Col
} from 'antd';
import { CompactPicker } from 'react-color';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';
import AccountsSelectGrid from '../../../common/accounting/AccountsSelectGrid';
import RoleSelect from '../../../common/RoleSelect';

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
class VisitTypeModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    selectedColorCode: '',
    hasValidityDuration: false,
    requiresAdmission: false
  };

  allowedIncomeAccountsSelectHandler = value => {
    const { form } = this.props
    const { getFieldValue, setFieldsValue } = form;

    const allowedIncomeAccounts = getFieldValue('allowedIncomeAccounts');

    if(value !== undefined && value.length > 0) {
      // console.log(allowedIncomeAccounts)
      // console.log(value)
      setFieldsValue({ allowedIncomeAccounts: value })
    }
  }

  colorChangeHandler = (color, e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ colorCode: color.hex });
  }

   emergencyCareChangeHandler = (e) => {
     const { form } = this.props;
     const { setFieldsValue } = form;

     setFieldsValue({ emergencyCare: e.target.checked });
   }

   handleAccountsChange = (value) => {
     const { form, item } = this.props
     const { getFieldDecorator, setFieldsValue } = form;

     item.allowedIncomeAccounts = value;
     getFieldDecorator('allowedIncomeAccounts', []);
     setFieldsValue({ allowedIncomeAccounts: value });
   }

   handleOk = () => {
     const { form, item, onOk } = this.props;
     const { validateFields, getFieldsValue, resetFields } = form;

     validateFields((errors) => {
       if (errors) {
         return;
       }
       const data = {
         ...getFieldsValue(),
       };
       onOk(data);
       resetFields();
     });
   }

   hasValidityPeriodChangeHandler = (e) => {
     const { form } = this.props;
     const { setFieldsValue } = form;

     setFieldsValue({ hasValidityDuration: e.target.checked });
     this.setState({ hasValidityDuration: e.target.checked });
   }

  requiresAdmissionChangeHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ requiresAdmission: e.target.checked });
    this.setState({ requiresAdmission: e.target.checked });
  }

  admittingRoleSelectHandler = value => this.props.form.setFieldsValue({ candidateAdmittingRole: value });

  assignableRoleSelectHandler = value => this.props.form.setFieldsValue({ candidateAssignToRoles: value });

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    const { hasValidityDuration, requiresAdmission } = this.state;

    const modalOpts = {
      title: `${type === 'create' ? 'New Visit Type' : 'Edit Visit Type'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      width: 720,
      wrapClassName: 'vertical-center-modal',
    };

    const allowedIncomeAccountSelectProps = {
      multiSelect: true,
    }

    const admittingRoleSelectProps = {
      multiSelect: false,
    };

    const assignableRoleSelectProps = {
      multiSelect: true,
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
                    message: 'Name must be specified.',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Prefix：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('prefix', {
                initialValue: item.prefix,
                rules: [
                  {
                    required: true,
                    message: 'Prefix must be specified.',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Color Code：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('colorCode', {
                initialValue: item.colorCode,
                rules: [
                  {
                    required: true,
                    message: 'Color code must be specified.',
                 },
                ],
              })(<CompactPicker onChangeComplete={this.colorChangeHandler} />)}
            </FormItem>

            <FormItem label="Allowed Income Accounts:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('allowedIncomeAccounts', {
                initialValue: (item.allowedIncomeAccounts !== undefined && item.allowedIncomeAccounts.length > 0) ? item.allowedIncomeAccounts : null,
                rules: [
                  {
                    required: true,
                    message: 'Allowed Income account(s) must be specified',
                 },
                ],
               })(<AccountSelect
                 editValue={item.allowedIncomeAccounts ? item.allowedIncomeAccounts : null}
                 {...allowedIncomeAccountSelectProps}
                 onAccountSelect={this.allowedIncomeAccountsSelectHandler} />)}
            </FormItem>

            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('requiresAdmission', {
                initialValue: item.requiresAdmission === undefined ? false : item.requiresAdmission,
             })(
               <Checkbox
                 defaultChecked={item.requiresAdmission === undefined ? false : item.requiresAdmission} 
                 onChange={this.requiresAdmissionChangeHandler}>
                 <span>Requires admission before billing? &nbsp;
                   <Tooltip title="Requires admission before billing?">
                     <Icon type="question-circle-o" />
                   </Tooltip>
                 </span>
               </Checkbox>)
             }
            </FormItem>

            { (requiresAdmission || getFieldValue('requiresAdmission')) && (
              <FormItem label="Admitting Role:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('candidateAdmittingRole', {
                    initialValue: item.candidateAdmittingRole ? item.candidateAdmittingRole : null,
                    rules: [
                      {
                        required: true,
                        message: 'Admitting role must be specified',
                      }
                    ],
                 })(<RoleSelect
                    editValue={item.candidateAdmittingRole ? item.candidateAdmittingRole : null}
                    {...admittingRoleSelectProps}
                    onRoleSelect={this.admittingRoleSelectHandler} />)}
              </FormItem>
            )}

            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('hasValidityDuration', {
                valuePropName: 'checked',
                initialValue: item.hasValidityDuration === undefined ? false : item.hasValidityDuration,
             })(
               <Checkbox
                 onChange={this.hasValidityPeriodChangeHandler}>
                 <span>Has a validity period? &nbsp;
                   <Tooltip title="Is it active for operation for a specific number of hours?">
                     <Icon type="question-circle-o" />
                   </Tooltip>
                 </span>
               </Checkbox>)
             }
            </FormItem>

            { (hasValidityDuration || getFieldValue('hasValidityDuration')) && (
            <FormItem label="Validity Period (Hours):" hasFeedback {...formItemLayout}>
                {getFieldDecorator('validityDuration', {
                  initialValue: item.validityDuration,
                  rules: [
                    {
                      required: true,
                      message: 'Validity period must be specified',
                   },
                  ],
               })(<InputNumber min={1} />)}
            </FormItem>
)}

            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('emergencyCare', {
                      initialValue: item.emergencyCare,
                  })(
                    <Checkbox defaultChecked={false} onChange={this.emergencyCareChangeHandler}>
                      <span>Requires emergency care? &nbsp;
                        <Tooltip title="Requires emergency care?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>)
                  }
            </FormItem>

            <FormItem label="Assign To:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('candidateAssignToRoles', {
                  initialValue: item.candidateAssignToRoles ? item.candidateAssignToRoles : null,
               })(<RoleSelect
                  editValue={item.candidateAssignToRoles ? item.candidateAssignToRoles : null}
                  {...assignableRoleSelectProps}
                  onRoleSelect={this.assignableRoleSelectHandler} />)}
            </FormItem>

            <FormItem label="Description:" hasFeedback {...formItemLayout}>
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

export default VisitTypeModal;
