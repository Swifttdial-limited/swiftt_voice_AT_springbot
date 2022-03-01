import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Select, Tooltip, Icon, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
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
class UserFormModal extends PureComponent {

  static defaultProps = {
    item: {},
    onOk: () => {},
    onCancel: () => {},
  };

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  render() {
    const {
      form,
      visible,
      type,
      item,
      onOk,
      onCancel,
      institution,
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    function handleOk() {
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

    const modalOpts = {
      title: `${type === 'create' ? 'New Outbound Channel' : 'Edit Outbound Channel'}`,
      visible,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="Type of Event" hasFeedback>
              {getFieldDecorator('typeOfEvent', {
                initialValue: item.typeOfEvent,
                rules: [
                  {
                    required: true,
                    message: 'Type of event must be specified.',
                 },
                ],
             })(
               <Select style={{ width: 200 }} placeholder="Select type of event to bind to">
                 <Option value="PATIENT_REGISTRATION">On Patient Registration</Option>
                 <Option value="VISIT_CREATION">On Patient Visit Creation</Option>
                 <Option value="BILL_CREATION">On Patient Bill Creation</Option>
                 <Option value="REQUEST_CREATION">On Patient Request Creation</Option>
               </Select>
             )}
            </FormItem>
            <FormItem label="Destination Address：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('destinationURL', {
                initialValue: item.destinationURL,
                rules: [
                  {
                    required: true,
                    message: 'Destination URL must be specified',
                 },
                ],
             })(<Input placeholder="http://192.168.0.1" />)}
            </FormItem>
            <FormItem label="Destination Port:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('destinationPort', {
                initialValue: item.destinationPort,
                rules: [
                  {
                    required: true,
                    message: 'Destination port must be specified',
                 },
                ],
             })(<Input placeholder="8080" />)}
            </FormItem>

            <FormItem label="Description:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
             })(<TextArea rows={3} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default UserFormModal;
