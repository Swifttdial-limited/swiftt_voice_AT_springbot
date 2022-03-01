import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import mapKeys from 'lodash';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ paymentModes, loading }) => ({
  paymentModes,
  loading: loading.effects['paymentModes/query']
}))
class PaymentModeSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    paymentModes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    bank: PropTypes.bool,
    cashier: PropTypes.bool,
    onPaymentModeSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.paymentModeSearchHandler = debounce(this.paymentModeSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch, bank, cashier } = this.props;
    let payload = {};
    if (typeof bank !== 'undefined') {
      payload.bank = bank;
    }
    if (typeof cashier !== 'undefined') {
      payload.cashier = cashier;
    }
    dispatch({ type: 'paymentModes/query', payload });
  }

  paymentModeSearchHandler = (value) => {
    const { dispatch, bank, cashier } = this.props;


    if (value.length > 2) {
      let payload = { name: value };
      if (typeof bank !== 'undefined') {
        payload.bank = bank;
      }
      if (typeof cashier !== 'undefined') {
        payload.cashier = cashier;
      }
      dispatch({ type: 'paymentModes/query', payload });
    }
  }

  handlePaymentModeSelectChange = (value, e) => {
    const { paymentModes, onPaymentModeSelect } = this.props;
    const { list } = paymentModes;

    onPaymentModeSelect(value ? list[value] : null);
  }

  render() {
    const { paymentModes, editValue, multiSelect } = this.props;
    const { list, loading } = paymentModes;

    const selectProps = {};

    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        style={{ width: '100%' }}
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No payment mode matching search criteria found'}
        placeholder={multiSelect ? 'Select payment modes' : 'Select payment mode'}
        showSearch
        onChange={this.handlePaymentModeSelectChange}
        onSearch={this.paymentModeSearchHandler}
        filterOption={false}
      >
        {list.map((paymentMode, index) =>
          <Option key={index} value={index.toString()}>
            {paymentMode.name} {paymentMode.currency && '(Currency : '+ paymentMode.currency.name + ' - ' + paymentMode.currency.code +')'}
          </Option>)}
      </Select>
    );
  }
}

export default PaymentModeSelect;
