import enUS from 'antd/lib/locale-provider/en_US';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Form,
  Input,
  LocaleProvider,
  Button,
  Icon,
  Row,
  Col,
  Tooltip,
  Card,
  Popover,
  Progress
} from 'antd';

import styles from './index.less';

const FormItem = Form.Item;

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

const passwordStatusMap = {
  ok: <div className={styles.success}>Perfect</div>,
  pass: <div className={styles.warning}>Good</div>,
  poor: <div className={styles.error}>Poor</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
@connect()
class PasswordResetView extends PureComponent {

  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: 'You must specify new password',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  handlePasswordResetSubmit = (err, value) => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const newValues = { ...values, actionType: 'CHANGE_PASSWORD' };
      dispatch({
        type: 'login/forcedPasswordReset',
        payload: {
          ...newValues,
        },
      });
    });
  }

  render() {

    const { form } = this.props;
    const { getFieldDecorator, getFieldsError, setFieldsValue } = form;

    return(
      <Card title="Change Password">
        <Row>
          <Col span={20}>
            <Form>
              <FormItem label="Current Password:" {...formItemLayout}>
                {getFieldDecorator('currentPassword', {
                  rules: [
                    {
                      required: true,
                      message: 'Current password must be specified.',
                    },
                  ],
                })(<Input type="password" />)}
              </FormItem>
              <FormItem label="New Password:" help={this.state.help} {...formItemLayout}>
                <Popover
                  content={
                    <div style={{ padding: '4px 0' }}>
                      {passwordStatusMap[this.getPasswordStatus()]}
                      {this.renderPasswordProgress()}
                      <div style={{ marginTop: 10 }}>
                        Please enter atleast 6 characters. Please do not use easily guessed passwords
                      </div>
                    </div>
                  }
                  overlayStyle={{ width: 240 }}
                  placement="right"
                  visible={this.state.visible}
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: 'Current password must be specified.',
                        validator: this.checkPassword,
                      },
                    ],
                  })(
                    <Input type="password" />
                  )}
                </Popover>
              </FormItem>
              <FormItem label="Re-Type New Password" {...formItemLayout}>
                {getFieldDecorator('confirmPassword', {
                  rules: [
                    {
                      required: true,
                      message: 'You must confirm your new password',
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(<Input type="password" />)}
              </FormItem>
              <div style={{ marginTop: 10 }}>
                <Button type="primary" onClick={this.handlePasswordResetSubmit}>Reset Password</Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    );
  }

}

export default PasswordResetView;
