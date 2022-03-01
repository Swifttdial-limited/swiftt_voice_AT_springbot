import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';

const Option = Select.Option;

class RegionSelect extends PureComponent {
  
  constructor(props) {
    super(props);
    this.handleRegionSearch = debounce(this.handleRegionSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'regions/query' });
  }

  handleRegionSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'regions/query', payload: { searchQueryParam: value } }); }
  }

  handleRegionSelectChange = (value, e) => {
    const { regions, onRegionSelect } = this.props;
    const { list } = regions;
    onRegionSelect(list[value]);
  }

  render() {
    const { regions } = this.props;
    const { list, loading } = regions;

    return (
      <Select
        allowClear
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search region"
        showSearch
        style={{ width: 300 }}
        onChange={this.handleRegionSelectChange}
        onSearch={this.handleRegionSearch}
        filterOption={false}
      >
        {list.map((region, index) => <Option key={index} value={index.toString()}>{region.name}</Option>)}
      </Select>
    );
  }
}

RegionSelect.propTypes = {
  regions: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  onRegionSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ regions }) {
  return { regions };
}

export default connect(mapStateToProps)(RegionSelect);
