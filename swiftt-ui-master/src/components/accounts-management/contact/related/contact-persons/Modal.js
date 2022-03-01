import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Form, Input, Modal, LocaleProvider, Tooltip, Icon, Row, Col } from 'antd';

import PhoneNumberInput from '../../../../common/PhoneNumberInput';

import enUS from 'antd/lib/locale-provider/en_US';

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

class ContactPersonsModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  alternativePhoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ alternativePhoneNumber: value }) : this.props.form.validateFields(['alternativePhoneNumber']));

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

  phoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ phoneNumber: value }) : this.props.form.validateFields(['phoneNumber']));

  render() {
    const { form, visible, type, item, onOk, onCancel, contactProfile } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    let phoneNumberFormItems = null;

    if (contactProfile.address !== undefined) {
      const { address } = contactProfile;
      const { country } = address;
      const { iso2, phoneCode } = country;

      phoneNumberFormItems = (
        <div>
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
        </div>
      );
    }

    const modalOpts = {
      title: `${type === 'create' ? 'New Contact Person' : 'Edit Contact Person'}`,
      visible,
      width: 600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="Name" hasFeedback>
              {getFieldDecorator('fullName', {
                initialValue: item.fullName,
                rules: [
                  {
                    required: true,
                    message: 'Full name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Email：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('emailAddress', {
                rules: [
                  {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                 },
                ],
             })(<Input />)}
            </FormItem>

            {phoneNumberFormItems}

            <FormItem {...formItemLayout} label="Comment:" hasFeedback>
              {getFieldDecorator('comment', {
                initialValue: item.comment,
             })(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

ContactPersonsModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  contactProfile: PropTypes.object.isRequired,
};

export default Form.create()(ContactPersonsModal);
