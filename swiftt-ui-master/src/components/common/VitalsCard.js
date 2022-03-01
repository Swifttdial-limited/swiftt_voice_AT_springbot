import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { Card } from 'antd';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

function VitalsCard({ data }) {
  const vitalsTimeTaken =
    data.creationTime
      ? `Time taken: ${moment(data.creationTime).format(dateTimeFormat)}(${moment(moment(data.creationTime).format(ageDateFormat)).fromNow(true)} ago)`
      : 'Time taken: Not Specified';

  return (
    <Card
      title={vitalsTimeTaken}

    >
      <p>Height (cm) 250cm</p>
      <p>Weight (kg) 83kg</p>
      <p>(Calculated) BMI 13.3 </p>
      <p>Temperature (C) ____°C</p>
      <p>Pulse ____/min</p>
      <p>Respiratory rate ____/min</p>
      <p>Blood Pressure ____  /  ____</p>
      <p>Blood oxygen saturation </p>
    </Card>
  );
}

VitalsCard.defaultProps = {
  data: {},
};

VitalsCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default VitalsCard;
