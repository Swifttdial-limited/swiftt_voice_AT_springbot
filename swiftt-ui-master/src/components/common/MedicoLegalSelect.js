import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class MedicoLegalSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.medicoLegalSearchHandler = debounce(this.medicoLegalSearchHandler, 1000);
  }

    medicoLegalSearchHandler = (value) => {
      const { dispatch } = this.props;

      if (value.length > 2) { dispatch({ type: 'medicoLegals/query', payload: { searchParam: value } }); }
    }

    medicoLegalSelectChangeHandler = (value, e) => {
      const { medicoLegals, onMedicoLegalSelect } = this.props;
      const { list } = medicoLegals;

      onMedicoLegalSelect(value ? list[value] : null);
    }

    render() {
      const { medicoLegals, editValue } = this.props;
      const { list, loading } = medicoLegals;

      return (
        <Select
          allowClear
          defaultValue={editValue}
          notFoundContent={loading ? <Spin size="small" /> : null}
          placeholder="Search medicoLegal"
          showSearch
          style={{ width: 300 }}
          onChange={this.medicoLegalSelectChangeHandler}
          onSearch={this.medicoLegalSearchHandler}
          filterOption={false}
        >
          {list.map((medicoLegal, index) => <Option key={index} value={index.toString()}>{medicoLegal.name}</Option>)}
        </Select>
      );
    }
}

MedicoLegalSelect.propTypes = {
  medicoLegals: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  onMedicoLegalSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ medicoLegals }) {
  return { medicoLegals };
}

export default connect(mapStateToProps)(MedicoLegalSelect);
