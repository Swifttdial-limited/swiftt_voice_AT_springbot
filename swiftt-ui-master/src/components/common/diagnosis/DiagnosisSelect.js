import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';

const Option = Select.Option;

class DiagnosisSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    diagnoses: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    multiSelect: PropTypes.bool.isRequired,
    onDiagnosisSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleDiagnosisSearch = debounce(this.handleDiagnosisSearch, 1000);
  }

  handleDiagnosisSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'diagnoses/query', payload: { searchQueryParam: value } }); }
  }

  handleDiagnosisSelectChange = (value, e) => {
    const { diagnoses, multiSelect, onDiagnosisSelect } = this.props;
    const { list } = diagnoses;

    if (!multiSelect) { onDiagnosisSelect(list[value]); } else { onDiagnosisSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { diagnoses } = this.props;
    const { list } = diagnoses;

    const selectedDiagnoses = [];
    value.forEach((itemIndex) => {
      selectedDiagnoses.push(list[itemIndex]);
    });

    return selectedDiagnoses;
  }

  render() {
    const { multiSelect, diagnoses } = this.props;
    const { list, loading } = diagnoses;

    return (
      <Select
        allowClear
        placeholder={multiSelect ? 'Select diagnoses' : 'Select diagnosis'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : null}
        onChange={this.handleDiagnosisSelectChange}
        onSearch={this.handleDiagnosisSearch}
        filterOption={false}
      >
        {list.map((diagnosis, index) => <Option key={index} value={index.toString()}>{diagnosis.description} ({diagnosis.code})</Option>)}
      </Select>
    );
  }
}

function mapStateToProps({ diagnoses }) {
  return { diagnoses };
}

export default connect(mapStateToProps)(DiagnosisSelect);
