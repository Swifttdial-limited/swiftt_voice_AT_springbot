import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

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

@Form.create()
@connect(({ loading }) => ({
  submitting: loading.effects['profile/applyAction'],
}))
class PasswordResetPage extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    submitting: PropTypes.bool,
  };

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

  handleSubmit = (err, value) => {
    const { dispatch, form, login } = this.props;
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
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <h1>Reset your password</h1>
        <Form>
          <FormItem>
            {getFieldDecorator('currentPassword', {
              rules: [
                {
                  required: true,
                  message: 'Current password must be specified.',
                },
              ],
            })(<Input type="password" placeholder="Current password" />)}
          </FormItem>
          <FormItem help={this.state.help}>
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
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder="Password"
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
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
            })(<Input type="password" placeholder="Confirm password" />)}
          </FormItem>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>Reset &amp; Proceed</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default PasswordResetPage;
