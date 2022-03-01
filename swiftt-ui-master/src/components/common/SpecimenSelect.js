import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class SpecimenSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.specimenSearchHandler = debounce(this.specimenSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'specimens/query' });
  }

  specimenSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'specimens/query', payload: { searchParam: value } }); }
  }

  specimenSelectChangeHandler = (value, e) => {
    const { specimens, onSpecimenSelect } = this.props;
    const { list } = specimens;

    onSpecimenSelect(value ? list[value] : null);
  }

  render() {
    const { specimens, editValue } = this.props;
    const { list, loading } = specimens;

    return (
      <Select
        allowClear
        defaultValue={editValue}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search specimen"
        showSearch
        style={{ width: 300 }}
        onChange={this.specimenSelectChangeHandler}
        onSearch={this.specimenSearchHandler}
        filterOption={false}
      >
        {list.map((specimen, index) => <Option key={index} value={index.toString()}>{specimen.name}</Option>)}
      </Select>
    );
  }
}

SpecimenSelect.propTypes = {
  specimens: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  onSpecimenSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ specimens }) {
  return { specimens };
}

export default connect(mapStateToProps)(SpecimenSelect);
