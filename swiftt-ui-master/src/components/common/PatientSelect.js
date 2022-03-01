import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import mapKeys from 'lodash';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ patients, loading }) => ({
  patients,
  loading: loading.effects['patients/query'],
}))
class PatientSelect extends PureComponent {
  
  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    patients: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onPatientSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.patientSearchHandler = debounce(this.patientSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'patients/query' });
  }

  patientSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'patients/query', payload });
    }
  }

  handlePatientSelectChange = (value, e) => {
    const { patients, multiSelect, onPatientSelect } = this.props;
    const { list } = patients;

    if (!multiSelect) { onPatientSelect(value ? list[value] : null); } else { onPatientSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { patients } = this.props;
    const { list } = patients;

    const selectedPatients = [];
    value.forEach((itemIndex) => {
      selectedPatients.push(list[itemIndex]);
    });

    return selectedPatients;
  }

  render() {
    const { patients, editValue, multiSelect } = this.props;
    const { list, loading } = patients;

    const selectProps = {};

    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        style={{ width: 350 }}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No patient matching search criteria found'}
        placeholder={multiSelect ? 'Select patient(s)' : 'Select patient'}
        showSearch
        onChange={this.handlePatientSelectChange}
        onSearch={this.patientSearchHandler}
        filterOption={false}
      >
        {list.map((patient, index) => (
          <Option
            key={index}
            value={index.toString()}
          >
            {patient.user.fullName} ({patient.medicalRecordNumber ? `MRNo. ${patient.medicalRecordNumber}` : `OTCNo. ${patient.overTheCounterNumber}`})
          </Option>
))}
      </Select>
    );
  }
}

export default PatientSelect;
