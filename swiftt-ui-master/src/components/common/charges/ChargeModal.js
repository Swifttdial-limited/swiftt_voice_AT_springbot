import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  LocaleProvider,
  Row,
  Col,
} from 'antd';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import ChargeTypeSelect from '../../common/accounting/ChargeTypeSelect';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class ChargeModal extends PureComponent {
  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
  };

  static propTypes = {
    type: PropTypes.string,
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  render() {
    const {
      visible,
      type,
      item = {},
      onOk,
      onCancel,
      form
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue,
    } = form;

    function handleOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = {
          key: item.key,
          ...getFieldsValue(),
        };
        onOk(data);
      });
    }

    const modalOpts = {
      title: `${type === 'create' ? 'New Charge' : 'Edit Charge'}`,
      visible,
      width: 640,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
      okText: 'Save',
      cancelText: 'Close',
    };

    const chargeTypeSelectProps = {
      multiSelect: false,
      onChargeTypeSelect(value) {
        setFieldsValue({ chargeType: value });
      }
    };

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem
              label="Type of Charge"
              hasFeedback {...formItemLayout}>
              {getFieldDecorator('chargeType', {
                 initialValue: item.chargeType,
                 rules: [
                   {
                     required: true,
                     message: 'Type of charge must be specified',
                  },
                 ],
              })(<ChargeTypeSelect
                editValue={item.chargeType ? item.chargeType : null}
                {...chargeTypeSelectProps}
              />)}
            </FormItem>
            <FormItem label="Amount" hasFeedback {...formItemLayout}>
              {getFieldDecorator('amount', {
                initialValue: item.amount,
                rules: [
                  {
                    required: true,
                    message: 'Amount charged must be specified',
                 },
                ],
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem label="Comment" hasFeedback {...formItemLayout}>
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

export default ChargeModal;
