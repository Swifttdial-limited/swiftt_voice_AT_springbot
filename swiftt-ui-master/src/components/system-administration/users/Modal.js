import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PhoneNumberInput from '../../common/PhoneNumberInput';
import RoleSelect from '../../common/RoleSelect';
import TitleSelect from '../../common/TitleSelect';

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

@Form.create()
@connect(({ institution }) => ({
  institution,
}))
class UserFormModal extends PureComponent {

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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'institution/queryMyInstitution' });
  }

  phoneNumberChangeHandler = value => this.props.form.setFieldsValue({ phoneNumber: value });

  titleSelectHandler = value => this.props.form.setFieldsValue({ title: value });

  render() {
    const {
      form,
      visible,
      type,
      item,
      onOk,
      onCancel,
      institution,
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;
    const { data } = institution;

    function handleOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }

        const formData = getFieldsValue();
        const roles = formData.roles;

        delete formData.roles;

        const data = { user: Object.assign({}, formData, { gender: 'OTHER', password: 'syhos', userType: 'SYSTEM_USER' }), roles };

        onOk(data);
      });
    }

    const modalOpts = {
      title: `${type === 'create' ? 'New User' : 'Edit User'}`,
      visible,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const roleSelectProps = {
      multiSelect: true,
      onRoleSelect(value) {
        setFieldsValue({ roles: value });
      },
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="Title" hasFeedback>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please select title!',
                 },
                ],
             })(
               <TitleSelect onTitleSelect={this.titleSelectHandler} />
              )}
            </FormItem>
            <FormItem label="First Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('firstName', {
                initialValue: item.firstName,
                rules: [
                  {
                    required: true,
                    message: 'First name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Surname:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('surname', {
                initialValue: item.surname,
                rules: [
                  {
                    required: true,
                    message: 'Surname must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Other Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('otherNames', {
                initialValue: item.otherNames,
             })(<Input />)}
            </FormItem>
            <FormItem label="Username：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('username', {
                initialValue: item.username,
                rules: [
                  {
                    required: true,
                    message: 'Username must be specified',
                 },{
                   type: 'email',
                   message: 'Username must be a valid email address',
                 },
                ],
             })(<Input />)}
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
                  countryCode={data.address ? data.address.country.iso2 : null}
                  phoneCode={data.address ? data.address.country.phoneCode : null}
                  onPhoneNumberChange={this.phoneNumberChangeHandler}
                />)}
            </FormItem>
            {/*
              <FormItem label="Email Address:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('emailAddress', {
                  initialValue: item.emailAddress,
                  rules: [
                      {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                     },
                  ],
               })(<Input />)}
              </FormItem>
            */}
            <FormItem label="Roles:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('roles', {
                initialValue: item.roles,
                rules: [
                    {
                        required: true,
                        message: 'Role(s) must be specified',
                   },
                ],
             })(<RoleSelect {...roleSelectProps} />)}
            </FormItem>
            <FormItem label="Comment:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
             })(<TextArea rows={3} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default UserFormModal;
