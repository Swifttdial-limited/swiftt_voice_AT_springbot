import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class ArrivalMeansSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.arrivalMeanSearchHandler = debounce(this.arrivalMeanSearchHandler, 1000);
  }

    arrivalMeanSearchHandler = (value) => {
      const { dispatch } = this.props;

      if (value.length > 2) { dispatch({ type: 'arrivalMeans/query', payload: { searchParam: value } }); }
    }

    arrivalMeanSelectChangeHandler = (value, e) => {
      const { arrivalMeans, onArrivalMeansSelect } = this.props;
      const { list } = arrivalMeans;

      onArrivalMeansSelect(value ? list[value] : null);
    }

    handleBlur = () => {}

    render() {
      const { arrivalMeans, editValue } = this.props;
      const { list, loading } = arrivalMeans;

      return (
        <Select
          allowClear
          defaultValue={editValue}
          notFoundContent={loading ? <Spin size="small" /> : null}
          placeholder="Search arrivalMeans"
          showSearch
          style={{ width: 300 }}
          onChange={this.arrivalMeanSelectChangeHandler}
          onSearch={this.arrivalMeanSearchHandler}
          filterOption={false}
        >
          {list.map((arrivalMean, index) => <Option key={index} value={index.toString()}>{arrivalMean.name}</Option>)}
        </Select>
      );
    }
}

ArrivalMeansSelect.propTypes = {
  arrivalMeans: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  onArrivalMeansSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ arrivalMeans }) {
  return { arrivalMeans };
}

export default connect(mapStateToProps)(ArrivalMeansSelect);
