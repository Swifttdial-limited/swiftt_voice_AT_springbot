import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Select, Transfer } from 'antd';

import { queryUsersByRole } from '../../services/users';

const Option = Select.Option;

class MultiRoleUserSelect extends PureComponent {

  static defaultProps = {
    roles: [],
    onUserSelect: () => {},
  };

  static propTypes = {
    roles: PropTypes.array.isRequired,
    onUserSelect: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    users: [],
    targetKeys: [],
  };

  fetchUsers = (selectedRole) => {

    this.setState({ loading: true });

    queryUsersByRole({
      publicId: selectedRole,
      size: 100,
    }).then((response) => {
      this.setState({ users: response.content, loading: false });
    }).catch((e) => {
      this.setState({ users: [], loading: false });
    });
  }

  handleRoleChange = (value) => {
    if(value) {
      this.fetchUsers(value)
    }
  }

  handleSelectedUsersChange = (targetKeys, direction, moveKeys) => {
    const { dispatch, onUserSelect } = this.props;

    const selectedUsers = [];
    moveKeys.forEach(key => selectedUsers.push(this.mapKeyToObject(key)));

    this.setState({ targetKeys });

    onUserSelect(selectedUsers);
  }

  mapKeyToObject = (key) => {
    const { users } = this.state;
    return users.find(user => user.publicId === key);
  }

  render() {
    const { roles } = this.props;

    return (
      <div>
        <Select placeholder="Select role" onChange={this.handleRoleChange}>
          {roles.map((role, index) => <Option key={role.publicId} value={role.publicId}>{role.name}</Option>)}
        </Select>
        <Transfer
          dataSource={this.state.users}
          searchPlaceholder="Search user..."
          showSearch
          listStyle={{
            width: '46%',
            height: 300,
          }}
          notFoundContent="No users defined"
          targetKeys={this.state.targetKeys}
          onChange={this.handleSelectedUsersChange}
          render={item => `${item.fullName} - (${item.username})`}
          rowKey={record => record.publicId}
          footer={this.renderFooter}
        />
      </div>
    );
  }
}

export default MultiRoleUserSelect;
