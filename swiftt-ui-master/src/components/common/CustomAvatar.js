import PropTypes from 'prop-types';
import React from 'react';

import { Avatar } from 'antd';

function CustomAvatar({ color, characters }) {
  return (<Avatar style={{ backgroundColor: color }} size="large">{characters}</Avatar>);
}

CustomAvatar.propTypes = {
  color: PropTypes.string.isRequired,
  characters: PropTypes.string.isRequired,
};

export default CustomAvatar;
