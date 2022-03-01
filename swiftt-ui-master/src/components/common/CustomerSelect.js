import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class CustomerSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleCustomerSearch = debounce(this.handleCustomerSearch, 1000);
  }

  handleCustomerSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'customers/query', payload: { searchQueryParam: value } }); }
  }

  handleCustomerSelectChange = (value, e) => {
    const { customers, onCustomerSelect } = this.props;
    const { list } = customers;
    onCustomerSelect(list[value]);
  }

  render() {
    const { customers, multiSelect } = this.props;
    const { list, loading } = customers;

    return (
      <Select
        allowClear
        labelInValue
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No customer matching search criteria found'}
        placeholder={multiSelect ? 'Select customer(s)' : 'Select customer'}
        showSearch
        style={{ width: 300 }}
        onChange={this.handleCustomerSelectChange}
        onSearch={this.handleCustomerSearch}
        filterOption={false}
      >
        {list.map((customer, index) => <Option key={index} value={index.toString()}>{customer.name}</Option>)}
      </Select>
    );
  }
}

CustomerSelect.propTypes = {
  customers: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool.isRequired,
  onCustomerSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ customers }) {
  return { customers };
}

export default connect(mapStateToProps)(CustomerSelect);
