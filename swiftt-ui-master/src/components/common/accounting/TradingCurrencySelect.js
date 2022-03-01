import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ tradingCurrencies, loading }) => ({
  tradingCurrencies,
  loading: loading.effects['tradingCurrencies/query']
}))
class TradingCurrencySelect extends PureComponent {

  static defaultProps = {
    disabled: false,
    multiSelect: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    tradingCurrencies: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    onTradingCurrencySelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.tradingCurrencySearchHandler = debounce(this.tradingCurrencySearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tradingCurrencies/query' });
  }

  handleTradingCurrencySelectChange = (value, e) => {
    const { tradingCurrencies, onTradingCurrencySelect } = this.props;
    const { list } = tradingCurrencies;

    onTradingCurrencySelect(value ? list[value] : null);
  }

  tradingCurrencySearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'tradingCurrencies/query', payload });
    }
  }

  render() {
    const { tradingCurrencies, disabled, editValue } = this.props;
    const { list, loading } = tradingCurrencies;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        disabled={disabled}
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : 'No tradingCurrency matching search criteria found'}
        placeholder="Select Trading Currency"
        showSearch
        onChange={this.handleTradingCurrencySelectChange}
        onSearch={this.tradingCurrencySearchHandler}
        filterOption={false}
      >
        {list.map((tradingCurrency, index) => <Option key={index} value={index.toString()}>{tradingCurrency.currency.name} ({tradingCurrency.currency.code})</Option>)}
      </Select>
    );
  }
}

export default TradingCurrencySelect;
