import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class FormulationSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleFormulationSearch = debounce(this.handleFormulationSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_formulations/query' });
  }

  handleFormulationSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'catalogue_formulations/query', payload: { searchQueryParam: value } }); }
  }

  handleFormulationSelectChange = (value, e) => {
    const { catalogue_formulations, onFormulationSelect, multiSelect } = this.props;
    const { list } = catalogue_formulations;

    if (!multiSelect) { onFormulationSelect(list[value]); } else { onFormulationSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { catalogue_formulations } = this.props;
    const { list } = catalogue_formulations;

    const selectedFormulations = [];
    value.forEach((itemIndex) => {
      selectedFormulations.push(list[itemIndex]);
    });

    return selectedFormulations;
  }

  render() {
    const { catalogue_formulations, multiSelect, editValue } = this.props;
    const { list, loading } = catalogue_formulations;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No formulation matching search criteria found'}
        placeholder={multiSelect ? 'Select formulation(s)' : 'Select formulation'}
        showSearch
        onChange={this.handleFormulationSelectChange}
        onSearch={this.handleFormulationSearch}
        filterOption={false}
      >
        {list.map((formulation, index) => <Option key={index} value={index.toString()}>{formulation.formulationName}</Option>)}
      </Select>
    );
  }
}

FormulationSelect.propTypes = {
  catalogue_formulations: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  multiSelect: PropTypes.bool.isRequired,
  onFormulationSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ catalogue_formulations }) {
  return { catalogue_formulations };
}

export default connect(mapStateToProps)(FormulationSelect);
