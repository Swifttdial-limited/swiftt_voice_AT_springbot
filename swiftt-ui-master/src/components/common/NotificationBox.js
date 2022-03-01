import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

// import {notification} from 'antd';

function NotificationBox({
  message, title, type,
}) {
  return (
    <p>Notification box</p>
    // notification[type]({
    //   message: 'Notification Title',
    //   description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    //   duration: 0
    // });
  );
}

NotificationBox.defaultProps = {
  message: '',
  title: '',
  type: 'info',
};

NotificationBox.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default NotificationBox;
