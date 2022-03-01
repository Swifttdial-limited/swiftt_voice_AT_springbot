import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/inventory/inventoryAdjustmentReasons';

const Option = Select.Option;

class InventoryAdjustmentReasonSelect extends PureComponent {
  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.any,
    multiSelect: PropTypes.bool.isRequired,
    onInventoryAdjustmentReasonSelect: PropTypes.func.isRequired,
  };

  state = {
    inventoryAdjustmentReasons: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.inventoryAdjustmentReasonSearchHandler = debounce(this.inventoryAdjustmentReasonSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchInventoryAdjustmentReasons();
  }

  inventoryAdjustmentReasonSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchInventoryAdjustmentReasons(value);
    }
  }

  fetchInventoryAdjustmentReasons = (searchQueryParam) => {
    const { inventoryAdjustmentReason } = this.props;

    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { inventoryAdjustmentReasonName: searchQueryParam })
    }).then((response) => {
      this.setState({ inventoryAdjustmentReasons: response.content, loading: false });
    }).catch((e) => {
      this.setState({ inventoryAdjustmentReasons: [], loading: false });
    });;
  }

  handleInventoryAdjustmentReasonSelectChange = (value, e) => {
    const { multiSelect, onInventoryAdjustmentReasonSelect } = this.props;

    if (!multiSelect) {
      onInventoryAdjustmentReasonSelect(this.mapSelectedValueToInventoryAdjustmentReason(value));
    } else {
      onInventoryAdjustmentReasonSelect(this.mapSelectedValuesToInventoryAdjustmentReason(value));
    }
  }

  mapSelectedValueToInventoryAdjustmentReason = (selectedInventoryAdjustmentReason) => {
    const { inventoryAdjustmentReasons } = this.state;
    return find(inventoryAdjustmentReasons, { id: selectedInventoryAdjustmentReason.key});
  }

  mapSelectedValuesToInventoryAdjustmentReason = (values) => {
    const { inventoryAdjustmentReasons } = this.state;

    const selectedInventoryAdjustmentReasons = [];
    values.forEach((selectedInventoryAdjustmentReason) => {
      selectedInventoryAdjustmentReasons.push({ code: selectedInventoryAdjustmentReason.label, id: selectedInventoryAdjustmentReason.key });
    })

    return selectedInventoryAdjustmentReasons;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { inventoryAdjustmentReasons, loading } = this.state;

    const generateLabel = (inventoryAdjustmentReason) =>
      Object.assign({}, { key: inventoryAdjustmentReason.id, label: inventoryAdjustmentReason.code });

    const generateInventoryAdjustmentReasonTokens = (accs) => map(accs, (inventoryAdjustmentReason) => {
      return generateLabel(inventoryAdjustmentReason);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateInventoryAdjustmentReasonTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select inventory adjustment reason(s)' : 'Select inventory adjustment reason'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No inventory adjustment reason matching search criteria found'}
        onChange={this.handleInventoryAdjustmentReasonSelectChange}
        onSearch={this.inventoryAdjustmentReasonSearchHandler}
        filterOption={false}>
        {inventoryAdjustmentReasons.map((inventoryAdjustmentReason, index) => <Option key={index} value={inventoryAdjustmentReason.id}>{generateLabel(inventoryAdjustmentReason).label}</Option>)}
      </Select>
    );
  }
}

export default InventoryAdjustmentReasonSelect;
