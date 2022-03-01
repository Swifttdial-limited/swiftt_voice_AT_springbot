import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ wards, loading }) => ({
  wards,
  loading: loading.effects['wards/query'],
}))
class WardSelect extends PureComponent {
  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    wards: PropTypes.object,
    editValue: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    multiSelect: PropTypes.bool.isRequired,
    onWardSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleWardSearch = debounce(this.handleWardSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'wards/query' });
  }

  handleWardSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { wardName: value };
      dispatch({ type: 'wards/query', payload });
    }
  }

  handleWardSelectChange = (value, e) => {
    const { wards, onWardSelect } = this.props;
    const { list } = wards;

    onWardSelect(value ? list[value] : null);
  }

  render() {
    const { wards, editValue, multiSelect } = this.props;
    const { list, loading } = wards;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No ward matching search criteria found'}
        placeholder={multiSelect ? 'Search ward(s)' : 'Search ward'}
        showSearch
        onChange={this.handleWardSelectChange}
        onSearch={this.handleWardSearch}
        filterOption={false}
      >
        {list.map((ward, index) => <Option key={index} value={index.toString()}>{ward.name}</Option>)}
      </Select>
    );
  }
}

export default WardSelect;
