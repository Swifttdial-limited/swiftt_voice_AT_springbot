import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Checkbox, Select, Row, Tooltip, Radio, LocaleProvider, Icon,
  Button,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../../common/AccountSelect';
import CountrySelect from '../../../../common/CountrySelect';
import PhoneNumberInput from '../../../../common/PhoneNumberInput';

const FormItem = Form.Item;

@Form.create()
@connect(({ contacts }) => ({
  contacts,
}))
class ContactDetailsStep extends PureComponent {

  static defaultProps = {
    contacts: {},
  };

  static propTypes = {
    contacts: PropTypes.object,
  };

  state = {
    selectedCountry: {},
    showCreditorsAccountFormItem: false,
    showDebtorsAccountFormItem: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'contacts/purge' });
  }

  componentWillUnmount() {}

    alternativePhoneNumberChangeHandler = value => (value ? this.props.form.setFieldsValue({ alternativePhoneNumber: value }) : this.props.form.validateFields(['alternativePhoneNumber']));

    countrySelectChange = (value) => {
      this.props.form.setFieldsValue({ 'address.country': value });
      this.setState({ selectedCountry: value || {} });
    }

    creditorsAccountSelectHandler = value => (value ? this.props.form.setFieldsValue({ creditorsAccount: value }) : this.props.form.validateFields(['creditorsAccount']));

    customerToggleHandler = (e) => {
      this.props.form.setFieldsValue({ customer: e.target.value });

      e.target.value
        ? this.setState({ showDebtorsAccountFormItem: false })
        : this.setState({ showDebtorsAccountFormItem: true });
    }

    debtorsAccountSelectHandler = value => (value ? this.props.form.setFieldsValue({ debtorsAccount: value }) : this.props.form.validateFields(['debtorsAccount']));

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.dispatch({ type: 'contacts/create', payload: values });
        }
      });
    }

    hasErrors = (fieldsError) => {
      return Object
        .keys(fieldsError)
        .some(field => fieldsError[field]);
    }

    phoneNumberChangeHandler = value =>
      (value ? this.props.form.setFieldsValue({ phoneNumber: value }) : this.props.form.validateFields(['phoneNumber']));

    vendorToggleHandler = (e) => {
      this.props.form.setFieldsValue({ vendor: e.target.value });

      e.target.value
        ? this.setState({ showCreditorsAccountFormItem: false })
        : this.setState({ showCreditorsAccountFormItem: true });
    }

    render() {
      const { form, contacts } = this.props;
      const { getFieldDecorator } = form;

      const {
        selectedCountry,
        showCreditorsAccountFormItem,
        showDebtorsAccountFormItem,
      } = this.state;
      const { iso2, phoneCode } = selectedCountry;

      const formItemLayout = {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
      };

      const noLabelFormItemLayout = {
        wrapperCol: {
          span: 14,
          offset: 6,
        },
      };

      return (
        <div id="advanced-form" style={{ padding: 20 }}>
          <Row gutter={10}>
            <LocaleProvider locale={enUS}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem label="Name：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: 'Contact name must be specified',
                       },
                      ],
                   })(<Input placeholder="Contact name" />)}
                </FormItem>
                <FormItem label="Code:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: false,
                     },
                    ],
                 })(<Input placeholder="Contact code" />)}
                </FormItem>
                <FormItem {...noLabelFormItemLayout} style={{ marginBottom: 8, textAlign: 'left' }}>
                  {getFieldDecorator('customer', {
                        initialValue: false,
                     })(
                       <Checkbox onChange={this.customerToggleHandler}>
                         <span>Is this contact a customer
                           <Tooltip title="Customer">
                             <Icon type="question-circle-o" />
                           </Tooltip>
                         </span>
                       </Checkbox>)
                     }
                </FormItem>
                { showDebtorsAccountFormItem && (
                <FormItem label="Debtors Account:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('debtorsAccount', {
                                  rules: [
                                    {
                                      required: true,
                                      message: 'Debtors account must be specified',
                                   },
                                  ],
                               })(<AccountSelect onAccountSelect={this.debtorsAccountSelectHandler} />)}
                </FormItem>
)}
                <FormItem {...noLabelFormItemLayout} style={{ marginBottom: 8, textAlign: 'left' }}>
                  {getFieldDecorator('vendor', {
                                initialValue: false,
                             })(
                               <Checkbox onChange={this.vendorToggleHandler}>
                                 <span>Is this contact a Supplier / Vendor
                                   <Tooltip title="Vendor">
                                     <Icon type="question-circle-o" />
                                   </Tooltip>
                                 </span>
                               </Checkbox>)
                             }
                </FormItem>
                { showCreditorsAccountFormItem && (
                <FormItem label="Creditors Account:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('creditorsAccount', {
                                  rules: [
                                    {
                                      required: true,
                                      message: 'Creditors account must be specified',
                                   },
                                  ],
                               })(<AccountSelect onAccountSelect={this.creditorsAccountSelectHandler} />)}
                </FormItem>
)}
                <FormItem label="Email Address：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('emailAddress', {
                                rules: [
                                  {
                                      type: 'email',
                                      message: 'The input is not valid E-mail!',
                                 },
                                ],
                             })(<Input placeholder="Email address" />)}
                </FormItem>
                <FormItem label="Alternative Email Address：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('alternativeEmailAddress', {
                                rules: [
                                  {
                                      type: 'email',
                                      message: 'The input is not valid E-mail!',
                                 },
                                ],
                             })(<Input placeholder="Alternative Email address" />)}
                </FormItem>
                <FormItem label="Website" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('website', {
                                 rules: [
                                   {
                                       type: 'url',
                                       message: 'The input is not valid website address!',
                                  },
                                 ],
                              })(<Input placeholder="Website" />)}
                </FormItem>

                <FormItem label="Portal Website" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('portalWebsite', {
                       rules: [
                         {
                             type: 'url',
                             message: 'The input is not valid website address!',
                        },
                       ],
                    })(<Input placeholder="Portal Website" />)}
                </FormItem>

                <FormItem label="Country:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address.country', {
                                  rules: [
                                      {
                                          required: true,
                                          message: 'Country must be specified',
                                      },
                                  ],
                              })(<CountrySelect onCountrySelect={this.countrySelectChange} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Phone Number" hasFeedback>
                  {getFieldDecorator('phoneNumber', {
                                  rules: [
                                      {
                                          required: true,
                                          message: 'Please input valid phone number!',
                                      },
                                  ],
                              })(<PhoneNumberInput
                                countryCode={iso2}
                                phoneCode={phoneCode}
                                onPhoneNumberChange={this.phoneNumberChangeHandler}
                              />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Alternative Phone">
                  {getFieldDecorator('alternativePhoneNumber', {})(<PhoneNumberInput
                    countryCode={iso2}
                    phoneCode={phoneCode}
                    onPhoneNumberChange={this.alternativePhoneNumberChangeHandler}
                  />)}
                </FormItem>
                <FormItem label="City / Town:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address.city', {
                              rules: [
                                {
                                  required: true,
                                  message: 'City / Town must be specified',
                               },
                              ],
                           })(<Input placeholder="City / Town" />)}
                </FormItem>
                <FormItem label="Physical / Street Address:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address.streetAddress', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Physical / Street address must be specified',
                               },
                              ],
                           })(<Input placeholder="Physical / Street address" />)}
                </FormItem>
                <FormItem label="Postal Address:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address.postalAddress', {
                              rules: [
                                {
                                  required: false,
                                  message: 'Postal address must be specified',
                               },
                              ],
                           })(<Input placeholder="Postal address" />)}
                </FormItem>
                <FormItem label="Postal Code:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address.postalCode', {
                              rules: [
                                {
                                  required: false,
                                  message: 'Postal Code must be specified',
                               },
                              ],
                           })(<Input placeholder="Postal code" />)}
                </FormItem>

                <FormItem {...noLabelFormItemLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >Save
                  </Button>
                </FormItem>

              </Form>
            </LocaleProvider>
          </Row>
        </div>
      );
    }
}

export default ContactDetailsStep;
