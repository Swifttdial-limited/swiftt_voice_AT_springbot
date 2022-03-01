import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';

import {
  queryDetailed,
  querySummarized,
} from '../../../services/inventory/inventoryBalances';

const Option = Select.Option;

class InventorySelect extends PureComponent {
  static defaultProps = {
    detailed: false,
    onInventorySelect: () => {},
  };

  static propTypes = {
    detailed: PropTypes.bool,
    editValue: PropTypes.string,
    location: PropTypes.string,
    onInventorySelect: PropTypes.func,
    product: PropTypes.string,
    text: PropTypes.string,
  };

  state = {
    inventoryList: [],
    loading: false,
  };

  componentDidMount() {
    this.getStocks();
  }

  componentDidUpdate(prevProps) {
    const { location, product } = this.props;
    if (location !== prevProps.location || product !== prevProps.product) {
      this.getStocks();
    }
  }

  inventoryBalanceSearchHandler = (value) => {
    if (value.length > 2) {
      this.getStocks(value);
    }
  }

  inventoryBalanceSelectChangeHandler = (value, e) => {
    const { onInventorySelect } = this.props;
    const { inventoryList } = this.state;

    onInventorySelect(value ? inventoryList[value] : null);
  }

  getStocks = () => {
    const { detailed, location, product } = this.props;

    this.setState({ loading: true });

    if(detailed) {
      queryDetailed({
        ...(location != undefined && location),
        ...(product != undefined && product),
      }).then((response) => {
        this.setState({ inventoryList: response.content, loading: false });
      }).catch((e) => {
        this.setState({ inventoryList: [], loading: false });
      });
    } else {
      querySummarized({
        ...(location != undefined && {location: location}),
        ...(product != undefined && {product: product}),
      }).then((response) => {
        this.setState({ inventoryList: response.content, loading: false });
      }).catch((e) => {
        this.setState({ inventoryList: [], loading: false });
      });
    }
  }

  render() {
    const { editValue } = this.props;
    const { inventoryList, loading } = this.state;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search Inventory"
        showSearch
        onChange={this.inventoryBalanceSelectChangeHandler}
        onSearch={this.inventoryBalanceSearchHandler}
        filterOption={false}
        style={{ width: '100%' }}
      >
        {inventoryList.map((inventoryBalance, index) =>
          <Option key={index} value={index.toString()}>
            {inventoryBalance.productName} ({inventoryBalance.productCode})}
          </Option>)}
      </Select>
    );
  }
}

export default InventorySelect;
