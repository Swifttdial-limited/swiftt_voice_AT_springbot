import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/catalogue/groups';

const Option = Select.Option;

class GroupSelect extends PureComponent {
  static defaultProps = {
    autoLoad: true,
    disabled: false,
    multiSelect: false,
  };

  static propTypes = {
    catalogue_groups: PropTypes.object,
    disabled: PropTypes.bool,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onGroupSelect: PropTypes.func.isRequired,
    department: PropTypes.object,
  };

  state = {
    groups: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.handleGroupSearch = debounce(this.handleGroupSearch, 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && prevState.groups.length == 0) {
      return {
        groups: nextProps.multiSelect ? nextProps.editValue : [nextProps.editValue],
      }
    }

    return null;
  }

  handleOnFocus = () => {
    const { autoLoad, dispatch, department } = this.props;

    if (autoLoad) {
      this.fetchGroups();
    }

  }

  handleGroupSearch = (value) => {
    if (value.length > 2) {
      this.fetchGroups(value);
    }
  }

  fetchGroups = (searchQueryParam) => {
    const { department } = this.props;

    this.setState({ loading: true });

    query({
      ...{ size: 10000 },
      ...(department != undefined && { department: department.publicId }),
      ...(searchQueryParam != undefined && { searchQueryParam: searchQueryParam })
    }).then((response) => {
      this.setState({ groups: response.content, loading: false });
    }).catch((e) => {
      this.setState({ groups: [], loading: false });
    });;
  }

  handleGroupSelectChange = (value, e) => {
    const { onGroupSelect, multiSelect } = this.props;

    if (!multiSelect) {
      onGroupSelect(this.mapSelectedValueToGroup(value));
    } else {
      onGroupSelect(this.mapSelectedValueToObject(value));
    }
  }

  mapSelectedValueToGroup = (selectedGroup) => {
    const { groups } = this.state;
    return find(groups, { id: selectedGroup.key});
  }

  mapSelectedValuesToGroup = (values) => {
    const { groups } = this.state;

    const selectedGroups = [];
    values.forEach((selectedGroup) => {
      selectedGroups.push({ name: selectedGroup.label, id: selectedGroup.key });
    })

    return selectedGroups;
  }

  render() {
    const { disabled, editValue, multiSelect } = this.props;
    const { groups, loading } = this.state;

    const generateLabel = (group) => Object.assign({}, { key: group.id, label: group.groupName });

    const generateGroupTokens = (accs) => map(accs, (group) => {
      return generateLabel(group);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateGroupTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        disabled={disabled}
        labelInValue={true}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No group matching search criteria found'}
        placeholder={multiSelect ? 'Select group(s)' : 'Select group'}
        showSearch
        onChange={this.handleGroupSelectChange}
        onFocus={this.handleOnFocus}
        onSearch={this.handleGroupSearch}
        filterOption={false}
      >
        {groups.map((group, index) => <Option key={index} value={group.id}>{generateLabel(group).label}</Option>)}
      </Select>
    );
  }
}

export default GroupSelect;
