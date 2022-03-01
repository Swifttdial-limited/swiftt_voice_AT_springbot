import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ walletTypes, loading }) => ({
  walletTypes,
  loading: loading.effects['walletTypes/query'],
}))
class WalletTypeSelect extends PureComponent {
  static defaultProps = {
    disabled: false,
    multiSelect: false,
    onWalletTypeSelect: () => {},
  };

  static propTypes = {
    customer: PropTypes.object,
    disabled: PropTypes.bool,
    multiSelect: PropTypes.bool.isRequired,
    walletTypes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    onWalletTypeSelect: PropTypes.func.isRequired,
    paymentType: PropTypes.any,
    scheme: PropTypes.any,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({ type: 'walletTypes/purge' });
    dispatch({ type: 'walletTypes/query' });
  }

  handleFocus = () => {
    const { dispatch, customer, paymentType, scheme } = this.props;

    dispatch({ type: 'walletTypes/purge' });

    const payload = {};
    if (paymentType !== undefined) {
      payload.paymentType = paymentType;

      if (paymentType === 'CREDIT' && scheme.publicId != undefined) {
        payload.schemePublicId = scheme.publicId;
        // payload.isSchemeActive = true;
      }
    }

    if (customer !== undefined) {
      payload.contactPublicId = customer.publicId;
    }

    dispatch({ type: 'walletTypes/query', payload });
  }

  handleWalletTypeSelectChange = (value, e) => {
    const { walletTypes, onWalletTypeSelect } = this.props;
    const { list } = walletTypes;
    onWalletTypeSelect(list[value]);
  }

  render() {
    const { disabled, multiSelect, editValue, walletTypes } = this.props;
    const { list, loading } = walletTypes;

    const selectProps = {};

    if(editValue)
      selectProps.defaultValue = editValue;

    return (
      <Select
        allowClear
        disabled={disabled}
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={multiSelect ? 'Select type(s) of wallet' : 'Select type of wallet'}
        onChange={this.handleWalletTypeSelectChange}
        onFocus={this.handleFocus}
        filterOption={false}
      >
        {list.map((walletType, index) => (
          <Option key={index} value={index.toString()}>
            {walletType.name} {walletType.contact ? `(Company ${walletType.contact.name} )` : ''}
          </Option>
))}
      </Select>
    );
  }
}

export default WalletTypeSelect;
