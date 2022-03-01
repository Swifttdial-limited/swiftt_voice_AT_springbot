import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class UserGroupSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.groupSearchHandler = debounce(this.groupSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'userGroups/query' });
  }

  groupSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'userGroups/query', payload: { actorName: value } }); }
  }

  groupSelectChangeHandler = (value, e) => {
    const { userGroups, onUserGroupSelect } = this.props;
    const { list } = userGroups;

    onUserGroupSelect(value ? list[value] : null);
  }

  handleBlur = () => {}

  render() {
    const { userGroups, editValue } = this.props;
    const { list, loading } = userGroups;

    const selectProps = {};

    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        style={{ width: '40%' }}
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Select user group"
        showSearch
        onChange={this.groupSelectChangeHandler}
        onSearch={this.groupSearchHandler}
        filterOption={false}
      >
        {list.map((group, index) => <Option key={index} value={index.toString()}>{group.name}</Option>)}
      </Select>
    );
  }
}

UserGroupSelect.propTypes = {
  userGroups: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  onUserGroupSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ userGroups }) {
  return { userGroups };
}

export default connect(mapStateToProps)(UserGroupSelect);
