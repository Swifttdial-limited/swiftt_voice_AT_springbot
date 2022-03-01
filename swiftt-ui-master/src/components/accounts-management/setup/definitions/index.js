import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  InputNumber,
  LocaleProvider,
  Tooltip,
  Icon,
  Select,
  Divider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DescriptionList from '../../../DescriptionList';
import AccountSelect from '../../../common/AccountSelect';
import CurrencySelect from '../../../common/accounting/CurrencySelect';

const { Description } = DescriptionList;
const { Option } = Select;
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
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

@Form.create()
@connect(({ accountingPreferences, loading }) => ({
  accountingPreferences,
  loading: loading.effects['accountingPreferences.query']
}))
class AccountsDefinitionView extends PureComponent {

  static propTypes = {
    accountingPreferences: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    isEditActive: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'accountingPreferences/query' });
  }

  onEditDetailsButtonClickHandler = () => this.setState({ isEditActive: !this.state.isEditActive });

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form, accountingPreferences } = this.props;
    const { data } = accountingPreferences;
    const { validateFields, getFieldsValue } = form;

    const preference = data.id ? data : null;

    validateFields((errors) => {
      if (!errors) {
        const updateData = {
          ...getFieldsValue(),
          publicId: preference.publicId,
          version: preference.version,
          id: preference.id,
        };
        dispatch({ type: 'accountingPreferences/update', payload: updateData });
      }
    });
  }


  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleSeparatorSelectChange = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ accountSeparator: value });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
  }

  onAccountSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ journalingControlAccount: value });
  }

  onDiscountReceivedAccountSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ discountReceivedAccount: value });
  }

  onDiscountAllowedAccountSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ discountAllowedAccount: value });
  }

  baseCurrencySelectHandler = value => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ baseCurrency: value });
  }

  cashPaymentSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ cashPaymentsControlAccount: value });
  }


  render() {
    const { accountingPreferences, form } = this.props;
    const { data, loading, success } = accountingPreferences;
    const { getFieldDecorator, getFieldsError } = form;

    const preference = data.id ? data : null;

    const { isEditActive } = this.state;

    const accountSelectProps = {
      isControlAccount: true,
    };

    const accountingPreferencesFormItems = (
      <div>
        <FormItem
          label="Account Separator"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('accountSeparator', {
              initialValue: preference ? preference.accountSeparator  : null,
              rules:
                [
                  {
                    required: true,
                    message: 'Account separator must be specified',
                  },
                ],
            })(
              <Select
                allowClear
                placeholder="Select a separator"
                onChange={this.handleSeparatorSelectChange}
              >
                <Option value="/">Forward Slash (/)</Option>
                <Option value=",">Back Slash (\)</Option>
                <Option value="-">Hyphen (-)</Option>
                <Option value=".">FullStop / Period (.)</Option>
              </Select>
            )}
        </FormItem>
        <FormItem
          label="Length of Account Number:"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('accountNumberLength', {
              initialValue: preference ? preference.accountNumberLength  : null,
              rules:
                [
                  {
                    required: true,
                    message: 'Account number length must be specified',
                  },
                ],
            })(
              <InputNumber min={1} max={5} />
            )}
        </FormItem>
        <FormItem
          label="Base Currency"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('baseCurrency', {
            initialValue: preference ? preference.baseCurrency : null,
            rules: [
              {
                required: false,
              },
            ],
          })(<CurrencySelect
            editValue={preference && preference.baseCurrency ?
              preference.baseCurrency.name + ' ('+ preference.baseCurrency.code +')' :
              null}
            onCurrencySelect={this.baseCurrencySelectHandler}
            />)}
        </FormItem>
        <Divider />
        <FormItem
          label="Discount Received Account"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('discountReceivedAccount', {
            initialValue: preference ? preference.discountReceivedAccount : null,
          })(<AccountSelect
            {...accountSelectProps}
            editValue={preference && preference.discountReceivedAccount ?
              preference.discountReceivedAccount :
              null}
            onAccountSelect={this.onDiscountReceivedAccountSelectHandler}
          />)}
        </FormItem>
        <FormItem
          label="Discount Allowed Account"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('discountAllowedAccount', {
            initialValue: preference && preference.discountAllowedAccount ?
            preference.discountAllowedAccount : null,

          })(<AccountSelect
            {...accountSelectProps}
            editValue={preference && preference.discountAllowedAccount ?
              preference.discountAllowedAccount :
              null}
            onAccountSelect={this.onDiscountAllowedAccountSelectHandler}
          />)}
        </FormItem>
        <Divider />
        <FormItem
          label="Journal Control Account"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('journalingControlAccount', {
            initialValue: preference ? preference.journalingControlAccount : null,

          })(<AccountSelect
            {...accountSelectProps}
            editValue={preference && preference.journalingControlAccount ?
              preference.journalingControlAccount :
              null}
            onAccountSelect={this.onAccountSelectHandler}
          />)}
        </FormItem>
        <FormItem
          label="Cash Payment Control Account"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('cashPaymentsControlAccount', {
            initialValue: preference && preference.cashPaymentsControlAccount ?
            preference.cashPaymentsControlAccount : null,

          })(<AccountSelect
            {...accountSelectProps}
            editValue={preference && preference.cashPaymentsControlAccount ?
              preference.cashPaymentsControlAccount :
              null}
            onAccountSelect={this.cashPaymentSelectHandler}
          />)}
        </FormItem>
      </div>
    );

    return (
      <div>
        {!loading && success && (
          <div>
            {!isEditActive && (
            <Row>
              <Col offset={22} span={2}>
                <Tooltip title="Edit details">
                  <Button
                    type="dashed"
                    shape="circle"
                    icon="edit"
                    onClick={this.onEditDetailsButtonClickHandler}
                  />
                </Tooltip>
              </Col>
            </Row>
          )}
            <Form layout="horizontal" onSubmit={this.handleFormSubmit}>
              { !isEditActive ? (
                <div>
                  <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                    <Description term="Account Seperator">{preference ? preference.accountSeparator : 'Not specified'}</Description>
                    <Description term="Account Number Length">{preference ? preference.accountNumberLength : 'Not specified'}</Description>
                    <Description term="Base Currency">{(preference && preference.baseCurrency) ? preference.baseCurrency.name + ' ('+preference.baseCurrency.code+')' : 'Not specified'}</Description>
                  </DescriptionList>
                  <Divider />
                  <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                    <Description term="Discount Received Account">{(preference && preference.discountReceivedAccount) ? preference.discountReceivedAccount.name : 'Not specified'}</Description>
                    <Description term="Discount Allowed Account">{(preference && preference.discountAllowedAccount) ? preference.discountAllowedAccount.name : 'Not specified'}</Description>
                  </DescriptionList>
                  <Divider />
                  <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                    <Description term="Journal Control Account">{(preference && preference.journalingControlAccount) ? preference.journalingControlAccount.name : 'Not specified'}</Description>
                    <Description term="Cash Payment Control Account">{(preference && preference.cashPaymentsControlAccount) ? preference.cashPaymentsControlAccount.name : 'Not specified'}</Description>
                  </DescriptionList>
                </div>
              ) : (
                <div>{accountingPreferencesFormItems}</div>
              )}
              {isEditActive && (
                <FormItem {...tailFormItemLayout}>
                  <Button
                    type="danger"
                    icon="close"
                    onClick={this.onEditDetailsButtonClickHandler}
                    style={{ marginRight: 10 }}
                  >Cancel</Button>
                  <Button
                    type="primary"
                    icon="save"
                    htmlType="submit">Save</Button>
                </FormItem>
            )}
            </Form>
          </div>
)}
      </div>
    );
  }
}

export default AccountsDefinitionView;
