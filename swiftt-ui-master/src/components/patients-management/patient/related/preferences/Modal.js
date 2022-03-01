import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Radio,
  Modal,
  LocaleProvider,
  Tooltip,
  Icon,
  Row,
  Col
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import UserSelect from '../../../../common/UserSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class PreferredPractitionerModal extends PureComponent {

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

  state = { userSelectVisible: true };

  externalPractitionerSelectHandler = e => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ externalPractitioner: e.target.value === 'TRUE' ? true : false });

    this.setState({ userSelectVisible: e.target.value === 'FALSE' ? true : false });
  }

  userSelectHandler = value => this.props.form.setFieldsValue({ practitionerName: value.fullName })

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
      onOk(Object.assign({}, item, data));
    });
  }

  resetState = () => {
    this.setState({
      userSelectVisible: true,
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;

    const { userSelectVisible } = this.state;

    const userSelectProps = {
      multiSelect: false,
    };

    const modalOpts = {
      title: `${type === 'create' ? 'New Preferred Practitioner' : 'Edit Preferred Practitioner'}`,
      visible,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <Row>
              <Col span={18} offset={6}>
                <FormItem hasFeedback>
                  {getFieldDecorator('externalPractitioner', {
                    initialValue: item.externalPractitioner != undefined ? item.externalPractitioner : false,
                    rules: [
                      {
                        required: true,
                        message: '',
                     },
                    ],
                 })(
                   <RadioGroup onChange={this.externalPractitionerSelectHandler}>
                     <Radio value={false}>Internal Practitioner</Radio>
                     <Radio value={true}>External Practitioner</Radio>
                   </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            { userSelectVisible ? (
              <FormItem label="Practitioner：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('practitionerName', {
                    initialValue: item.practitionerName ? item.practitionerName : null,
                    rules: [
                      {
                        required: true,
                        message: 'Practitioner must be specified',
                     },
                    ],
                 })(<UserSelect
                      editValue={item.practitionerName ? item.practitionerName : null}
                      onUserSelect={this.userSelectHandler}
                      {...userSelectProps} />)}
              </FormItem>
            ) : (
              <FormItem label="Practitioner：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('practitionerName', {
                  initialValue: item.practitionerName ? item.practitionerName : null,
                  rules: [
                    {
                      required: true,
                      message: 'Practitioner must be specified',
                   },
                  ],
               })(<Input />)}
              </FormItem>
            )}

            <FormItem label="Speciality：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('speciality', {
                initialValue: item.speciality ? item.speciality : null,
                rules: [
                  {
                    required: true,
                    message: 'Speciality must be specified',
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

export default PreferredPractitionerModal;
