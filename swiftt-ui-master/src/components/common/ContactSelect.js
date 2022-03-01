import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

import { query } from '../../services/accounting/contacts';

const Option = Select.Option;

class ContactSelect extends PureComponent {
  static defaultProps = {
    disabled: false,
  };

  static propTypes = {
    contacts: PropTypes.object,
    disabled: PropTypes.bool,
    editValue: PropTypes.string,
    onContactSelect: PropTypes.func.isRequired,
    contactType: PropTypes.string.isRequired,
  };

  state = {
    contacts: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.contactSearchHandler = debounce(this.contactSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchContacts();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && prevState.contacts.length == 0) {
      return {
        contacts: nextProps.multiSelect ? nextProps.editValue : [nextProps.editValue],
      }
    }

    return null;
  }

  contactSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchContacts(value);
    }
  }

  fetchContacts = (searchQueryParam) => {
    const { contactType } = this.props;

    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && {name: searchQueryParam}),
      ...(contactType === 'CUSTOMER' && { isCustomer: true }),
      ...(contactType === 'VENDOR' && { isVendor: true }),
    }).then((response) => {
      this.setState({ contacts: response.content, loading: false });
    }).catch((e) => {
      this.setState({ contacts: [], loading: false });
    });
  }

  contactSelectChangeHandler = (value, e) => {
    const { onContactSelect } = this.props;
    const { contacts } = this.state;

    onContactSelect(value ? contacts[value] : null);
  }

  render() {
    const { disabled, editValue } = this.props;
    const { contacts, loading } = this.state;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        disabled={disabled}
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search Contact"
        showSearch
        onChange={this.contactSelectChangeHandler}
        onSearch={this.contactSearchHandler}
        filterOption={false}
        style={{ width: '100%' }}
      >
        {contacts.map((contact, index) => <Option key={index} value={index.toString()}>{contact.name} {contact.code ? `(${contact.code})` : null }</Option>)}
      </Select>
    );
  }
}

export default ContactSelect;
