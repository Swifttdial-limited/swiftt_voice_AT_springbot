import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import mapKeys from 'lodash';
import { Select, Spin } from 'antd';

const Option = Select.Option;

class PriceListSelect extends PureComponent {

  constructor(props) {
    super(props);
    this.priceListSearchHandler = debounce(this.priceListSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_price_lists/query' });
  }

  handlePriceListSelectChange = (value, e) => {
    const { catalogue_price_lists, onPriceListSelect } = this.props;
    const { list } = catalogue_price_lists;

    onPriceListSelect(value ? list[value] : null);
  }

  priceListSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { searchQueryParam: value };
      dispatch({ type: 'catalogue_price_lists/query', payload });
    }
  }

  render() {
    const { catalogue_price_lists, disabled, editValue, multiSelect } = this.props;
    const { list, loading } = catalogue_price_lists;

    const selectProps = {};

    if(editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        disabled={disabled}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No price list matching search criteria found'}
        placeholder={multiSelect ? 'Select price list(s)' : 'Select price list'}
        showSearch
        onChange={this.handlePriceListSelectChange}
        onSearch={this.priceListSearchHandler}
        filterOption={false}
      >
        {list.map((priceList, index) => <Option key={index} value={index.toString()}>{priceList.name}</Option>)}
      </Select>
    );
  }
}

PriceListSelect.defaultProps = {
  disabled: false,
  multiSelect: false,
};

PriceListSelect.propTypes = {
  catalogue_price_lists: PropTypes.object,
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool.isRequired,
  onPriceListSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ catalogue_price_lists }) {
  return { catalogue_price_lists };
}

export default connect(mapStateToProps)(PriceListSelect);
