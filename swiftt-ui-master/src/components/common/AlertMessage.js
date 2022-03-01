import PropTypes from 'prop-types';
import React from 'react';

import { Alert } from 'antd';

function AlertMessage({ title, message }) {
  return (
    <Alert
      message={title || 'Error'}
      description={message || 'Ooops! Something went wrong!'}
      type="error"
      showIcon
    />
  );
}

AlertMessage.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default AlertMessage;
