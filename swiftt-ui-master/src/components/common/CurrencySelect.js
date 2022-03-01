import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class CurrencySelect extends PureComponent {
  constructor(props) {
    super(props);
    this.countrySearchHandler = debounce(this.countrySearchHandler, 1000);
  }

  countrySearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'countries/query', payload: { searchQueryParam: value } }); }
  }

  handleCountrySelectChange = (value, e) => {
    const { countries, onCurrencySelect } = this.props;
    const { list } = countries;

    onCurrencySelect(value ? list[value].currency : null);
  }

  render() {
    const { countries, editValue } = this.props;
    const { list, loading } = countries;

    return (
      <Select
        allowClear
        defaultValue={editValue}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search country"
        showSearch
        style={{ width: 300 }}
        onChange={this.handleCountrySelectChange}
        onSearch={this.countrySearchHandler}
        filterOption={false}
      >
        {list.map((country, index) => <Option key={index} value={index.toString()}>{county.currency} ({country.countryName})</Option>)}
      </Select>
    );
  }
}

CurrencySelect.propTypes = {
  countries: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  onCurrencySelect: PropTypes.func.isRequired,
};

function mapStateToProps({ countries }) {
  return { countries };
}

export default connect(mapStateToProps)(CurrencySelect);
