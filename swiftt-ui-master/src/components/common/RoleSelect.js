import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/roles';

const Option = Select.Option;

class RoleSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    editValue: PropTypes.object,
    multiSelect: PropTypes.bool.isRequired,
    onRoleSelect: PropTypes.func.isRequired,
  };

  state = {
    roles: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.roleSearchHandler = debounce(this.roleSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchRoles();
  }

  roleSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchRoles(value);
    }
  }

  fetchRoles = (searchQueryParam) => {
    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ roles: response.content, loading: false });
    }).catch((e) => {
      this.setState({ roles: [], loading: false });
    });;
  }

  handleRoleSelectChange = (value, e) => {
    const { multiSelect, onRoleSelect } = this.props;

    if (!multiSelect) {
      onRoleSelect(this.mapSelectedValueToRole(value));
    } else {
      onRoleSelect(this.mapSelectedValuesToRole(value));
    }
  }

  mapSelectedValueToRole = (selectedRole) => {
    const { roles } = this.state;
    return find(roles, { publicId: selectedRole.key});
  }

  mapSelectedValuesToRole = (values) => {
    const { roles } = this.state;

    const selectedRoles = [];
    values.forEach((selectedRole) => {
      selectedRoles.push({ name: selectedRole.label, publicId: selectedRole.key });
    })

    return selectedRoles;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { roles, loading } = this.state;

    const generateLabel = (role) =>
      Object.assign({}, { key: role.publicId, label: role.name });

    const generateRoleTokens = (roles) => map(roles, (role) => {
      return generateLabel(role);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateRoleTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        style={{...style}}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select role(s)' : 'Select role'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No role matching search criteria found'}
        onChange={this.handleRoleSelectChange}
        onSearch={this.roleSearchHandler}
        filterOption={false}>
        {roles.map((role, index) => <Option key={index} value={role.publicId}>{generateLabel(role).label}</Option>)}
      </Select>
    );
  }
}

export default RoleSelect;
