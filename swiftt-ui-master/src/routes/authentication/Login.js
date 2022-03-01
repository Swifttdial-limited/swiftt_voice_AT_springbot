import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';

import Login from '../../components/Login';
import styles from './index.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/authentication'],
}))
export default class LoginPage extends PureComponent {
  state = {
    type: 'account',
    autoLogin: true,
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/authentication',
        payload: {
          ...values,
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;

    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="Login">
            {/*
              type === 'account' && !login.submitting && !login.success &&
              this.renderMessage('Wrong username or password')
            */}
            <UserName name="username" placeholder="Username" />
            <Password name="password" placeholder="Password" />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>Remember login?</Checkbox>
            <a style={{ float: 'right' }} href="">Forgot password?</a>
          </div>
          <Submit loading={submitting}>Log In</Submit>
        </Login>
      </div>
    );
  }
}
