import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ binLocations, loading }) => ({
  binLocations,
  loading: loading.effects['binLocations/query'],
}))
class BinLocationSelect extends PureComponent {

  static defaultProps = {
    disabled: false,
    location: {},
    multiSelect: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    editValue: PropTypes.string,
    location: PropTypes.object,
    binLocations: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    multiSelect: PropTypes.bool.isRequired,
    onBinLocationSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.binLocationSearchHandler = debounce(this.binLocationSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch, location } = this.props;

    let payload = {};

    if(location.id !== undefined)
      payload.location = location.publicId;

    dispatch({ type: 'binLocations/query', payload });
  }

  handleBinLocationSelectChange = (value) => {
    const { binLocations, onBinLocationSelect } = this.props;
    const { list } = binLocations;

    onBinLocationSelect(value ? list[value] : null);
  }

  binLocationSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'binLocations/query', payload });
    }
  }

  render() {
    const { disabled, editValue, binLocations, multiSelect } = this.props;
    const { list, loading } = binLocations;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        disabled={disabled}
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No bin location matching search criteria found'}
        placeholder={multiSelect ? 'Select bin location(s)' : 'Select bin location'}
        showSearch
        onChange={this.handleBinLocationSelectChange}
        onSearch={this.binLocationSearchHandler}
        filterOption={false}
      >
        {list.map((location, index) => <Option key={index} value={index.toString()}>{location.name} </Option>)}
      </Select>
    );
  }
}

export default BinLocationSelect;
