import PropTypes from 'prop-types';
import React from 'react';
import { CompactPicker } from 'react-color';

function CustomColorPicker({
  onColorSelect,
}) {
  function handler(color) {
    onColorSelect(color.hex);
  }

  return <CompactPicker onChangeComplete={handler} />;
}

CustomColorPicker.propTypes = {
  onColorSelect: PropTypes.func.isRequired,
};

export default CustomColorPicker;
