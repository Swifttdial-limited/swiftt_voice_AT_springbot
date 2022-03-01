import PropTypes from 'prop-types';
import React from 'react';
import { routerRedux, Link } from 'dva/router';

import { Button, Row, Col, Icon } from 'antd';


function Toolbar({
  onAdd,
}) {
  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button type="primary" onClick={onAdd}><Icon type="plus" />New Guardian</Button>
      </Col>
    </Row>
  );
}

Toolbar.propTypes = {
  onAdd: PropTypes.func,
};

export default Toolbar;
