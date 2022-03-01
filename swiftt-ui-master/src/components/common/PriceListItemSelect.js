import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const Option = Select.Option;

@connect(({ catalogue_prices, loading }) => ({
  catalogue_prices,
  loading: loading.effects['catalogue_prices/query'],
}))
class PriceListItemSelect extends PureComponent {

  static propTypes = {
    catalogue_prices: PropTypes.object,
    onPriceListItemSelect: PropTypes.func.isRequired,
  };

  handlePriceListItemSelectChange = (value, e) => {
    const { catalogue_prices, onPriceListItemSelect } = this.props;
    const { list } = catalogue_prices;

    onPriceListItemSelect(list[value]);
  }

  mapSelectedValueToObject = (value) => {
    const { catalogue_prices } = this.props;
    const { list } = catalogue_prices;

    const selectedProducts = [];
    value.forEach((itemIndex) => {
      selectedProducts.push(list[itemIndex]);
    });

    return selectedProducts;
  }

  render() {
    const { catalogue_prices } = this.props;
    const { list } = catalogue_prices;

    const options = [];
    if (list.length) {
      list.map((priceListItem) => {
        const priceListItemOption = {
          key: priceListItem.id,
          text: priceListItem.product.productName,
          value: priceListItem.id,
        };
        options.push(priceListItemOption);
      });
    }

    return (
      <Select
        allowClear
        showSearch
        placeholder="Select product"
        onChange={this.handlePriceListItemSelectChange}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {options.map((priceListItem, index) => <Option key={index} value={index.toString()}>{priceListItem.text}</Option>)}
      </Select>
    );
  }
}

export default PriceListItemSelect;
