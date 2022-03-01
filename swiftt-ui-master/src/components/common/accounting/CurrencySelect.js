import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ currencies, loading }) => ({
  currencies,
  loading: loading.effects['currencies/query']
}))
class CurrencySelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    currencies: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    onCurrencySelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.currencySearchHandler = debounce(this.currencySearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'currencies/query' });
  }

  handleCurrencySelectChange = (value, e) => {
    const { currencies, onCurrencySelect } = this.props;
    const { list } = currencies;

    onCurrencySelect(value ? list[value] : null);
  }

  currencySearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'currencies/query', payload });
    }
  }

  render() {
    const { currencies, editValue } = this.props;
    const { list, loading } = currencies;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : 'No currency matching search criteria found'}
        placeholder="Select Currency"
        showSearch
        onChange={this.handleCurrencySelectChange}
        onSearch={this.currencySearchHandler}
        filterOption={false}
      >
        {list.map((currency, index) => <Option key={index} value={index.toString()}>{currency.name} ({currency.code})</Option>)}
      </Select>
    );
  }
}

export default CurrencySelect;
