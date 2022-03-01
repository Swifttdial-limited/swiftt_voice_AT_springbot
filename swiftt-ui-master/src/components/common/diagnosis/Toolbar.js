import PropTypes from 'prop-types';
import React from 'react';
import { routerRedux, Link } from 'dva/router';

import { Button, Row, Col, Icon } from 'antd';

function Toolbar({
  onAdd,
  isPreviousVisit,
}) {

  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button
        disable={isPreviousVisit} 
        type="primary" onClick={onAdd}><Icon type="plus" />Add Diagnoses</Button>
      </Col>
    </Row>
  );
}

Toolbar.propTypes = {
  onAdd: PropTypes.func,
};

export default Toolbar;
