import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import enUS from 'antd/lib/locale-provider/en_US';
import { Form, Card, Input, Button, LocaleProvider, DatePicker } from 'antd';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ContactSelect from '../../../../components/common/ContactSelect';
import CountrySelect from '../../../../components/common/CountrySelect';
import PhoneNumberInput from '../../../../components/common/PhoneNumberInput';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
@connect(({ scheme, loading }) => ({
  scheme,
  loading: loading.effects['scheme/query'],
}))
class SchemeForm extends PureComponent {

  static propTypes = {
    form: PropTypes.object,
  };

  state = {
    selectedCountry: {},
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/accounts/schemes'));
  }

  handleSubmit = () => {
    const { dispatch, scheme, form } = this.props;
    const { data } = scheme;

    form.validateFields((err, values) => {
      if (!err) {
        if (data.publicId === undefined) { dispatch({ type: 'schemes/create', payload: values }); } else { dispatch({ type: 'schemes/update', payload: Object.assign({}, data, values) }); }
      } else {}
    });
  }

  handleSubmitAndNew = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmit();
        form.resetFields();
      } else {}
    });
  }

  handleSubmitAndClose = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmit();
        dispatch(routerRedux.push('/accounts/schemes'));
      } else {}
    });
  }

  alternativePhoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ alternativePhoneNumber: value }) : this.props.form.validateFields(['alternativePhoneNumber']));

  countrySelectChange = (value) => {
    this.props.form.setFieldsValue({ 'address.country': value });
    this.setState({ selectedCountry: value || {} });
  }

  phoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ phoneNumber: value }) : this.props.form.validateFields(['phoneNumber']));

  contactChangeHandler = (value) => {
    const { form } = this.props;

    if (value) {
      form.setFieldsValue({ contact: value });
      this.setState({ selectedCountry: value.address.country });
    } else {
      form.setFieldsValue({ contact: null });
      form.validateFields(['contact']);
    }
  }

  render() {
    const { form, scheme } = this.props;
    const { loading, modalVisible, success, data } = scheme;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const { selectedCountry } = this.state;
    const { iso2, phoneCode } = selectedCountry;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'CUSTOMER',
    };

    return (
      <PageHeaderLayout
        title={data.id ? 'Scheme' : 'New Scheme'}
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data datas."
      >
        <div className="content-inner">
          <Card>
            <LocaleProvider locale={enUS}>
              <Form layout="horizontal">
                <FormItem label="Customer:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('contact', {
                      initialValue: data.contact,
                      rules: [
                          {
                              required: true,
                              message: 'Customer must be specified',
                          },
                      ],
                  })(<ContactSelect
                    onContactSelect={this.contactChangeHandler}
                    {...contactSelectProps}
                  />)}
                </FormItem>
                <FormItem label="Name：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('name', {
                      initialValue: data.name,
                      rules: [
                        {
                            required: true,
                            message: 'Scheme name must be specified',
                        },
                      ],
                  })(<Input />)}
                </FormItem>
                <FormItem label="Expiry Date：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('expiryDate', {
                    rules: [
                      {
                          required: true,
                          message: 'Expiry date must be specified',
                      },
                    ],
                  })(<DatePicker />)}
                </FormItem>
                {/*
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
                */}
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
                <div style={{ marginTop: 10 }}>
                  <FormItem {...noLabelTailFormItemLayout}>
                    <Button
                      type="danger"
                      icon="close"
                      onClick={this.handleCancel}
                      style={{ marginRight: 10 }}
                    >Cancel
                    </Button>
                    <Button
                      type="primary"
                      icon="save"
                      onClick={this.handleSubmitAndClose}
                      style={{ marginRight: 10 }}
                    >Save &amp; Close
                    </Button>
                    {data.publicId
                      ? null
                      : (
                        <Button
                          type="primary"
                          icon="save"
                          onClick={this.handleSubmitAndNew}
                        >Save &amp; New
                        </Button>
)
                    }

                  </FormItem>
                </div>
              </Form>
            </LocaleProvider>
          </Card>
        </div>
      </PageHeaderLayout>

    );
  }
}

export default SchemeForm;
