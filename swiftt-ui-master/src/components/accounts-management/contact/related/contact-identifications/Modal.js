import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Input, Modal, LocaleProvider, Tooltip, Icon, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import IdentificationTypeSelect from '../../../../common/IdentificationTypeSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class ContactIdentificationsModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    contactProfile: PropTypes.object.isRequired,
  };

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

      let identificationData = {
        identificationType: data.identificationType.publicId,
        identificationTypeName: data.identificationType.name,
        identificationTypeCode: data.identificationType.code ? data.identificationType.code : null,
        identification: data.identification,
      };
      onOk(identificationData);
    });
  }



  identificationTypeSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ identificationType: value });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel, contactProfile } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    const modalOpts = {
      title: `${type === 'create' ? 'New Identification' : 'Edit Identification'}`,
      visible,
      width: 600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                    Identification Type&nbsp;
                  <Tooltip title="Like Company registration number">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
                      )}
              hasFeedback
            >
              {getFieldDecorator('identificationType')(
                <IdentificationTypeSelect
                  target="Contact"
                  onIdentificationTypeSelect={this.identificationTypeSelectHandler}
                />
                          )}
            </FormItem>
            <FormItem {...formItemLayout} label={(<span>Identification</span>)} hasFeedback>
              {getFieldDecorator('identification', {
                            rules: [{ required: true, message: 'Identification must be specified' }],
                          })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}



export default ContactIdentificationsModal;
