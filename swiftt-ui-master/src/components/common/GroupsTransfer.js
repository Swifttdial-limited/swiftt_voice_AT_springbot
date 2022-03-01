import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Transfer } from 'antd';

import { query } from '../../services/catalogue/groups';

class ProductGroupsTransfer extends PureComponent {
  static defaultProps = {
    productGroups: [],
  };

  static propTypes = {
    department: PropTypes.object,
    productGroups: PropTypes.array,
  };

  state = {
    groups: [],
    loading: false,
    targetKeys: [],
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.department && this.props.department) {
      this.fetchGroups();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && nextProps.productGroups.length > 0) {
      return {
        targetKeys: nextProps.productGroups.forEach(productGroup => targetKeys.push(productGroup.id)),
      };
    }

    return null;
  }

  fetchGroups = () => {
    const { department } = this.props;

    this.setState({ loading: true });

    query({
      ...{ size: 10000 },
      ...(department != undefined && { department: department.publicId }),
    }).then((response) => {
      this.setState({ groups: response.content, loading: false });
    }).catch((e) => {
      this.setState({ groups: [], loading: false });
    });;
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    const productGroups = this.props.productGroups;
    const selectProductGroups = [];
    let result = [];

    moveKeys.forEach(key => selectProductGroups.push(this.mapKeyToObject(key)));

    if (direction === 'right') { // add productGroups
      const arrs = [productGroups, selectProductGroups];
      result = [...new Set([].concat(...arrs))];
    } else if (direction === 'left') { // remove productGroups
      console.log(targetKeys)
    }

    this.props.onGroupSelect(selectProductGroups);
  }

  mapKeyToObject = (key) => {
    return this.state.groups.find(group => group.id === key);
  }

  render() {
    return (
      <Transfer
        dataSource={this.state.groups}
        searchPlaceholder="Search group..."
        showSearch
        listStyle={{
          width: '46%',
          height: 300,
        }}
        notFoundContent="No product groups defined"
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        render={item => `${item.groupName}`}
        rowKey={record => record.id}
        footer={this.renderFooter}
      />
    );
  }
}

export default ProductGroupsTransfer;
