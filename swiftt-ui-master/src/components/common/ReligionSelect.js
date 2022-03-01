import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';

const Option = Select.Option;

class ReligionSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleReligionSearch = debounce(this.handleReligionSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'religions/query' });
  }

  handleReligionSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'religions/query', payload: { searchQueryParam: value } }); }
  }

  handleReligionSelectChange = (value, e) => {
    const { religions, onReligionSelect } = this.props;
    const { list } = religions;
    onReligionSelect(list[value]);
  }

  render() {
    const { religions } = this.props;
    const { list, loading } = religions;

    return (
      <Select
        allowClear
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search religion"
        showSearch
        style={{ width: 300 }}
        onChange={this.handleReligionSelectChange}
        onSearch={this.handleReligionSearch}
        filterOption={false}
      >
        {list.map((religion, index) => <Option key={index} value={index.toString()}>{religion.name}</Option>)}
      </Select>
    );
  }
}

ReligionSelect.propTypes = {
  religions: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  onReligionSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ religions }) {
  return { religions };
}

export default connect(mapStateToProps)(ReligionSelect);
