import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Modal,
  LocaleProvider,
  Checkbox,
  Tooltip,
  Icon,
  Row,
  Col,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import ProductSelect from '../../../common/ProductSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

@Form.create()
class BillingRuleModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  handleOk = () => {
    const { form, onOk } = this.props;
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

  autoPostingAllowedToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ allowAutoPosting: e.target.value });
  }

  render() {
    const {
      visible,
      type,
      item = {},
      onOk,
      onCancel,
      form,
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const productSelectProps = {
      multiSelect: false,
      onProductSelect(value) {
        setFieldsValue({ product: value });
      },
    };

    const modalOpts = {
      title: `${type === 'create' ? 'New Billing Rule' : 'Edit Billing Rule'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      width: 600,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Product：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product', {
                initialValue: item.product,
                rules: [
                  {
                    required: true,
                    message: 'Product must be specified',
                 },
                ],
             })(<ProductSelect
                  {...productSelectProps}
                  editValue={item.product ? item.product.productName : null} />)}
            </FormItem>
            <FormItem {...noLabelTailFormItemLayout}>
              {getFieldDecorator('allowAutoPosting', {
                initialValue: item.allowAutoPosting,
              })(
                <Checkbox
                  defaultChecked={item.allowAutoPosting ? item.allowAutoPosting : false}
                  onChange={this.autoPostingAllowedToggleHandler}
                >
                  <span>Allow creation of bills without posting?&nbsp;
                    <Tooltip title="If selected, bills will be generated automatically the product is requested from a department. For example Vital Signs">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                </Checkbox>)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default BillingRuleModal;
