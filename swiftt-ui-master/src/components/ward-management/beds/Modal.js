import PropTypes from 'prop-types';
import React from 'react';
import {
  Form,
  Input,
  Modal,
  Tooltip,
  Icon,
  LocaleProvider
} from 'antd';

import LocationSelect from '../../common/LocationSelect';
import WardSelect from '../../common/WardSelect';

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

function modal({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
  },
}) {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      };
      onOk(data);
    });
  };

  const modalOpts = {
    title: `${type === 'create' ? 'New Bed' : 'Edit Bed'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const wardSelectHandler = value => setFieldsValue({ ward: value });

  const locationSelectProps = {
    department: getFieldValue('ward') ? getFieldValue('ward').publicId : null,
    multiSelect: false,
    onLocationSelect(value){
      setFieldsValue({ location: value })
    },
  };

  const wardSelectProps = {
    multiSelect: false,
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Name：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: 'Bed name must be specified',
               },
              ],
           })(<Input />)}
          </FormItem>
          <FormItem label="Ward：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ward', {
              initialValue: item.ward,
              rules: [
                {
                  required: true,
                  message: 'Ward must be specified',
               },
              ],
           })(<WardSelect
             editValue={item.ward ? item.ward.name : null}
             {...wardSelectProps}
             onWardSelect={wardSelectHandler}
           />
           )}
          </FormItem>

          { getFieldValue('ward') !== undefined && (
            <FormItem label="Location：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('location', {
                initialValue: item.location ? item.location : null,
                rules: [
                  {
                    required: true,
                    message: 'Location must be specified',
                 },
                ],
             })(<LocationSelect
                  {...locationSelectProps}
                  editValue={item.location ? item.location : null} />)}
            </FormItem>
          )}

          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description ? item.description : null,
            })(<TextArea rows={4} />)}
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
