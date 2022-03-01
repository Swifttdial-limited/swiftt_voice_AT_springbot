import { PropTypes } from 'prop-types';
import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'dva/router';

import Authorized from '../../../utils/Authorized';

function AppointmentToolbar({
  appointment,
  onClaim,
  onConfirmation,
  onEdit,
  onStart,
  onLinkToVisitAndStart,
  onComplete,
  onCancelled,
  onMissed,
  onReschedule,
}) {
  // { (appointment.status === 'WAITING' || appointment.status === 'SCHEDULED'
  //   || appointment.status === 'RESCHEDULED') && (
  //   <Button
  //     icon="clock-circle-o"
  //     style={{ marginLeft: 5 }}
  //     onClick={onReschedule}>Reschedule Appointment</Button>
  // )}
  const appointmentActions = (
    <div style={{ marginBottom: 10 }}>
      { appointment.visit && (
        <Authorized authority="READ_VISITS">
          <Link to={`/visit/view/${appointment.visit.id}`}>
            <Button type="primary" icon="link">Go to Visit</Button>
          </Link>
        </Authorized>
      )}

      { (appointment.status === 'SCHEDULED_AND_NEEDS_CONFIRMATION')
        && (
          <Button
            type="primary"
            icon="check-circle"
            style={{ marginLeft: 5 }}
            onClick={onConfirmation}>Confirm Appointment</Button>)}

      { (appointment.status === 'SCHEDULED' || appointment.status === 'RESCHEDULED')
        && (
          <div>
            <Button
              type="primary"
              icon="edit"
              style={{ marginRight: 10 }}
              onClick={onEdit}>Edit</Button>
            <Button
              type="primary"
              icon="pushpin-o"
              style={{ marginLeft: 5 }}
              onClick={onClaim}>Assign To Me</Button>
          </div>)}

      { (appointment.status === 'WAITING' && appointment.visit != null) && (
        <Button
          icon="play-circle-o"
          style={{ marginLeft: 5 }}
          onClick={onStart}>Start Appointment</Button>
      )}

      { (appointment.status === 'WAITING' && appointment.visit == null) && (
        <Button
          icon="play-circle-o"
          style={{ marginLeft: 5 }}
          onClick={onLinkToVisitAndStart}>Start Appointment</Button>
      )}

      { appointment.status === 'ON_GOING' && (
        <Button
          icon="check-circle-o"
          style={{ marginLeft: 5 }}
          onClick={onComplete}>Complete Appointment</Button>
      )}

      { appointment.status === 'WAITING'
        && (
          <Button
            type="danger"
            icon="close-circle-o"
            style={{ marginLeft: 5 }}
            onClick={onCancelled}>Mark As Canceled</Button>)}

      { appointment.status === 'WAITING'
        && (
          <Button
            type="danger"
            icon="exclamation-circle-o"
            style={{ marginLeft: 5 }}
            onClick={onMissed}>Mark As Missed</Button>)}
    </div>
  );

  return(
    <Row gutter={24}>
      <Col style={{ marginBottom: 10, textAlign: 'right', }}>
        {appointmentActions}
      </Col>
    </Row>
  );
}

export default AppointmentToolbar;
