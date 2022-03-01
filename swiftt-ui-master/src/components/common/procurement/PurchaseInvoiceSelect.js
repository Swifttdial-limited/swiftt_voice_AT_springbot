import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../../services/procurement/receiptNotes';

const Option = Select.Option;

class PurchaseInvoiceSelect extends PureComponent {
  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    vendor: PropTypes.string,
    status: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onPurchaseInvoiceSelect: PropTypes.func.isRequired,
  };

  state = {
    purchaseInvoices: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.purchaseInvoiceSearchHandler = debounce(this.purchaseInvoiceSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchPurchaseInvoices();
  }

  purchaseInvoiceSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchPurchaseInvoices(value);
    }
  }

  fetchPurchaseInvoices = (searchQueryParam) => {
    const {
      status,
      vendor,
    } = this.props;

    this.setState({ loading: true });

    query({
      ...(status != undefined && { status: status }),
      ...(vendor != undefined && { vendor: vendor }),
      ...(searchQueryParam != undefined && { purchaseInvoiceReference: searchQueryParam }),
      size: 1000,
    }).then((response) => {
      this.setState({ purchaseInvoices: response.content, loading: false });
    }).catch((e) => {
      this.setState({ purchaseInvoices: [], loading: false });
    });
  }

  handlePurchaseInvoiceSelectChange = (value, e) => {
    const { onPurchaseInvoiceSelect } = this.props;
    onPurchaseInvoiceSelect(this.mapSelectedValueToPurchaseInvoice(value));
  }

  mapSelectedValueToPurchaseInvoice = (selectedPurchaseInvoice) => {
    const { purchaseInvoices } = this.state;

    if(selectedPurchaseInvoice)
      return find(purchaseInvoices, { id: selectedPurchaseInvoice});
  }

  render() {
    const { style } = this.props;
    const { purchaseInvoices, loading } = this.state;

    return (
      <Select
        style={{...style}}
        allowClear
        showSearch
        placeholder={'Select purchase invoice'}
        notFoundContent={loading ? <Spin size="small" /> : 'No purchase invoice matching search criteria found'}
        onChange={this.handlePurchaseInvoiceSelectChange}
        onSearch={this.purchaseInvoiceSearchHandler}
        filterOption={false}>
        {purchaseInvoices.map((purchaseInvoice, index) => <Option key={index} value={purchaseInvoice.id}>
          {purchaseInvoice.purchaseInvoiceReference} (Receipt Note: {purchaseInvoice.receiptNoteNumber})
        </Option>)}
      </Select>
    );
  }
}

export default PurchaseInvoiceSelect;
