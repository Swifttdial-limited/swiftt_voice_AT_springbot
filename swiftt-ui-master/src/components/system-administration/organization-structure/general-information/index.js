import enUS from 'antd/lib/locale-provider/en_US';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Collapse, LocaleProvider, Button, Tooltip, Icon, Card } from 'antd';

import DescriptionList from '../../../DescriptionList';
import CountrySelect from '../../../common/CountrySelect';
import ImageViewer from '../../../common/ImageViewer';
import PhoneNumberInput from '../../../common/PhoneNumberInput';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

@Form.create()
@connect(({ institution, loading }) => ({
  institution,
  loading: loading.effects['institution/query'],
}))
class InstitutionGeneralForm extends PureComponent {

  static propTypes = {
    institution: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    isEditActive: false,
    selectedCountry: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'institution/queryMyInstitution' });
  }

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  alternativePhoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ alternativePhoneNumber: value }) : this.props.form.validateFields(['alternativePhoneNumber']));

  handleCountryChange = (value) => {
    this.props.form.setFieldsValue({ country: value });
    this.setState({ selectedCountry: value || {} });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = this.props.institution.data.id;
        values.version = this.props.institution.data.version;
        values.publicId = this.props.institution.data.publicId;

        values.address = {
          city: values.city,
          country: values.country,
          postalAddress: values.postalAddress,
          postalCode: values.postalCode,
          streetAddress: values.streetAddress,
        };

        delete values.city;
        delete values.country;
        delete values.postalAddress;
        delete values.postalCode;
        delete values.streetAddress;

        this.props.dispatch({ type: 'institution/updateMyInstitution', payload: values });

        this.setState({ isEditActive: false });
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  phoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ phoneNumber: value }) : this.props.form.validateFields(['phoneNumber']));

  render() {
    const { form, institution } = this.props;
    const { getFieldDecorator, getFieldsError, setFieldsValue } = form;
    const { data, loading } = institution;

    const { isEditActive, selectedCountry } = this.state;
    const { iso2, phoneCode } = selectedCountry;

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

    const institutionInformationFormItems = (
      <div>
        {/* <h5><strong></strong>Logo:</h5> */}
        <FormItem label="Institution Name：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('institutionName', {
            initialValue: data.institutionName,
            rules: [
              {
                required: true,
                message: 'Institution Name must be specified',
              },
            ],
          })(<Input placeholder="Institution name" />)}
        </FormItem>
        <FormItem
          label={(
            <span>
              Legal Name&nbsp;
              <Tooltip title="Name that will appear on documents and communiques">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('legalName', {
            initialValue: data.legalName,
            rules: [
              {
                required: true,
                message: 'Legal Name must be specified',
              },
            ],
          })(<Input placeholder="Institution legal / registered name" />)}
        </FormItem>
        <FormItem
          label={(
            <span>
              Tagline&nbsp;
              <Tooltip title="Vision or mission or motto that will appear on documents and communiques">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('tagline', {
            initialValue: data.tagline,
            rules: [
              {
                required: true,
                message: 'Tagline must be specified',
              },
            ],
          })(<Input placeholder="Tagline" />)}
        </FormItem>
        <FormItem
          label={(
            <span>
              Code&nbsp;
              <Tooltip title="Code that will appear as a prefix on medical records">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>)}
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('code', {
            initialValue: data.code,
            rules: [
              {
                required: true,
                message: 'Code must be specified',
              },
            ],
          })(<Input />)}
        </FormItem>
      </div>
    );
    const contactInformationFormItems = (
      <div>
        <FormItem label="Email Address：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('emailAddress', {
            initialValue: data.emailAddress,
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              }, {
                required: true,
                message: 'Email must be specified',
              },
            ],
          })(<Input placeholder="Email address" />)}
        </FormItem>
        <FormItem label="Customer Facing Email Address:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('customerFacingEmailAddress', {
            initialValue: data.customerFacingEmailAddress,
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              }, {
                required: true,
                message: 'Customer facing email must be specified',
              },
            ],
          })(<Input placeholder="Customer facing email address" />)}
        </FormItem>
        <FormItem label="Phone Number:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phoneNumber', {
            initialValue: data.phoneNumber,
            rules: [
              {
                required: true,
                message: 'Phone number must be specified',
              },
            ],
          })(<PhoneNumberInput
            countryCode={iso2}
            phoneCode={phoneCode}
            onPhoneNumberChange={this.phoneNumberChangeHandler}
          />)}
        </FormItem>
        <FormItem label="Alternative Phone Number:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('alternativePhoneNumber', {
            initialValue: data.alternativePhoneNumber,
          })(<PhoneNumberInput
            countryCode={iso2}
            phoneCode={phoneCode}
            onPhoneNumberChange={this.alternativePhoneNumberChangeHandler}
          />)}
        </FormItem>
        <FormItem
          label={(
            <span>
              Website&nbsp;
              <Tooltip title="Valid website address. Must start with http://">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>)}
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('websiteUrl', {
            initialValue: data.websiteUrl,
            rules: [
              {
                type: 'url',
                message: 'The input is not valid website address!',
              }, {
                required: true,
                message: 'Website must be specified',
              },
            ],
          })(<Input placeholder="Institution website address" />)}
        </FormItem>
      </div>
    );
    const addressInformationFormItems = (
      <div>
        <FormItem label="Country:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('country', {
            initialValue: data.address ? data.address.country : null,
            rules: [
              {
                required: true,
                message: 'Country must be specified',
              },
            ],
          })(<CountrySelect
            editValue={data.address ? data.address.country.countryName : null}
            onCountrySelect={this.handleCountryChange}
          />
          )}
        </FormItem>
        <FormItem label="City / Town:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('city', {
            initialValue: data.address ? data.address.city : null,
            rules: [
              {
                required: false,
                message: 'City / Town must be specified',
              },
            ],
          })(<Input placeholder="City or town" />)}
        </FormItem>
        <FormItem label="Physical / Street Address:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('streetAddress', {
            initialValue: data.address ? data.address.streetAddress : null,
            rules: [
              {
                required: false,
                message: 'Physical / Street address must be specified',
              },
            ],
          })(<Input placeholder="Physical or street address" />)}
        </FormItem>
        <FormItem label="Postal Address:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('postalAddress', {
            initialValue: data.address ? data.address.postalAddress : null,
            rules: [
              {
                required: false,
                message: 'Postal address must be specified',
              },
            ],
          })(<Input placeholder="Postal Address" />)}
        </FormItem>
        <FormItem label="Postal Code:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('postalCode', {
            initialValue: data.address ? data.address.postalCode : null,
            rules: [
              {
                required: false,
                message: 'Postal Code must be specified',
              },
            ],
          })(<Input placeholder="Postal code" />)}
        </FormItem>
      </div>
    );

    return (
      <LocaleProvider locale={enUS}>
        <Card>
          {data.id ? (
            <Row gutter={24}>
              <Col span={16}>
                <div>
                  {!isEditActive && (
                    <Row>
                      <Col offset={22} span={2}>
                        <Tooltip title="Edit details">
                          <Button type="dashed" shape="circle" icon="edit" onClick={this.onEditDetailsButtonClickHandler} />
                        </Tooltip>
                      </Col>
                    </Row>
                  )}

                  <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit}>
                    <fieldset>
                      <legend>Basic Details</legend>
                        {!isEditActive && (
                          <div>
                            <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                              <Description term="Institution Name">{data.institutionName ? data.institutionName : 'Not specified'}</Description>
                              <Description term="Legal Name">{data.legalName ? data.legalName : 'Not specified'}</Description>
                              <Description term="Tagline">{data.tagline ? data.tagline : 'Not specified'}</Description>
                              <Description term="Institution Code">{data.code ? data.code : 'Not specified'}</Description>
                            </DescriptionList>
                          </div>
                        )}
                        {isEditActive && <div>{institutionInformationFormItems}</div>}
                    </fieldset>
                    <br/>
                    <br/>
                    <fieldset>
                      <legend>Address details</legend>
                        {!isEditActive && (
                          <div>
                            <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                              <Description term="Country">{data.address ? data.address.country.countryName : 'Not specified'}</Description>
                              <Description term="City">{data.address ? data.address.city : 'Not specified'}</Description>
                              <Description term="Physical / Street address">{data.address ? data.address.streetAddress : 'Not specified'}</Description>
                              <Description term="Postal Address">{data.address ? data.address.postalAddress : 'Not specified'}</Description>
                              <Description term="Postal Code">{data.address ? data.address.postalCode : 'Not specified'}</Description>
                            </DescriptionList>
                          </div>
                        )}
                        {isEditActive && <div>{addressInformationFormItems}</div>}
                    </fieldset>
                    <br/>
                    <br/>

                    <fieldset>
                      <legend>Contact details</legend>
                        {!isEditActive && (
                          <div>
                            <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                              <Description term="Email Address">{data.emailAddress ? data.emailAddress : 'Not specified'}</Description>
                              <Description term="Customer Facing Email Address">{data.customerFacingEmailAddress ? data.customerFacingEmailAddress : 'Not specified'}</Description>
                              <Description term="Phone Number">{data.phoneNumber ? data.phoneNumber : 'Not specified'}</Description>
                              <Description term="Alternative Phone Number">{data.alternativePhoneNumber ? data.alternativePhoneNumber : 'Not specified'}</Description>
                              <Description term="Website">{data.websiteUrl ? data.websiteUrl : 'Not specified'}</Description>
                            </DescriptionList>
                          </div>
                        )}
                        {isEditActive && <div>{contactInformationFormItems}</div>}
                    </fieldset>
                    <br/>
                    <br/>
                    {isEditActive && (
                      <FormItem {...tailFormItemLayout}>
                        <Row>
                          <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                            <Button
                              type="danger"
                              icon="close"
                              style={{ marginRight: 10 }}
                              onClick={this.onEditDetailsButtonClickHandler}
                            >Cancel
                            </Button>
                            <Button
                              type="primary"
                              icon="save"
                              htmlType="submit"
                              disabled={this.hasErrors(getFieldsError())}
                            >Save
                            </Button>
                          </Col>
                        </Row>
                      </FormItem>
                    )}
                  </Form>
                </div>
              </Col>
              <Col span={7} offset={1}>
                <ImageViewer
                  fillWrapper={true}
                  readOnly={false}
                  referenceType="INSTITUTION_LOGO" />
              </Col>
            </Row>

          ) : (
            <Form layout="horizontal" onSubmit={this.handleFormSubmit}>
              <fieldset>
                <legend>Basic Details</legend>
                {institutionInformationFormItems}
              </fieldset>

              <fieldset>
                <legend>Address details</legend>
                {addressInformationFormItems}
              </fieldset>

              <fieldset>
                <legend>Contact details</legend>
                {contactInformationFormItems}
              </fieldset>

              <FormItem {...tailFormItemLayout}>
                <Button
                  type="primary"
                  icon="save"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                >Save
                </Button>
              </FormItem>
            </Form>
          )}
        </Card>
      </LocaleProvider>
    );
  }
}

export default InstitutionGeneralForm;
