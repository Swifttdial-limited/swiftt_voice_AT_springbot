import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Radio, Modal, LocaleProvider } from 'antd';

import ActiveIngredientSelect from '../../../common/ActiveIngredientSelect';
import ManufacturerSelect from '../../../common/ManufacturerSelect';

import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
  },
}) {
  function handleOk() {
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
  }

  const modalOpts = {
    title: `${type === 'create' ? 'New Brand' : 'Edit Brand'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  const activeIngredientSelectProps = {
    multiSelect: true,
    onActiveIngredientSelect(value) {
      setFieldsValue({ activeIngredients: value });
    },
  };

  const manufacturerSelectProps = {
    multiSelect: false,
    onManufacturerSelect(value) {
      setFieldsValue({ manufacturer: value });
    },
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brandType', {
              initialValue: item.brandType,
              rules: [
                {
                  required: true,
                  message: 'Product brand type must be specified',
               },
              ],
           })(
             <RadioGroup>
               <Radio value="ORIGINAL">Original</Radio>
               <Radio value="GENERIC">Generic</Radio>
             </RadioGroup>
            )}
          </FormItem>
          <FormItem label="Name：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brandName', {
              initialValue: item.brandName,
              rules: [
                {
                  required: true,
                  message: 'Product brand name must be specified',
               },
              ],
           })(<Input />)}
          </FormItem>

          <FormItem label="Active Ingredients" hasFeedback {...formItemLayout}>
            {getFieldDecorator('activeIngredients', {
              initialValue: item.activeIngredients,
           })(<ActiveIngredientSelect {...activeIngredientSelectProps} />)}
          </FormItem>

          <FormItem label="Manufacturer" hasFeedback {...formItemLayout}>
            {getFieldDecorator('manufacturer', {
              initialValue: item.manufacturer,
              rules: [
                {
                  required: true,
                  message: 'Manufacturer must be specified',
               },
              ],
           })(<ManufacturerSelect
             editValue={item.manufacturer ? item.manufacturer.manufacturerName : null}
             {...manufacturerSelectProps} />)}
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
