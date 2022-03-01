import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ paymentWallets, loading }) => ({
  paymentWallets,
  loading: loading.effects['paymentWallets/query']
}))
class PatientPaymentWalletSelect extends PureComponent {

  static defaultProps = {
    disabled: false,
    patient: {},
    paymentWallets: {},
  };

  static propTypes = {
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    onPatientPaymentWalletSelect: PropTypes.func.isRequired,
    patient: PropTypes.object.isRequired,
    paymentType: PropTypes.string,
    paymentWallets: PropTypes.object,
    status: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch, patient, paymentType, status } = this.props;

    let payload = { patientId: patient.id };
    if(status !== undefined) {
      payload.status = status;
    }

    if(paymentType !== undefined) {
      payload.paymentType = paymentType;
    }

    dispatch({ type: 'paymentWallets/query', payload });
  }

  paymentWalletSelectChangeHandler = (value) => {
    const  { paymentWallets, onPatientPaymentWalletSelect } = this.props;
    const { list } = paymentWallets;
    onPatientPaymentWalletSelect(list[value]);
  }

  render() {
    const { disabled, paymentWallets } = this.props;
    const { list, loading } = paymentWallets;

    return (
      <Select
        allowClear
        disabled={disabled}
        notFoundContent={loading ? <Spin size="small" /> : 'No payment wallet for this patient found'}
        placeholder="Select payment wallet"
        style={{ width: 300 }}
        onChange={this.paymentWalletSelectChangeHandler}
        filterOption={false}
      >
        {list.map((wallet, index) => <Option key={index} value={index.toString()}>{wallet.walletType.name} {wallet.default ? ' (default)' : null}</Option>)}
      </Select>
    );
  }

}

export default PatientPaymentWalletSelect;
