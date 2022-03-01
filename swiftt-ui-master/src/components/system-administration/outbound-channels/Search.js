import PropTypes from 'prop-types';
import React from 'react';
import { Button, Row, Col } from 'antd';

import Authorized from '../../../utils/Authorized';

function search({
  onAdd,
}) {

  return (
    <Row gutter={24}>
      <Col lg={{ offset: 18, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_INTEGRATION_CHANNEL">
          <Button type="primary" onClick={onAdd} icon="plus"  style={{ marginRight: 10 }}>New Channel</Button>
        </Authorized>
      </Col>
    </Row>
  );
}

search.propTypes = {
  onAdd: PropTypes.func,
};

export default search;
