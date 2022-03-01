import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../../services/medical-records/appointmentTypes';

const Option = Select.Option;

class AppointmentTypeSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onAppointmentTypeSelect: PropTypes.func.isRequired,
  };

  state = {
    appointmentTypes: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.appointmentTypeSearchHandler = debounce(this.appointmentTypeSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchAppointmentTypes();
  }

  appointmentTypeSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchAppointmentTypes(value);
    }
  }

  fetchAppointmentTypes = (searchQueryParam) => {
    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ appointmentTypes: response.content, loading: false });
    }).catch((e) => {
      this.setState({ appointmentTypes: [], loading: false });
    });;
  }

  handleAppointmentTypeSelectChange = (value, e) => {
    const { multiSelect, onAppointmentTypeSelect } = this.props;

    if (!multiSelect) {
      onAppointmentTypeSelect(this.mapSelectedValueToAppointmentType(value));
    } else {
      onAppointmentTypeSelect(this.mapSelectedValuesToAppointmentType(value));
    }
  }

  mapSelectedValueToAppointmentType = (selectedAppointmentType) => {
    const { appointmentTypes } = this.state;
    return find(appointmentTypes, { id: selectedAppointmentType.key});
  }

  mapSelectedValuesToAppointmentType = (values) => {
    const { appointmentTypes } = this.state;

    const selectedAppointmentTypes = [];
    values.forEach((selectedAppointmentType) => {
      appointmentTypes.forEach((appointmentType) => {
        if(appointmentType.id === selectedAppointmentType.key) {
          selectedAppointmentTypes.push({
            version: appointmentType.version,
            name: selectedAppointmentType.label,
            id: selectedAppointmentType.key
          });
        }
      });
    })

    return selectedAppointmentTypes;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { appointmentTypes, loading } = this.state;

    const generateLabel = (appointmentType) =>
      Object.assign({}, { key: appointmentType.id, label: appointmentType.name });

    const generateAppointmentTypeTokens = (accs) => map(accs, (appointmentType) => {
      return generateLabel(appointmentType);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateAppointmentTypeTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select appointment type(s)' : 'Select appointment type'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No appointment type matching search criteria found'}
        onChange={this.handleAppointmentTypeSelectChange}
        onSearch={this.appointmentTypeSearchHandler}
        filterOption={false}>
        {appointmentTypes.map((appointmentType, index) => <Option key={index} value={appointmentType.id}>{generateLabel(appointmentType).label}</Option>)}
      </Select>
    );
  }
}

export default AppointmentTypeSelect;
