import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Radio, Modal, Tooltip, Icon, LocaleProvider } from 'antd';

import CountrySelect from '../../common/CountrySelect';
import CustomDatePicker from '../../common/CustomDatePicker';
import PhoneNumberInput from '../../common/PhoneNumberInput';
import ReligionSelect from '../../common/ReligionSelect';
import TitleSelect from '../../common/TitleSelect';

import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function modal({
  visible,
  type,
  item,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
}) {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }

      const data = {
        ...getFieldsValue(),
        userType: 'PATIENT',
        patientId: item.id,
      };

      onOk(Object.assign({}, item.user, data));
    });
  }

  const modalOpts = {
    title: 'Edit Patient details',
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const countrySelectProps = {
    onCountrySelect(value) {
      setFieldsValue({ country: value });
      setFieldsValue({ prefix: value ? value.phoneCode : null });
      handleCountryChange(value);
    },
  };

  const dateOfBirthPickerProps = {
    allowFuture: false,
    allowPast: true,
    showTime: false,
    onDateSelect(date, dateString) {
      setFieldsValue({ dateOfBirth: date });
    },
  };

  const religionSelectProps = {
    onReligionSelect(value) {
      setFieldsValue({ religion: value });
    },
  };

  const titleSelectProps = {
    onTitleSelect(value) {
      setFieldsValue({ title: value });
    },
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="Title" hasFeedback>
            {getFieldDecorator('title', {
              initialValue: item.user.title ? item.user.title : {},
              rules: [
                {
                  required: true,
                  message: 'Please select title!',
               },
              ],
           })(
             <TitleSelect
               editValue={item.user.title ? item.user.title.name : ''}
               {...titleSelectProps}
             />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={(<span>Firstname</span>)} hasFeedback>
            {getFieldDecorator('firstName', {
                initialValue: item.user.firstName,
                rules: [
                  {
                    min: 2,
                    required: true,
                    message: 'Please input patient\'s first name!',
                 },
                ],
             })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label={(<span>Surname</span>)} hasFeedback>
            {getFieldDecorator('surname', {
                initialValue: item.user.surname,
                rules: [
                  {
                    min: 2,
                    required: true,
                    message: 'Please input patient\'s surname!',
                 },
                ],
             })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label={(<span>Other Name</span>)} hasFeedback>
            {getFieldDecorator('otherNames', {
              initialValue: item.user.otherNames,
              rules: [
                {
                  min: 2,
                  required: false,
                },
              ],
           })(<Input />)}
          </FormItem>

          <FormItem label={(<span>Date of Birth</span>)} {...formItemLayout} hasFeedback>
            {getFieldDecorator('dateOfBirth', {
              initialValue: item.user.dateOfBirth,
              rules: [{ type: 'object', required: true, message: 'Please valid date of birth' }],
           })(
             <CustomDatePicker editValue={item.user.dateOfBirth} {...dateOfBirthPickerProps} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Sex" hasFeedback>
            {getFieldDecorator('gender', {
              initialValue: item.user.gender,
              rules: [{ required: true, message: 'Gender must be specified' }],
           })(
             <RadioGroup style={{ float: 'left' }}>
               <Radio value="FEMALE">Female</Radio>
               <Radio value="MALE">Male</Radio>
             </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

modal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(modal);
