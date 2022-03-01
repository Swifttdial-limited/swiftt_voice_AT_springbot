import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Modal,
  Input,
  LocaleProvider,
  Icon,
  Row,
  Col,
  Tooltip,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import IdentificationTypeSelect from '../../../../common/IdentificationTypeSelect';
import UserGroupSelect from '../../../../common/UserGroupSelect';

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
class UserSpecializationModal extends PureComponent {
  static defaultProps = {
    visible: false,
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

      // DO VALIDATIONS HERE
      onOk(data);
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, getFieldsError, validateFields, setFieldsValue } = form;

    const modalOpts = {
      title: `${type === 'create' ? 'New Specialization' : 'Edit Specialization'}`,
      visible,
      width: 600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const identificationTypeSelectProps = {
      multiSelect: false,
      target: "Person",
      onIdentificationTypeSelect(value) {
        setFieldsValue({ identificationType: value });
      }
    };

    const userGroupSelectProps = {
      multiSelect: false,
      onUserGroupSelect(value) {
        setFieldsValue({ actor: value });
      }
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Specialization Group:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('actor', {
                initialValue: item.actor,
                rules: [
                  {
                    required: true,
                    message: 'Specialization group must be specified',
                 },
                ],
             })(<UserGroupSelect
               editValue={item.actor ? item.actor.name : null}
               {...userGroupSelectProps}
             />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  Identification Type&nbsp;
                    <Tooltip title="Like national identity number">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('identificationType', {
                initialValue: item.identificationType,
                rules: [
                  {
                    required: true,
                    message: 'Identification type must be specified',
                 },
                ],
              })(
                <IdentificationTypeSelect
                  editValue={item.identificationType ? item.identificationType.name : null}
                  {...identificationTypeSelectProps}
                />
              )}
            </FormItem>
            <FormItem label="Identification" hasFeedback {...formItemLayout}>
              {getFieldDecorator('identification', {
                initialValue: item.identification,
                rules: [
                  {
                    required: true,
                    message: 'Identification must be Selected',
                 },
                ],
             })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default UserSpecializationModal;
