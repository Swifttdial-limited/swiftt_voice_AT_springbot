import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  LocaleProvider,
  Checkbox,
  Row,
  Col,
  Tooltip,
  Icon, DatePicker, InputNumber
} from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

const dateFormat = 'YYYY-MM-DD';
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
class modal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

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

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const modalOpts = {
      title: `${type === 'create' ? 'Dispose Asset' : 'Edit Disposal Record'}`,
      visible,
      width:600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };


    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">

            <FormItem label="Selling Price：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sellingPrice', {
                initialValue: item.sellingPrice,
                rules: [
                  {
                    required: true,
                    message: 'asset selling price must be specified',
                  },
                ],
              })(<InputNumber placeholder="asset selling price" />)}
            </FormItem>

            <FormItem label="Reason：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reason', {
                initialValue: item.reason,
              })(<TextArea rows={4} />)}
            </FormItem>

            <FormItem label="Sold To：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sellingNotes', {
                initialValue: item.sellingNotes,
              })(<TextArea rows={4} />)}
            </FormItem>

            <FormItem label="Disposal Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('disposalDate', {
                initialValue: item.disposalDate,
                rules: [
                  {
                    required: true,
                    message: 'disposal Date must be Selected',
                  },
                ],
              })(<DatePicker
                format={dateFormat}
              />)}
            </FormItem>

          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default modal;
