import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Radio, Modal, LocaleProvider, Select, Tooltip, Icon } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PhoneNumberInput from '../../../../common/PhoneNumberInput';
import RelationshipTypeSelect from '../../../../common/RelationshipTypeSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class GuardianModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    patientProfile: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
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

  phoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ phoneNumber: value }) : this.props.form.validateFields(['phoneNumber']));

  render() {
    const { form, visible, type, item, patientProfile, onOk, onCancel } = this.props;
    const { getFieldDecorator, getFieldsError, validateFields, setFieldsValue } = form;
    const { user } = patientProfile;
    const { countryOfOrigin } = user;
    const { iso2, phoneCode } = countryOfOrigin;

    const modalOpts = {
      title: `${type === 'create' ? 'New Guardian' : 'Edit Guardian'}`,
      visible,
      width: 600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const relationshipTypeSelectProps = {
      multiSelect: false,
      onRelationshipTypeSelect(value) {
        setFieldsValue({ relationshipType: value });
      },
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="First Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('firstName', {
                initialValue: item.firstName,
                rules: [
                  {
                    required: true,
                    message: 'First Name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={(<span>Surname</span>)} hasFeedback>
              {getFieldDecorator('surname', {
                  initialValue: item.surname,
                  rules: [
                      {
                          required: true,
                          message: 'Please input Guardian\'s surname!',
                     },
                  ],
               })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={(<span>Other Name</span>)} hasFeedback>
              {getFieldDecorator('otherNames', {
                  initialValue: item.otherNames,
                  rules: [
                      {
                          required: false,
                          message: 'Please input Guardian\'s other name!',
                     },
                  ],
               })(<Input />)}
            </FormItem>
            
            <FormItem label="Gender" hasFeedback {...formItemLayout}>
              {getFieldDecorator('gender', {
                initialValue: item.gender,
                rules: [
                  {
                    required: true,
                    message: 'Gender Must be Select',
                 },
                ],
             })(
               <Radio.Group>
                 <Radio value="FEMALE">Female</Radio>
                 <Radio value="MALE">Male</Radio>
                 {/* <Radio value="OTHER">Other</Radio> */}
               </Radio.Group>
              )}
            </FormItem>
            {/* <FormItem label="Relationship" hasFeedback {...formItemLayout}>
              {getFieldDecorator('relationshipType', {
                initialValue: item.relationshipType,
                rules: [
                  {
                    required: true,
                    message: 'Relationship type must be Selected',
                 },
                ],
             })(
               <RelationshipTypeSelect
                 editValue={item.relationshipType}
                 {...relationshipTypeSelectProps} />
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} label={(<span>Physical Address</span>)} hasFeedback>
              {getFieldDecorator('physicalAddress', {
                  initialValue: item.otherNames,
                  rules: [
                      {
                          required: true,
                          message: 'Please input guardian physical address',
                     },
                  ],
               })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Phone Number" hasFeedback>
              {getFieldDecorator('phoneNumber', {
                initialValue: item.phoneNumber,
                rules: [
                  {
                    required: true,
                    message: 'Please input valid phone number!',
                  },
                ],
              })(<PhoneNumberInput
                  countryCode={iso2}
                  phoneCode={phoneCode}
                  onPhoneNumberChange={this.phoneNumberChangeHandler} />)}
            </FormItem>
            <FormItem label="Email：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('emailAddress', { initialValue: item.emailAddress })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default GuardianModal;
