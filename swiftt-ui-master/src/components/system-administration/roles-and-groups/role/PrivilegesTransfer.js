import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Transfer, Button } from 'antd';

@connect(({ privileges, loading }) => ({
  privileges,
  loading: loading.effects['privileges/query'],
}))
class PrivilegesTransfer extends PureComponent {

  static defaultProps = {
    privileges: {},
    rolePrivileges: [],
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    privileges: PropTypes.object,
    rolePrivileges: PropTypes.array.isRequired,
  };

  state = {
    targetKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'privileges/query' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rolePrivileges.length > 0) {
      const targetKeys = [];
      nextProps.rolePrivileges.forEach(rolePrivilege => targetKeys.push(rolePrivilege.code));

      this.setState({ targetKeys });
    }
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    const { dispatch } = this.props;

    let payloadData = {};
    const selectedPrivileges = [];
    moveKeys.forEach(key => selectedPrivileges.push(this.mapKeyToObject(key)));

    if (direction === 'right') { // add privileges
      payloadData = { actionType: 'ADD_PRIVILEGES', privileges: selectedPrivileges };
    } else if (direction === 'left') { // remove privileges
      payloadData = { actionType: 'REMOVE_PRIVILEGES', privileges: selectedPrivileges };
    }

    dispatch({ type: 'role/applyAction', payload: payloadData });
  }

  mapKeyToObject = (key) => {
    const { privileges } = this.props;
    const { list } = privileges;

    return list.find(privilege => privilege.code === key);
  }

  render() {
    return (
      <Transfer
        dataSource={this.props.privileges.list}
        searchPlaceholder="Search permission..."
        showSearch
        listStyle={{
          width: '46%',
          height: 300,
        }}
        notFoundContent="No permissions defined"
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        render={item => `${item.name}`}
        rowKey={record => record.code}
        footer={this.renderFooter}
      />
    );
  }
}

export default PrivilegesTransfer;
