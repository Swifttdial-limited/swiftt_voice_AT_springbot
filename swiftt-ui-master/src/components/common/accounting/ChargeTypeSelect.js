import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../../services/accounting/chargeTypes';

const Option = Select.Option;

class ChargeTypeSelect extends PureComponent {
  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.object,
    chargeType: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onChargeTypeSelect: PropTypes.func.isRequired,
  };

  state = {
    chargeTypes: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.chargeTypeSearchHandler = debounce(this.chargeTypeSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchChargeTypes();
  }

  chargeTypeSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchChargeTypes(value);
    }
  }

  fetchChargeTypes = (searchQueryParam) => {
    const { chargeType, parentChargeType } = this.props;

    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { chargeTypeName: searchQueryParam }),
      size: 1000,
    }).then((response) => {
      this.setState({ chargeTypes: response.content, loading: false });
    }).catch((e) => {
      this.setState({ chargeTypes: [], loading: false });
    });;
  }

  handleChargeTypeSelectChange = (value, e) => {
    const { multiSelect, onChargeTypeSelect } = this.props;

    if (!multiSelect) {
      onChargeTypeSelect(this.mapSelectedValueToChargeType(value));
    } else {
      onChargeTypeSelect(this.mapSelectedValuesToChargeType(value));
    }
  }

  mapSelectedValueToChargeType = (selectedChargeType) => {
    const { chargeTypes } = this.state;
    return find(chargeTypes, { publicId: selectedChargeType.key});
  }

  mapSelectedValuesToChargeType = (values) => {
    const { chargeTypes } = this.state;

    const selectedChargeTypes = [];
    values.forEach((selectedChargeType) => {
      selectedChargeTypes.push({ name: selectedChargeType.label, publicId: selectedChargeType.key });
    })

    return selectedChargeTypes;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { chargeTypes, loading } = this.state;

    const generateLabel = (chargeType) =>
      Object.assign({}, { key: chargeType.publicId, label: chargeType.name });

    const generateChargeTypeTokens = (accs) => map(accs, (chargeType) => {
      return generateLabel(chargeType);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateChargeTypeTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select charge type(s)' : 'Select charge type'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No charge type matching search criteria found'}
        onChange={this.handleChargeTypeSelectChange}
        onSearch={this.chargeTypeSearchHandler}
        filterOption={false}>
        {chargeTypes.map((chargeType, index) => <Option key={index} value={chargeType.publicId}>{generateLabel(chargeType).label}</Option>)}
      </Select>
    );
  }
}

export default ChargeTypeSelect;
