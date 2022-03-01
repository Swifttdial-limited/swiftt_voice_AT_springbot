import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Select, Icon } from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/authorization'],
}))
@Form.create()
class AuthorizationPage extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    submitting: PropTypes.bool,
    login: PropTypes.object.isRequired,
  };

  handleSubmit = (err, value) => {
    const { dispatch, form, login } = this.props;
    const { validateFieldsAndScroll } = form;
    const { currentUser } = login;
    const { username, password } = currentUser;

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const newValues = { ...values, username, password };
      dispatch({
        type: 'login/authorization',
        payload: {
          ...newValues,
        },
      });
    });
  }

  render() {
    const { form, login, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { currentUser } = login;
    const { roles, fullName } = currentUser;

    return (
      <div className={styles.main}>
        <h1>Hi, {fullName}</h1>
        <form>
          <FormItem hasFeedback>
            {getFieldDecorator('role', {
                rules: [
                  { required: true, message: 'Role must be specified to proceed' },
                ],
              })(
                <Select
                  placeholder="Select active session role"
                  filterOption={false}
                >
                  {roles.map((role, index) => <Option key={index} value={role.publicId}>{role.name}</Option>)}
                </Select>
              )}
          </FormItem>
          <div>
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>Proceed</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default AuthorizationPage;
