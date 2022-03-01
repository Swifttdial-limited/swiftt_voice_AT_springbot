import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import MedicationsView from '../../../../../common/medication';

class MedicationsStep extends PureComponent {

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
        <MedicationsView encounter={encounter} />
      </div>
    );
  }

}

export default MedicationsStep;
