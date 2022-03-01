import { PropTypes } from 'prop-types';
import React from 'react';
import { Row, Col, Button } from 'antd';

function SummarizedTaskToolbar({
  assignedTo,
  department,
  description,
  dateOfCreation,
  status,
  onClaim,
  onOpen,
  onUnclaim,
}) {
  const taskActions = (
    <div style={{ marginBottom: 10 }}>
      { assignedTo === null
        && <Button type="primary" icon="pushpin-o" onClick={onClaim}>Assign To Me</Button> }
      { assignedTo != null
        && (sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).u_pid ? JSON.parse(sessionStorage.getItem('current_user')).u_pid === assignedTo.publicId : false)
        && status === 'ACTIVE'
        && <Button type="primary" icon="eye" onClick={onOpen} style={{ marginRight: 10 }}>Process Task</Button>}
        { assignedTo != null
          && (sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).u_pid ? JSON.parse(sessionStorage.getItem('current_user')).u_pid === assignedTo.publicId : false)
          && status === 'ACTIVE'
          && <Button type="danger" icon="rollback" onClick={onUnclaim}>Release Task</Button>}
    </div>
  );

  return(
    <div>
      <Row gutter={24}>
        <Col lg={{ offset: 12, span: 12 }} md={12} sm={8} xs={24} style={{ marginBottom: 10, textAlign: 'right' }}>
          {taskActions}
        </Col>
      </Row>
    </div>
  );
}

export default SummarizedTaskToolbar;
