import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import RequestsView from '../../../../../common/requests/medication';

class RequestsStep extends PureComponent {

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
        <RequestsView encounter={encounter} />
      </div>
    );
  }

}

export default RequestsStep;
