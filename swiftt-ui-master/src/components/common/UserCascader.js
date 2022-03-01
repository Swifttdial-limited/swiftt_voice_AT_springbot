import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { filter, forEach, map, orderBy, uniq } from 'lodash';
import { Cascader } from 'antd';

@connect(({ users, loading }) => ({
  users,
  loading: loading.effects['users/query'],
}))
class UserCascader extends PureComponent {
  state = {
    roleCount: 0,
    userCount: 0,
    options: [],
  };

  static propTypes = {
    roles: PropTypes.array.isRequired,
    users: PropTypes.object,
    onUserSelect: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.roles.length != this.state.roleCount) { this.generateRoleOptions(nextProps.roles); }
  }

  generateRoleOptions = (roles) => {
    this.setState({ roleCount: roles.length });
    orderBy(
      map(
        uniq(
          map(roles, role => JSON.stringify(role))
        ),
        role => JSON.parse(role)
      ),
      ['name'], ['asc']
    ).forEach(role => this.state.options.push(
      { value: role.publicId, label: role.name, isLeaf: false }
    ));

    this.setState({ options: [...this.state.options] });
  }

  loadData = (selectedOptions) => {
    const { users } = this.props;
    const { loading, list } = users;

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];

    console.log('about to add user options');
    // load options lazily
    setTimeout(() => {
      // if (!loading) {
      targetOption.loading = false;
      list.forEach((user) => {
        targetOption.children.push({
          label: user.fullName,
          value: user.publicId,
        });
      });
      console.log('added user options');

      this.setState({
        options: [...this.state.options, targetOption],
      }, () => console.log('we are behind state'));

      console.log('added user options to state');
      // }
    }, 2500);

    console.log('done');
  }

  onChange = (value, selectedOptions) => {
    const { dispatch, onUserSelect, users } = this.props;
    const { list } = users;

    if (selectedOptions.length == 1) {
      console.log('fetch users by role');
      dispatch({ type: 'users/queryUsersByRole', payload: { publicId: value[0] } });
    }

    if (selectedOptions.length == 2) {
      const user = filter(list, ['publicId', selectedOptions[selectedOptions.length - 1].value])[0];
      onUserSelect(user || null);
    }
  }

  render() {
    return (
      <Cascader
        notFoundContent="Oops! No roles defined"
        placeholder="Select role and user"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

export default UserCascader;
