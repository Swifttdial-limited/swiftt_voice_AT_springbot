import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ taxCodes, loading }) => ({
  taxCodes,
  loading: loading.effects['taxCodes/query'],
}))
class TaxCodeSelect extends PureComponent {

  static defaultProps = {
    disabled: false,
    multiSelect: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    taxCodes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onTaxCodeSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.taxCodeSearchHandler = debounce(this.taxCodeSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'taxCodes/query' });
  }

  handleTaxCodeSelectChange = (value, e) => {
    const { taxCodes, onTaxCodeSelect } = this.props;
    const { list } = taxCodes;

    onTaxCodeSelect(value ? list[value] : null);
  }

  taxCodeSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'taxCodes/query', payload });
    }
  }

  render() {
    const { taxCodes, disabled, editValue, multiSelect } = this.props;
    const { list, loading } = taxCodes;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        disabled={disabled}
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No tax code matching search criteria found'}
        placeholder={multiSelect ? 'Select Tax code(s)' : 'Select Tax code'}
        showSearch
        onChange={this.handleTaxCodeSelectChange}
        onSearch={this.taxCodeSearchHandler}
        filterOption={false}
      >
        {list.map((taxCode, index) => <Option key={index} value={index.toString()}>{taxCode.name} ({taxCode.percentage}%)</Option>)}
      </Select>
    );
  }
}

export default TaxCodeSelect;
