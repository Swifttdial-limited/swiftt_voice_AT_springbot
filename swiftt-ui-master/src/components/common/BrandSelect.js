import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class BrandSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleBrandSearch = debounce(this.handleBrandSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_brands/query' });
  }

  handleBrandSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'catalogue_brands/query', payload: { searchQueryParam: value } }); }
  }

  handleBrandSelectChange = (value, e) => {
    const { catalogue_brands, onBrandSelect, multiSelect } = this.props;
    const { list } = catalogue_brands;

    if (!multiSelect) { onBrandSelect(list[value]); } else { onBrandSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { catalogue_brands } = this.props;
    const { list } = catalogue_brands;

    const selectedBrands = [];
    value.forEach((itemIndex) => {
      selectedBrands.push(list[itemIndex]);
    });

    return selectedBrands;
  }

  render() {
    const { catalogue_brands, multiSelect, editValue } = this.props;
    const { list, loading } = catalogue_brands;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No brand matching search criteria found'}
        placeholder={multiSelect ? 'Select brand(s)' : 'Select brand'}
        showSearch
        onChange={this.handleBrandSelectChange}
        onSearch={this.handleBrandSearch}
        filterOption={false}
      >
        {list.map((brand, index) => <Option key={index} value={index.toString()}>{brand.brandName}</Option>)}
      </Select>
    );
  }
}

BrandSelect.propTypes = {
  catalogue_brands: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  multiSelect: PropTypes.bool.isRequired,
  onBrandSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ catalogue_brands }) {
  return { catalogue_brands };
}

export default connect(mapStateToProps)(BrandSelect);
