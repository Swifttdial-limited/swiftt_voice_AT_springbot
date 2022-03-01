import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/diagnosisVersions';

const Option = Select.Option;

class DiagnosisVersionSelect extends PureComponent {

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
    onDiagnosisVersionSelect: PropTypes.func.isRequired,
  };

  state = {
    diagnosisVersions: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.diagnosisVersionSearchHandler = debounce(this.diagnosisVersionSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchPreferredDiagnosisVersions();
  }

  diagnosisVersionSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchPreferredDiagnosisVersions(value);
    }
  }

  fetchPreferredDiagnosisVersions = (searchQueryParam) => {
    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ diagnosisVersions: response.content, loading: false });
    }).catch((e) => {
      this.setState({ diagnosisVersions: [], loading: false });
    });;
  }

  handleDiagnosisVersionSelectChange = (value, e) => {
    const { multiSelect, onDiagnosisVersionSelect } = this.props;

    if (!multiSelect) {
      onDiagnosisVersionSelect(this.mapSelectedValueToPreferredDiagnosisVersion(value));
    } else {
      onDiagnosisVersionSelect(this.mapSelectedValuesToPreferredDiagnosisVersion(value));
    }
  }

  mapSelectedValueToPreferredDiagnosisVersion = (selectedPreferredDiagnosisVersion) => {
    const { diagnosisVersions } = this.state;
    return find(diagnosisVersions, { id: selectedPreferredDiagnosisVersion.key});
  }

  mapSelectedValuesToPreferredDiagnosisVersion = (values) => {
    const { diagnosisVersions } = this.state;

    const selectedPreferredDiagnosisVersions = [];
    values.forEach((selectedPreferredDiagnosisVersion) => {
      selectedPreferredDiagnosisVersions.push({ name: selectedPreferredDiagnosisVersion.label, id: selectedPreferredDiagnosisVersion.key });
    })

    return selectedPreferredDiagnosisVersions;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { diagnosisVersions, loading } = this.state;

    const generateLabel = (diagnosisVersion) =>
      Object.assign({}, { key: diagnosisVersion.id, label: diagnosisVersion.name });

    const generatePreferredDiagnosisVersionTokens = (accs) => map(accs, (diagnosisVersion) => {
      return generateLabel(diagnosisVersion);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generatePreferredDiagnosisVersionTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select diagnosis version(s)' : 'Select diagnosis version'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No diagnosis version matching search criteria found'}
        onChange={this.handleDiagnosisVersionSelectChange}
        onSearch={this.diagnosisVersionSearchHandler}
        filterOption={false}>
        {diagnosisVersions.map((diagnosisVersion, index) => <Option key={index} value={diagnosisVersion.id}>{generateLabel(diagnosisVersion).label}</Option>)}
      </Select>
    );
  }
}

export default DiagnosisVersionSelect;
