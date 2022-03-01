import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Radio, Modal, LocaleProvider, Checkbox, Row, Col, Tooltip, Icon } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';
import DepartmentSelect from '../../../common/DepartmentSelect';
import GroupSelect from '../../../common/GroupSelect';
import TaxCodeSelect from '../../../common/accounting/TaxCodeSelect';

const FormItem = Form.Item;
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
class ProductsBulkUpdateModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    groupSelectDisabled: true,
  };

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

  departmentSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    if (value) {
      setFieldsValue({ department: value });
      this.setState({ groupSelectDisabled: false });
    } else {
      this.setState({ groupSelectDisabled: true });
    }
  }

  onReplaceExistingIncomeAccountsHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ replaceIncomeAccounts: e.target.checked })
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    const { groupSelectDisabled } = this.state;

    const modalOpts = {
      title: 'Product Bulk Update',
      visible,
      onOk: this.handleOk,
      onCancel,
      width: 720,
      wrapClassName: 'vertical-center-modal',
    };

    const departmentSelectProps = {
      multiSelect: false,
    };

    const groupSelectProps = {
      disabled: groupSelectDisabled,
      department: getFieldValue('department'),
      multiSelect: false,
      onGroupSelect(value) {
        setFieldsValue({ group: value });
      },
    };

    const incomeAccountsSelectProps = {
      multiSelect: true,
      onAccountSelect(value) {
        setFieldsValue({ incomeAccounts: value });
      },
    };

    const costAccountSelectProps = {
      multiSelect: false,
      onAccountSelect(value) {
        setFieldsValue({ costAccount: value });
      },
    };

    const inventoryAccountSelectProps = {
      multiSelect: false,
      onAccountSelect(value) {
        setFieldsValue({ stockAccount: value });
      },
    };

    const taxCodeSelectProps = {
      multiSelect: false,
      onTaxCodeSelect(value) {
        setFieldsValue({ taxCode: value });
      },
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Department:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('department', {
                rules: [
                  {
                    required: true,
                    message: 'Deparment must be specified',
                 },
                ],
             })(<DepartmentSelect onDepartmentSelect={this.departmentSelectHandler} {...departmentSelectProps} />)}
            </FormItem>

            <FormItem label="Group:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('group', {})(<GroupSelect {...groupSelectProps} />)}
            </FormItem>

            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('replaceIncomeAccounts', {
                valuePropName: 'replaceIncomeAccounts',
                initialValue: false,
             })(
               <Checkbox onChange={this.onReplaceExistingIncomeAccountsHandler}>
                 <span>Replace existing income accounts?&nbsp;
                   <Tooltip title="Do you want to replace existing income accounts?">
                     <Icon type="question-circle-o" />
                   </Tooltip>
                 </span>
               </Checkbox>
             )}
            </FormItem>

            <FormItem label="Income Accounts:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('incomeAccounts', {})(<AccountSelect {...incomeAccountsSelectProps} />)}
            </FormItem>

            <FormItem label="Inventory / Stock Account:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('stockAccount', {})(<AccountSelect {...inventoryAccountSelectProps} />)}
            </FormItem>

            <FormItem label="Cost Account:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('costAccount', {})(<AccountSelect {...costAccountSelectProps} />)}
            </FormItem>

            <FormItem label="Tax Code:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('taxCode', {})(<TaxCodeSelect {...taxCodeSelectProps} />)}
            </FormItem>

          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default ProductsBulkUpdateModal;
