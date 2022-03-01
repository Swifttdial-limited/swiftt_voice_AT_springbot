import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ units_of_measure, loading }) => ({
  units_of_measure,
  loading: loading.effects['units_of_measure/query'],
}))
class UnitOfMeasureSelect extends PureComponent {

  static defaultProps = {
    autoLoad: true,
    disabled: false,
    multiSelect: false,
    onUnitOfMeasureSelect: () => {},
  };

  static propTypes = {
    multiSelect: PropTypes.bool.isRequired,
    units_of_measure: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    autoLoad: PropTypes.bool,
    editValue: PropTypes.string,
    onUnitOfMeasureSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleUnitOfMeasureSearch = debounce(this.handleUnitOfMeasureSearch, 1000);
  }

  componentDidMount() {
    const { autoLoad, dispatch } = this.props;

    if (autoLoad) { dispatch({ type: 'units_of_measure/query' }); }
  }

  handleUnitOfMeasureSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { searchQueryParam: value };

      dispatch({ type: 'units_of_measure/query', payload });
    }
  }

  handleUnitOfMeasureSelectChange = (value, e) => {
    const { units_of_measure, onUnitOfMeasureSelect } = this.props;
    const { list } = units_of_measure;

    onUnitOfMeasureSelect(value ? list[value] : null);
  }

  render() {
    const { disabled, editValue, multiSelect, units_of_measure } = this.props;
    const { list, loading } = units_of_measure;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        {...selectProps}
        allowClear
        disabled={disabled}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={multiSelect ? 'Select unit(s) of measure' : 'Select unit of measure'}
        showSearch
        onChange={this.handleUnitOfMeasureSelectChange}
        onSearch={this.handleUnitOfMeasureSearch}
        filterOption={false}
      >
        {list.map((unitOfMeasure, index) => <Option key={index} value={index.toString()}>{unitOfMeasure.name}</Option>)}
      </Select>
    );
  }
}

export default UnitOfMeasureSelect;
