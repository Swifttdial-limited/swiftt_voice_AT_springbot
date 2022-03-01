import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Input, Select, Spin } from 'antd';

import { query } from '../../services/accounting/accounts';

const InputGroup = Input.Group;
const Option = Select.Option;

class AccountSelect extends PureComponent {
  static defaultProps = {
    disabled: false,
    isControlAccount: false,
    isVisible: false,
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    disabled: PropTypes.bool,
    style: PropTypes.object,
    editValue: PropTypes.any,
    isControlAccount: PropTypes.bool,
    isVisible: PropTypes.bool,
    multiSelect: PropTypes.bool.isRequired,
    onAccountSelect: PropTypes.func.isRequired,
  };

  state = {
    accounts: [],
    loading: false,
    searchFilter: 'number',
  };

  constructor(props) {
    super(props);
    this.accountSearchHandler = debounce(this.accountSearchHandler, 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && prevState.accounts.length == 0) {
      return {
        accounts: nextProps.multiSelect ? nextProps.editValue : [nextProps.editValue],
      }
    }

    return null;
  }

  accountSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchAccounts(value);
    }
  }

  changeSearchFilterHandler = (value) => this.setState({ searchFilter: value });

  fetchAccounts = (searchQueryParam) => {
    const { isControlAccount, isVisible } = this.props;
    const { searchFilter } = this.state;

    let searchPayload = {};
    searchFilter === 'name' ? searchPayload.name = searchQueryParam : searchPayload.accountNumber = searchQueryParam;

    this.setState({ loading: true });

    query({
      accountCategory: false,
      ...(isControlAccount && { isControlAccount: true }),
      ...(isVisible && { visible: true }),
      ...(searchQueryParam != undefined && searchPayload)
    }).then((response) => {
      this.setState({ accounts: response.content, loading: false });
    }).catch((e) => {
      this.setState({ accounts: [], loading: false });
    });
  }

  handleAccountSelectChange = (value, e) => {
    const { multiSelect, onAccountSelect } = this.props;
    if(typeof value !== "undefined" ){
      if (!multiSelect) {
        onAccountSelect(this.mapSelectedValueToAccount(value));
      } else {
        onAccountSelect(this.mapSelectedValuesToAccount(value));
      }
    }
  }

  mapSelectedValueToAccount = (selectedAccount) => {
    const { accounts } = this.state;
    return find(accounts, { publicId: selectedAccount.key});
  }

  mapSelectedValuesToAccount = (values) => {
    const { accounts } = this.state;

    const selectedAccounts = [];
    values.forEach((selectedAccount) => {
      selectedAccounts.push({ name: selectedAccount.label, publicId: selectedAccount.key });
    })

    return selectedAccounts;
  }

  generateAccountTokens = (accs) => map(accs, (account) => {
    return this.generateLabel(account);
  });

  generateLabel = (account) => {
    return {
      key: account.publicId,
      label: account.parentAccount ? account.name + ' (' + account.accountNumber + ') - ' + account.parentAccount.name : account.name + ' (' + account.accountNumber,
    };
  }

  render() {
    const { disabled, editValue, multiSelect, style } = this.props;
    const { accounts, loading } = this.state;

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) {
        selectProps.defaultValue = this.generateAccountTokens(editValue);
      } else {
        selectProps.defaultValue = this.generateLabel(editValue);
      }
    }

    return (
      <InputGroup compact>
        <Select
          disabled={disabled}
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
          labelInValue={true}
          showSearch
          placeholder={multiSelect ? 'Select account(s)' : 'Select account'}
          mode={multiSelect ? 'multiple' : ''}
          notFoundContent={loading ? <Spin size="small" /> : 'No account matching search criteria found'}
          onChange={this.handleAccountSelectChange}
          onSearch={this.accountSearchHandler}
          filterOption={false}
          style={{ width: '70%' }}>
          {accounts.map((account, index) => <Option key={index} value={account.publicId}>{this.generateLabel(account).label}</Option>)}
        </Select>
      </InputGroup>
    );
  }
}

export default AccountSelect;
