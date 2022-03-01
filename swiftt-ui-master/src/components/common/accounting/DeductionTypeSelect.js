import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ deductionTypes, loading }) => ({
  deductionTypes,
  loading: loading.effects['deductionTypes/query']
}))
class DeductionTypeSelect extends PureComponent {

  static defaultProps = {
    deductionTypes: {},
    multiSelect: false,
    onDeductionTypeSelect: () => {},
  };

  static propTypes = {
    deductionTypes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onDeductionTypeSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.deductionTypeSearchHandler = debounce(this.deductionTypeSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'deductionTypes/query' });
  }

  handleDeductionTypeSelectChange = (value, e) => {
    const { deductionTypes, onDeductionTypeSelect } = this.props;
    const { list } = deductionTypes;

    onDeductionTypeSelect(value ? list[value] : null);
  }

  deductionTypeSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'deductionTypes/query', payload });
    }
  }

  render() {
    const { deductionTypes, editValue, multiSelect } = this.props;
    const { list, loading } = deductionTypes;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No deduction type matching search criteria found'}
        placeholder={multiSelect ? 'Select Deduction type(s)' : 'Select Deduction type'}
        showSearch
        onChange={this.handleDeductionTypeSelectChange}
        onSearch={this.deductionTypeSearchHandler}
        filterOption={false}
      >
        {list.map((deductionType, index) => <Option key={index} value={index.toString()}>{deductionType.name}</Option>)}
      </Select>
    );
  }
}

export default DeductionTypeSelect;
