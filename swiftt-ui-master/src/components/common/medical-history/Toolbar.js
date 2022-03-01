import PropTypes from 'prop-types';
import React from 'react';
import { routerRedux, Link } from 'dva/router';
import Authorized from '../../../utils/Authorized';

import { Button, Row, Col, Icon } from 'antd';

function Toolbar({
  onAdd,
}) {
  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
        <Authorized authority="CREATE_PATIENT_MEDICAL_HISTORY">
          <Button type="primary" onClick={onAdd}><Icon type="plus" />New Entry</Button>
        </Authorized>
      </Col>
    </Row>
  );
}

Toolbar.propTypes = {
  onAdd: PropTypes.func,
};

export default Toolbar;
