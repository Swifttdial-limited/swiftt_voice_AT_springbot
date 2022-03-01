import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Modal,
  LocaleProvider,
  Checkbox,
  Tooltip,
  Icon
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import ProductSelect from '../../../../../common/ProductSelect';

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

function AssociatedProductFormModal({
  visible,
  item,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
}) {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
  };

  const billableProductToggleHandler = (e) => setFieldsValue({ controlAccount: e.target.value });

  const productSelectProps = {
    multiSelect: false,
    onProductSelect(value) {
      setFieldsValue({ product: value });
    },
  };

  const modalOpts = {
    title: 'New Associated product',
    visible,
    onOk: handleOk,
    onCancel,
    width: 600,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Associated Product：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('product', {
              initialValue: item.product ? item.product : null,
              rules: [
                {
                  required: true,
                  message: 'Associated product must be specified',
               },
              ],
           })(<ProductSelect {...productSelectProps} />)}
          </FormItem>
          {/*
            <FormItem {...noLabelTailFormItemLayout}>
              {getFieldDecorator('billable', {
                initialValue: item.billable ? item.billable : false,
              })(
                <Checkbox
                  defaultChecked={item.billable ? item.billable : false}
                  onChange={billableProductToggleHandler}
                >
                  <span>Is it billable as an associated product?&nbsp;
                    <Tooltip title="Billable?">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                </Checkbox>)}
            </FormItem>
          */}
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

AssociatedProductFormModal.defaultProps = {
  item: {},
  onOk: () => {},
  onCancel: () => {},
};

AssociatedProductFormModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(AssociatedProductFormModal);
