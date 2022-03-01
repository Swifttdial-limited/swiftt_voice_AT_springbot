import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Checkbox, Modal, Tooltip, Icon, LocaleProvider, Row, Col } from 'antd';

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

class VisitTypeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasValidityDuration: false };
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

 hasValidityPeriodChangeHandler = (e) => {
   const { form } = this.props;
   const { setFieldsValue } = form;

   setFieldsValue({ hasValidityDuration: e.target.checked });
   this.setState({ hasValidityDuration: e.target.checked });
 }

 requiresAdmissionChangeHandler = (e) => {
   const { form } = this.props;
   const { setFieldsValue } = form;

   setFieldsValue({ requiresAdmission: e.target.checked });
 }

 render() {
   const { form, visible, type, item, onOk, onCancel } = this.props;
   const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

   const { hasValidityDuration } = this.state;

   const modalOpts = {
     title: `${type === 'create' ? 'New Visit Type' : 'Edit Visit Type'}`,
     visible,
     onOk: this.handleOk,
     onCancel,
     width: 720,
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
                    message: 'Name must be specified.',
                 },
                ],
             })(<Input />)}
           </FormItem>
           <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
             {getFieldDecorator('requiresAdmission', {
                initialValue: item.requiresAdmission,
             })(
               <Checkbox defaultChecked={false} onChange={this.requiresAdmissionChangeHandler}>
                 <span>Requires admission before billing?
                   <Tooltip title="Requires admission before billing?">
                     <Icon type="question-circle-o" />
                   </Tooltip>
                 </span>
               </Checkbox>)
             }
           </FormItem>
           <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
             {getFieldDecorator('hasValidityDuration', {
                initialValue: item.hasValidityDuration,
             })(
               <Checkbox defaultChecked={false} onChange={this.hasValidityPeriodChangeHandler}>
                 <span>Has a validity period?
                   <Tooltip title="Is it active for operation for a specific number of hours?">
                     <Icon type="question-circle-o" />
                   </Tooltip>
                 </span>
               </Checkbox>)
             }
           </FormItem>
           { hasValidityDuration && (
           <FormItem label="Validity Period (Hours):" hasFeedback {...formItemLayout}>
             {getFieldDecorator('validityDuration', {
                  initialValue: item.validityDuration,
                  rules: [
                    {
                      required: true,
                      message: 'Validity period must be specified',
                   },
                  ],
               })(<InputNumber min={1} />)}
           </FormItem>
)}
           <FormItem label="Description:" hasFeedback {...formItemLayout}>
             {getFieldDecorator('description', {
                initialValue: item.description,
             })(<TextArea rows={4} />)}
           </FormItem>

         </Form>
       </Modal>
     </LocaleProvider>
   );
 }
}

VisitTypeModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(VisitTypeModal);
