import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Select } from 'antd';

const Option = Select.Option;

// Many clinics utilize the SOAP format for outpatient notes:
// SUBJECTIVE means only what the patient tells you (e.g., symptoms, attributions, etc.) or what you know to have occurred in the past (e.g., a medication change you made based on a telephone conversation with the patient). Results of consults can be placed here or in the objective section. Do not indicate impressions or results of your physical exam in the subjective section.
// OBJECTIVE includes results of physical examination and interval test data.
// ASSESSMENT includes your interpretation of information in the previous two sections.
// PLAN includes what you are going to do about your impressions. Many physicians dictate/write the assessment and the plan together for each individual problem (as in the examples provided).

class NoteTypeSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { name: 'Assessment', value: 'ASSESSMENT' },
        { name: 'Objective', value: 'OBJECTIVE' },
        { name: 'Open', value: 'OPEN' },
        { name: 'Plan', value: 'PLAN' },
        { name: 'Subjective', value: 'SUBJECTIVE' },
      ],
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleAccountSelectChange = value => this.props.onNoteTypeSelect(value);

  render() {
    const { multiSelect, onNoteTypeSelect } = this.props;

    const { options } = this.state;

    return (
      <Select
        allowClear
        mode={multiSelect ? 'multiple' : ''}
        placeholder={multiSelect ? 'Select note type(s)' : 'Select note type'}
        style={{ width: 300 }}
        onChange={this.handleAccountSelectChange}
      >
        {options.map((option, index) => <Option key={index} value={option.value}>{option.name}</Option>)}
      </Select>
    );
  }
}

NoteTypeSelect.defaultProps = {
  multiSelect: false,
};

NoteTypeSelect.propTypes = {
  multiSelect: PropTypes.bool.isRequired,
  onNoteTypeSelect: PropTypes.func.isRequired,
};

export default NoteTypeSelect;
