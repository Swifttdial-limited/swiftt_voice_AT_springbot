import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ countries }) => ({
  countries
}))
class CountrySelect extends PureComponent {

  static defaultProps = {
    onCountrySelect: () => {},
  };

  static propTypes = {
    countries: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    onCountrySelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.countrySearchHandler = debounce(this.countrySearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'countries/query' });
  }

  countrySearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'countries/query', payload: { searchQueryParam: value } }); }
  }

  handleCountrySelectChange = (value) => {
    const { countries, onCountrySelect } = this.props;
    const { list } = countries;

    onCountrySelect(value ? list[value] : null);
  }

  render() {
    const { countries, editValue } = this.props;
    const { list, loading } = countries;

    const selectProps = {};

    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search country"
        showSearch
        style={{ width: 300 }}
        onChange={this.handleCountrySelectChange}
        onSearch={this.countrySearchHandler}
        filterOption={false}
      >
        {list.map((country, index) => <Option key={index} value={index.toString()}>{country.countryName}</Option>)}
      </Select>
    );
  }
}

export default CountrySelect;
