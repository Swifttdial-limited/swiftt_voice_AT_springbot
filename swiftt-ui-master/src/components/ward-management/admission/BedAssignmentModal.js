import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Modal, LocaleProvider, Select, Tooltip, Icon, Row, Col } from 'antd';

import BedCascader from '../../common/BedCascader';

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

function BedAssignmentModal({
  visible,
  type,
  item,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
}) {
  const bedCascaderProps = {
    onBedSelect(value) {
      setFieldsValue({ bed: value });
    },
  };

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

  const modalOpts = {
    title: `${type === 'create' ? 'New Bed Assignment' : 'Edit Bed Assignment'}`,
    visible,
    width: 600,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem
            label={(
              <span>
              Bed&nbsp;
                <Tooltip title="Assign an unassigned bed to this admission request">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('bed', {
              rules: [
                {
                  required: true,
                  message: 'Bed must be specified',
               },
              ],
           })(<BedCascader {...bedCascaderProps} />)}
          </FormItem>
          <FormItem label="Comment:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comment', {})(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </LocaleProvider>
  );
}

BedAssignmentModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(BedAssignmentModal);
