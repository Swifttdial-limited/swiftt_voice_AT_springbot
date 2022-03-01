import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option, OptGroup } = Select;

class RelationshipTypeSelect extends PureComponent {

  static defaultProps = {
    onRelationshipTypeSelect: () => {},
  };

  static propTypes = {
    editValue: PropTypes.string,
    onRelationshipTypeSelect: PropTypes.func.isRequired,
  };

  state = {
    relationshipTypeOptions: {
      common: [
        { value: 'BROTHER', text: 'Brother' },
        { value: 'DAUGHTER', text: 'Daughter' },
        { value: 'FATHER', text: 'Father' },
        { value: 'HUSBAND', text: 'Husband' },
        { value: 'MOTHER', text: 'Mother' },
        { value: 'SISTER', text: 'Sister' },
        { value: 'SON', text: 'Son' },
        { value: 'WIFE', text: 'Wife' },
      ],
      other: [
        { value: 'AUNT', text: 'Aunt' },
        { value: 'GRANDMOTHER', text: 'Grandmother' },
        { value: 'GRANDFATHER', text: 'Grandfather' },
        { value: 'NEPHEW', text: 'Nephew' },
        { value: 'NIECE', text: 'Niece' },
        { value: 'UNCLE', text: 'Uncle' },
      ],
    },
  };

  handleRelationshipTypeSelectChange = (value, e) => {
    const { onRelationshipTypeSelect } = this.props;
    onRelationshipTypeSelect(value);
  }

  render() {
    const { editValue } = this.props;

    const { relationshipTypeOptions } = this.state;

    let selectProps = {};

    if(editValue)
      selectProps.defaultValue = editValue;

    return (
      <Select
        {...selectProps}
        showSearch
        allowClear
        style={{ width: 200 }}
        placeholder="Select a relationship type"
        onChange={this.handleRelationshipTypeSelectChange}>
        <OptGroup label="Common">
          {relationshipTypeOptions.common.map(relationshipType => <Option key={relationshipType.value} value={relationshipType.value}>{relationshipType.text}</Option>)}
        </OptGroup>
        <OptGroup label="Other">
          {relationshipTypeOptions.other.map(relationshipType => <Option key={relationshipType.value} value={relationshipType.value}>{relationshipType.text}</Option>)}
        </OptGroup>
      </Select>
    );
  }
}

export default RelationshipTypeSelect;
