import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider, Checkbox, Tooltip, Icon } from 'antd';
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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

function PriceListFormModal({
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
      };
      onOk(data);
    });
  }

  function onIsDefaultPriceListToggleHandler(e) {
    setFieldsValue({ defaultPriceList: e.target.value });
  }

  const modalOpts = {
    title: `${type === 'create' ? 'New Price List' : 'Edit Price List'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
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
                  message: 'Price list name must be specified',
               },
              ],
             })(<Input />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            {getFieldDecorator('defaultPriceList', {
                valuePropName: 'checked',
                initialValue: item.defaultPriceList,
             })(
             <Checkbox onChange={onIsDefaultPriceListToggleHandler}>
               <span>Set as default price list? &nbsp;
                 <Tooltip title="Default / Base price list is used to calculate markup prices either by percentage or value of the base price">
                   <Icon type="question-circle-o" />
                 </Tooltip>
               </span>
             </Checkbox>)
           }
          </FormItem>
          <FormItem label="Description：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
                initialValue: item.description,
            })(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

PriceListFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(PriceListFormModal);
