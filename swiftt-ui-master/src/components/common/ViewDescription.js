import PropTypes from 'prop-types';
import React from 'react';

import { Row, Col, Alert } from 'antd';

function ViewDescription({
  icon,
  message,
}) {
  return (
    <Alert
      message="Informational Notes"
      description="Additional description and informations about copywriting."
      type="info"
      showIcon
    />
  );
}

ViewDescription.propTypes = {
  icon: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ViewDescription;
