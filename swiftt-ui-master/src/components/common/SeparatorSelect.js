import PropTypes from 'prop-types';
import React from 'react';

import { Select } from 'antd';

const { Option, OptGroup } = Select;

function SeparatorSelect({
  editValue,
  onSeparatorSelect,
}) {
  function handleSeparatorSelectChange(value) {
    onSeparatorSelect(value);
  }

  return (
    <Select
      allowClear
      defaultValue={editValue}
      style={{ width: 200 }}
      placeholder="Select a separator"
      onChange={handleSeparatorSelectChange}
    >
      <Option value="/">Forward Slash (/)</Option>
      <Option value=",">Back Slash (\)</Option>
      <Option value="-">Hyphen (-)</Option>
      <Option value=".">FullStop / Period (.)</Option>
    </Select>
  );
}

SeparatorSelect.propTypes = {
  editValue: PropTypes.string,
  onSeparatorSelect: PropTypes.func.isRequired,
};

export default SeparatorSelect;
