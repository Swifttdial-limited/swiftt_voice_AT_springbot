import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ depreciationMethods, loading }) => ({
  depreciationMethods,
  loading: loading.effects['fixed-assets/depreciationMethods/query'],
}))

class DepreciationMethodSelect extends PureComponent {

  static defaultProps = {
    disabled: false,
    multiSelect: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    depreciationMethods: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onDepreciationMethodSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.depreciationMethodSearchHandler = debounce(this.depreciationMethodSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed-assets/depreciationMethods/query' });
  }

  handleDepreciationMethodSelectChange = (value, e) => {
    const { depreciationMethods, onDepreciationMethodSelect } = this.props;
    const { list } = depreciationMethods;

    onDepreciationMethodSelect(value ? list[value] : null);
  }

  depreciationMethodSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'fixed-assets/depreciationMethods/query', payload });
    }
  }

  render() {
    const { depreciationMethods, disabled, editValue, multiSelect } = this.props;
    const { list, loading } = depreciationMethods;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        disabled={disabled}
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No depreciation method matching search criteria found'}
        placeholder={multiSelect ? 'Select depreciation method(s)' : 'Select depreciation method'}
        showSearch
        //onChange={this.handleDepreciationMethodSelectChange}
        //onSearch={this.depreciationMethodSearchHandler}
        filterOption={false}
      >
        {/*{list.map((depreciationMethod, index) => <Option key={index} value={index.toString()}>{depreciationMethod.name} ({depreciationMethod.percentage}%)</Option>)}*/}
      </Select>
    );
  }
}

export default DepreciationMethodSelect;
