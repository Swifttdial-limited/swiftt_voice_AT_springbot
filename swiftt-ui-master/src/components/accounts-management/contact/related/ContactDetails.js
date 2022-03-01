import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button, Form, Input, Tooltip, LocaleProvider, Card, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DescriptionList from '../../../DescriptionList';
import CountrySelect from '../../../common/CountrySelect';

const FormItem = Form.Item;
const { Description } = DescriptionList;

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
class ContactDetailsView extends PureComponent {

  static defaultProps = {
    contactProfile: {},
  };

  static propTypes = {
    contactProfile: PropTypes.object.isRequired,
  };

  state = {
    isEditActive: false,
  };

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  handleFormUpdateSubmit = (e) => {
    const { contactProfile } = this.props;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        // TODO BAD BAD BAD
        values.address.country = contactProfile.address.country;

        this.props.onContactUpdate(values);
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { contactProfile: profile, form } = this.props;
    const { getFieldDecorator } = form;

    const { isEditActive } = this.state;

    let description = <DescriptionList size="small" col="2" />;
    if (profile.id) {
      description = (
        <DescriptionList size="small" col="2">
          <Description term="Country">{profile.address.country ? profile.address.country.countryName : null}</Description>
          <Description term="City / Town">{profile.address.city}</Description>
          <Description term="Physical / Street Address">{profile.address.streetAddress ? profile.address.streetAddress : 'Not specified'}</Description>
          <Description term="">&nbsp;</Description>
          <Description term="Postal Address">{profile.address.postalAddress ? profile.address.postalAddress : 'Not specified'}</Description>
          <Description term="Postal Code">{profile.address.postalCode ? profile.address.postalCode : 'Not specified'}</Description>
          <Description term="Phone Number">{profile.phoneNumber ? profile.phoneNumber : 'Not specified'}</Description>
          <Description term="Alternative Phone Number">{profile.alternativePhoneNumber ? profile.alternativePhoneNumber : 'Not specified'}</Description>
          <Description term="Email Address">{profile.emailAddress ? profile.emailAddress : 'Not specified'}</Description>
          <Description term="Alternative Email Address">{profile.alternativeEmailAddress ? profile.alternativeEmailAddress : 'Not specified'}</Description>
          <Description term="Website">{profile.website ? profile.website : 'Not specified'}</Description>
        </DescriptionList>
      );
    }

    const formItems = (
      <div>
        {/*
          <FormItem label="Country:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address.country', {
              initialValue: profile.address.country ? profile.address.country : {},
              rules: [
                {
                  required: true,
                  message: 'Country must be specified',
                },
              ],
            })(<CountrySelect
                editValue={profile.address.country ? profile.address.country.countryName : null}
                onCountrySelect={this.countrySelectChange} />)}
          </FormItem>
        */}

        <FormItem label="City / Town:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('address.city', {
            initialValue: profile.address.city,
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
            initialValue: profile.address.streetAddress,
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
            initialValue: profile.address.postalAddress,
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
            initialValue: profile.address.postalCode,
              rules: [
                {
                  required: false,
                  message: 'Postal Code must be specified',
               },
              ],
           })(<Input placeholder="Postal code" />)}
        </FormItem>
        {/*
          <FormItem {...formItemLayout} label="Phone Number" hasFeedback>
            {getFieldDecorator('phoneNumber', {
              initialValue: profile.phoneNumber,
              rules: [
                {
                    required: true,
                    message: 'Please input valid phone number!',
                },
              ],
            })(<PhoneNumberInput
              countryCode={profile.address.country.iso2}
              phoneCode={profile.address.country.phoneCode}
              onPhoneNumberChange={this.phoneNumberChangeHandler}
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Alternative Phone">
            {getFieldDecorator('alternativePhoneNumber', {
              initialValue: profile.alternativePhoneNumber,
            })(<PhoneNumberInput
              countryCode={profile.address.country.iso2}
              phoneCode={profile.address.country.phoneCode}
              onPhoneNumberChange={this.alternativePhoneNumberChangeHandler}
            />)}
          </FormItem>
        */}
        <FormItem label="Email Address：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('emailAddress', {
            initialValue: profile.emailAddress,
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
            initialValue: profile.alternativeEmailAddress,
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
            initialValue: profile.website,
             rules: [
               {
                 type: 'url',
                 message: 'The input is not valid website address!',
              },
             ],
            })(<Input placeholder="Website" />)}
        </FormItem>
      </div>
    );

    return (
      <LocaleProvider locale={enUS}>
        <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit}>

          {!isEditActive
          ?
            (<div>
              <Row>
                <Col offset={22} span={2}>
                  <Tooltip title="Edit details">
                    <Button type="dashed" shape="circle" icon="edit" onClick={this.onEditDetailsButtonClickHandler} />
                  </Tooltip>
                </Col>
              </Row>
              { description }
            </div>)
          :
            (
              <div>
                {formItems}
                <FormItem {...tailFormItemLayout}>
                  <Row>
                    <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                      >Save
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={this.onEditDetailsButtonClickHandler}
                      >Cancel
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            )
        }
        </Form>
      </LocaleProvider>
    );
  }
}

export default ContactDetailsView;
