import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { Input, Select, Spin } from 'antd';

import { query } from '../../services/accounting/accounts';

const InputGroup = Input.Group;
const Option = Select.Option;

class AccountCategorySelect extends PureComponent {
  static defaultProps = {
    disabled: false,
    multiSelect: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onAccountCategorySelect: PropTypes.func.isRequired,
  };

  state = {
    accounts: [],
    loading: false,
    searchFilter: 'number',
  };

  constructor(props) {
    super(props);
    this.accountCategorySearchHandler = debounce(this.accountCategorySearchHandler, 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && prevState.accounts.length == 0) {
      return {
        accounts: nextProps.multiSelect ? nextProps.editValue : [nextProps.editValue],
      }
    }

    return null;
  }

  accountCategorySearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchAccountCategories(value);
    }
  }

  changeSearchFilterHandler = (value) => this.setState({ searchFilter: value });

  fetchAccountCategories = (searchQueryParam) => {
    const { searchFilter } = this.state;
    let searchPayload = {};

    searchFilter === 'name' ? searchPayload.name = searchQueryParam : searchPayload.accountNumber = searchQueryParam;

    this.setState({ loading: true });

    query({
      accountCategory: true,
      ...(searchQueryParam != undefined && searchPayload)
    }).then((response) => {
      this.setState({ accounts: response.content, loading: false });
    }).catch((e) => {
      this.setState({ accounts: [], loading: false });
    });
  }

  handleAccountCategorySelectChange = (value, e) => {
    const { onAccountCategorySelect } = this.props;
    const { accounts, loading } = this.state;

    onAccountCategorySelect(value ? accounts[value] : null);
  }

  render() {
    const { disabled, editValue, multiSelect } = this.props;
    const { accounts, loading } = this.state;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <InputGroup compact>
        <Select
          defaultValue="number"
          onChange={this.changeSearchFilterHandler}
          style={{ width: '30%' }}>
          <Option value="number">Number</Option>
          <Option value="name">Name</Option>
        </Select>
        <Select
          {...selectProps}
          allowClear
          disabled={disabled}
          mode={multiSelect ? 'multiple' : ''}
          notFoundContent={loading ? <Spin size="small" /> : 'No account category matching search criteria found'}
          placeholder={multiSelect ? 'Select account categories' : 'Select account category'}
          showSearch
          onChange={this.handleAccountCategorySelectChange}
          onSearch={this.accountCategorySearchHandler}
          filterOption={false}
          style={{ width: '70%' }}
        >
          {accounts.map((account, index) => <Option key={index} value={index.toString()}>{account.name} ({account.code})</Option>)}
        </Select>
      </InputGroup>
    );
  }
}

export default AccountCategorySelect;
