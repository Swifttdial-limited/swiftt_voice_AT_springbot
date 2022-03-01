import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { debounce, find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query, queryUsersByRole } from '../../services/users';

const Option = Select.Option;

class UserSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.object,
    multiSelect: PropTypes.bool.isRequired,
    onUserSelect: PropTypes.func.isRequired,
    searchByEnabled: PropTypes.bool,
    role: PropTypes.object,
  };

  state = {
    users: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.userSearchHandler = debounce(this.userSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchUsers();
  }

  userSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchUsers(value);
    }
  }

  fetchUsers = () => {
    const { role, searchByEnabled } = this.props;

    this.setState({ loading: true });

    if(role) {
      queryUsersByRole({
        publicId: role.publicId,
      }).then((response) => {
        this.setState({ users: response.content, loading: false });
      }).catch((e) => {
        this.setState({ users: [], loading: false });
      });
    } else {
      query({
        ...(searchByEnabled && { enabled: searchByEnabled }),
      }).then((response) => {
        this.setState({ users: response.content, loading: false });
      }).catch((e) => {
        this.setState({ users: [], loading: false });
      });
    }
  }

  handleUserSelectChange = (value, e) => {
    const { multiSelect, onUserSelect } = this.props;

    if (!multiSelect) {
      onUserSelect(this.mapSelectedValueToUser(value));
    } else {
      onUserSelect(this.mapSelectedValuesToUser(value));
    }
  }

  mapSelectedValueToUser = (selectedUser) => {
    const { users } = this.state;

    if(selectedUser)
      return find(users, { publicId: selectedUser.key});
  }

  mapSelectedValuesToUser = (values) => {
    const { users } = this.state;

    const selectedUsers = [];
    values.forEach((selectedUser) => {
      selectedUsers.push({ name: selectedUser.label, publicId: selectedUser.key });
    })

    return selectedUsers;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { users, loading } = this.state;

    const generateLabel = (user) =>
      Object.assign({}, { key: user.publicId, label: user.fullName + ' (' + user.username + ')' });

    const generateUserTokens = (accs) => map(accs, (user) => {
      return generateLabel(user);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateUserTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        style={{...style}}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select user(s)' : 'Select user'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No user matching search criteria found'}
        onChange={this.handleUserSelectChange}
        onSearch={this.userSearchHandler}
        filterOption={false}>
        {users.map((user, index) => <Option key={index} value={user.publicId}>{generateLabel(user).label}</Option>)}
      </Select>
    );
  }
}

export default UserSelect;
