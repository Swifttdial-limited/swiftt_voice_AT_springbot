import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import AppointmentsView from '../../../../../common/appointments';

class AppointmentsStep extends PureComponent {

  static defaultProps = {
    encounter: {},
  };

  static propTypes = {
    encounter: PropTypes.object.isRequired,
  };

  render() {
    const { encounter } = this.props;

    return (
      <div style={{ padding: 20 }}>
        <AppointmentsView visitProfile={encounter} />
      </div>
    );
  }

}

export default AppointmentsStep;
