import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';

const Option = Select.Option;

@connect(({ catalogue_manufacturers }) => ({
  catalogue_manufacturers
}))
class ManufacturerSelect extends PureComponent {

  static propTypes = {
    catalogue_manufacturers: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    onManufacturerSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleManufacturerSearch = debounce(this.handleManufacturerSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_manufacturers/query' });
  }

  handleManufacturerSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'catalogue_manufacturers/query', payload: { searchQueryParam: value } }); }
  }

  handleManufacturerSelectChange = (value, e) => {
    const { catalogue_manufacturers, onManufacturerSelect } = this.props;
    const { list } = catalogue_manufacturers;
    onManufacturerSelect(list[value]);
  }

  render() {
    const { catalogue_manufacturers, editValue } = this.props;
    const { list, loading } = catalogue_manufacturers;

    let selectProps = {};
    if(editValue)
      selectProps.defaultValue = editValue;

    return (
      <Select
        allowClear
        {...selectProps}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search manufacturer"
        showSearch
        style={{ width: 300 }}
        onChange={this.handleManufacturerSelectChange}
        onSearch={this.handleManufacturerSearch}
        filterOption={false}
      >
        {list.map((manufacturer, index) => <Option key={index} value={index.toString()}>{manufacturer.manufacturerName}</Option>)}
      </Select>
    );
  }
}

export default ManufacturerSelect;
