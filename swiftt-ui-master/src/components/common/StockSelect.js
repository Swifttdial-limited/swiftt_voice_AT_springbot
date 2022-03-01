import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';



const Option = Select.Option;

class StockSelect extends PureComponent {
  static defaultProps = {
    disabled: false,
    multiSelect: false,
  }

  static propTypes = {
    editValue: PropTypes.string,
    disabled: PropTypes.bool,
    location: PropTypes.object,
    multiSelect: PropTypes.bool.isRequired,
    onStockSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.stockSearchHandler = debounce(this.stockSearchHandler, 1000);
  }

  componentDidMount() {
    const { location, dispatch } = this.props;
    if (location) { dispatch({ type: 'inventoryBalances/query', payload: { location: location.publicId } }); }
  }

  stockSearchHandler = (value) => {
    const { location, dispatch } = this.props;

    if (location && value.length > 2) {
      dispatch({ type: 'inventoryBalances/query', payload: { location: location.publicId, searchQueryParam: value } });
    }
  }

  stockSelectChangeHandler = (value, e) => {
    const { inventoryBalances, multiSelect, onStockSelect } = this.props;
    const { list } = inventoryBalances;

    if (!multiSelect) { onStockSelect(value ? list[value] : null); } else { onStockSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { inventoryBalances } = this.props;
    const { list } = inventoryBalances;

    const selectedStocks = [];
    value.forEach((itemIndex) => {
      selectedStocks.push(list[itemIndex]);
    });

    return selectedStocks;
  }

  render() {
    const { inventoryBalances, disabled, editValue, multiSelect } = this.props;
    const { list, loading } = inventoryBalances;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        disabled={disabled}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={multiSelect ? 'Select stock item(s)' : 'Select stock item'}
        showSearch
        onChange={this.stockSelectChangeHandler}
        onSearch={this.stockSearchHandler}
        filterOption={false}
      >
        {list.map((stock, index) => <Option key={index} value={index.toString()}>{stock.productName} ({stock.productCode})</Option>)}
      </Select>
    );
  }
}

export default StockSelect;
