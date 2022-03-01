import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../../services/accounting/taxTypes';

const Option = Select.Option;

class TaxTypeSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onTaxTypeSelect: PropTypes.func.isRequired,
  };

  state = {
    taxTypes: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.taxTypeSearchHandler = debounce(this.taxTypeSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchTaxTypes();
  }

  taxTypeSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchTaxTypes(value);
    }
  }

  fetchTaxTypes = (searchQueryParam) => {
    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ taxTypes: response.content, loading: false });
    }).catch((e) => {
      this.setState({ taxTypes: [], loading: false });
    });;
  }

  handleTaxTypeSelectChange = (value, e) => {
    const { multiSelect, onTaxTypeSelect } = this.props;

    if (!multiSelect) {
      onTaxTypeSelect(this.mapSelectedValueToTaxType(value));
    } else {
      onTaxTypeSelect(this.mapSelectedValuesToTaxType(value));
    }
  }

  mapSelectedValueToTaxType = (selectedTaxType) => {
    const { taxTypes } = this.state;
    return find(taxTypes, { publicId: selectedTaxType.key});
  }

  mapSelectedValuesToTaxType = (values) => {
    const { taxTypes } = this.state;

    const selectedTaxTypes = [];
    values.forEach((selectedTaxType) => {
      selectedTaxTypes.push({ name: selectedTaxType.label, publicId: selectedTaxType.key });
    })

    return selectedTaxTypes;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { taxTypes, loading } = this.state;

    const generateLabel = (taxType) =>
      Object.assign({}, { key: taxType.publicId, label: taxType.name });

    const generateTaxTypeTokens = (accs) => map(accs, (taxType) => {
      return generateLabel(taxType);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateTaxTypeTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select tax type(s)' : 'Select tax type'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No tax type matching search criteria found'}
        onChange={this.handleTaxTypeSelectChange}
        onSearch={this.taxTypeSearchHandler}
        filterOption={false}>
        {taxTypes.map((taxType, index) => <Option key={index} value={taxType.publicId}>{generateLabel(taxType).label}</Option>)}
      </Select>
    );
  }
}

export default TaxTypeSelect;
