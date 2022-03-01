import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;

class MedicalHistoryEntrySelect extends PureComponent {

  handleMedicalHistoryEntrySelectChange = (value) => {
    const { onMedicalHistoryEntrySelect } = this.props;

    onMedicalHistoryEntrySelect(value);
  }

  render() {
    const { editValue } = this.props;

    let selectProps = {};
    if(editValue)
      selectProps.defaultValue = editValue;

    return (
      <Select
        allowClear
        {...selectProps}
        placeholder="Select entry type"
        onChange={this.handleMedicalHistoryEntrySelectChange}>
        <Option value="ALLERGY">Allergy</Option>
        <Option value="CHRONIC_CONDITION">Chronic Condition</Option>
      </Select>
    );
  }
}

MedicalHistoryEntrySelect.propTypes = {
  onMedicalHistoryEntrySelect: PropTypes.func.isRequired,
};

export default MedicalHistoryEntrySelect;
