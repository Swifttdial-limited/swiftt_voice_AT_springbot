import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Checkbox, Input, Modal, LocaleProvider, Row, Col, Tooltip, Icon } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import LocationSelect from '../../../common/LocationSelect';

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
      span: 18,
      offset: 6,
    },
  },
};

@Form.create()
class StoreFormModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showParentBinLocationSelect: false };
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
        key: item.key,
      };
      onOk(data);
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const { showParentLocationSelect } = this.state;

    const modalOpts = {
      title: `${type === 'create' ? 'New Bin Location' : 'Edit Bin Location'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const locationSelectProps = {
      onLocationSelect(value) {
        setFieldsValue({ location: value });
      },
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
                    message: 'Location name must be specified',
                 },
                ],
             })(<Input placeholder="Bin location name" />)}
            </FormItem>

            <FormItem label="Location：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('location', {
               initialValue: item.location,
                  rules: [
                    {
                      required: false,
                      message: 'Location must be specified',
                   },
                  ],
               })(<LocationSelect editValue={item.location ? item.location.name : null} {...locationSelectProps} />)}
            </FormItem>

            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {})(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

StoreFormModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default StoreFormModal;
