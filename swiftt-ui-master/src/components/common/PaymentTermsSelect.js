import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/accounting/paymentTerms';

const Option = Select.Option;

class PaymentTermsSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.object,
    multiSelect: PropTypes.bool.isRequired,
    onPaymentTermsSelect: PropTypes.func.isRequired,
  };

  state = {
    list: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.paymentTermsSearchHandler = debounce(this.paymentTermsSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchPaymentTerms();
  }

  paymentTermsSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchPaymentTerms(value);
    }
  }

  fetchPaymentTerms = (searchQueryParam) => {
    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ list: response.content, loading: false });
    }).catch((e) => {
      this.setState({ list: [], loading: false });
    });;
  }

  handlePaymentTermsSelectChange = (value, e) => {
    const { multiSelect, onPaymentTermsSelect } = this.props;

    if (!multiSelect) {
      onPaymentTermsSelect(this.mapSelectedValueToPaymentTerms(value));
    } else {
      onPaymentTermsSelect(this.mapSelectedValuesToPaymentTerms(value));
    }
  }

  mapSelectedValueToPaymentTerms = (selectedPaymentTerms) => {
    const { list } = this.state;
    return find(list, { publicId: selectedPaymentTerms.key});
  }

  mapSelectedValuesToPaymentTerms = (values) => {
    const { list } = this.state;

    const selectedPaymentTermss = [];
    values.forEach((selectedPaymentTerms) => {
      list.push({ name: selectedPaymentTerms.label, publicId: selectedPaymentTerms.key });
    })

    return list;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { list, loading } = this.state;

    const generateLabel = (paymentTermsType) =>
      Object.assign({}, { key: paymentTermsType.publicId, label: paymentTermsType.name });

    const generatePaymentTermsTokens = (accs) => map(accs, (paymentTerms) => {
      return generateLabel(paymentTerms);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generatePaymentTermsTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        style={{ width: '100%' }}
        placeholder={'Select payment terms(s)'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No payment terms matching search criteria found'}
        onChange={this.handlePaymentTermsSelectChange}
        onSearch={this.paymentTermsSearchHandler}
        filterOption={false}>
        {list.map((paymentTerms, index) => <Option key={index} value={paymentTerms.publicId}>{generateLabel(paymentTerms).label}</Option>)}
      </Select>
    );
  }
}

export default PaymentTermsSelect;
