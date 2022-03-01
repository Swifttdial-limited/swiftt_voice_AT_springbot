import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../common/AccountSelect';
import PaymentTermsSelect from '../../common/PaymentTermsSelect';
import VendorCategorySelect from '../../common/VendorCategorySelect';

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
class VendorFormModal extends PureComponent {

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

      data.vendor = true;
      onOk(data);
    });
  }

  creditorsAccountSelectHandler = value => (value ? this.props.form.setFieldsValue({ creditorsAccount: value }) : this.props.form.validateFields(['creditorsAccount']));

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
      title: 'Mark Contact as \'Vendor\'',
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
            <FormItem label="Creditors Account:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('creditorsAccount', {
                  rules: [
                    {
                      required: true,
                      message: 'Creditors account must be specified',
                   },
                  ],
               })(<AccountSelect onAccountSelect={this.creditorsAccountSelectHandler} />)}
            </FormItem>
            {/*
              <FormItem label="Payment Terms:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('paymentTerms', {

                })(<PaymentTermsSelect onPaymentTermsSelect={} />)}
              </FormItem>
            */}
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default VendorFormModal;
