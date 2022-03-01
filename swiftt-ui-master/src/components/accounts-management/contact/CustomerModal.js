import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../common/AccountSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
class CustomerFormModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  handleOk = () => {
    const { form, onOk } = this.props;
    const { getFieldsValue, validateFields } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };

      data.customer = true;

      onOk(data);
    });
  }

  debtorsAccountSelectHandler = value => (value ? this.props.form.setFieldsValue({ debtorsAccount: value }) : this.props.form.validateFields(['debtorsAccount']));

  render() {
    const {
      visible,
      item = {},
      onOk,
      onCancel,
      form
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const modalOpts = {
      title: 'Mark Contact as \'Customer\'',
      visible,
      width: 560,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Debtors Account:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('debtorsAccount', {
                  rules: [
                    {
                      required: true,
                      message: 'Debtors account must be specified',
                   },
                  ],
               })(<AccountSelect onAccountSelect={this.debtorsAccountSelectHandler} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default CustomerFormModal;
