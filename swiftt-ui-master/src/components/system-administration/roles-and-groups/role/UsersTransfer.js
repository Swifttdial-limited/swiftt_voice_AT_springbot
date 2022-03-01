import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Transfer } from 'antd';

@connect(({ users, loading }) => ({
  users,
  loading: loading.effects['users/query'],
}))
class UsersTransfer extends PureComponent {

  state = {
    targetKeys: [],
  };

  static defaultProps = {
    users: {},
    roleUsers: [],
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    users: PropTypes.object,
    roleUsers: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'users/query', payload: { enabled: true, size: 500 } });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.roleUsers.length > 0) {
      const targetKeys = [];
      nextProps.roleUsers.forEach(roleUser => targetKeys.push(roleUser.publicId));

      this.setState({ targetKeys });
    }
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    const { dispatch } = this.props;

    let payloadData = {};
    const selectedUsers = [];
    moveKeys.forEach(key => selectedUsers.push(this.mapKeyToObject(key)));

    if (direction === 'right') { // add users
      payloadData = { actionType: 'ADD_USERS', users: selectedUsers };
    } else if (direction === 'left') { // remove users
      payloadData = { actionType: 'REMOVE_USERS', users: selectedUsers };
    }

    dispatch({ type: 'role/applyAction', payload: payloadData });
  }

  mapKeyToObject = (key) => {
    const { users } = this.props;
    const { list } = users;

    return list.find(user => user.publicId === key);
  }

  render() {
    return (
      <Transfer
        dataSource={this.props.users.list}
        searchPlaceholder="Search user..."
        showSearch
        listStyle={{
          width: '46%',
          height: 300,
        }}
        notFoundContent="No users defined"
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        render={item => `${item.fullName} - (${item.username})`}
        rowKey={record => record.publicId}
        footer={this.renderFooter}
      />
    );
  }
}

export default UsersTransfer;
