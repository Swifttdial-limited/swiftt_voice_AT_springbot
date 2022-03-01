import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider } from 'antd';

import TagTypeSelect from '../../../common/TagTypeSelect';

import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class TagFormModal extends PureComponent {

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

  tagTypeSelectHandler = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ type: value });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const modalOpts = {
      title: `${type === 'create' ? 'New Tag' : 'Edit Tag'}`,
      visible,
      onOk: this.handleOk,
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
                    message: 'Tag name must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Code：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('code', {
                initialValue: item.code,
                rules: [
                  {
                    required: true,
                    message: 'Tag code must be specified',
                 },
                ],
             })(<Input />)}
            </FormItem>
            <FormItem label="Tag Type：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: item.type,
                rules: [
                  {
                    required: true,
                    message: 'Tag Type must be specified',
                 },
                ],
              })(<TagTypeSelect onTagTypeSelect={this.tagTypeSelectHandler} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

TagFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(TagFormModal);
