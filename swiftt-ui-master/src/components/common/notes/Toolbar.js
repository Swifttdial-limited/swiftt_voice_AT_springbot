import PropTypes from 'prop-types';
import React from 'react';
import { Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';

function Toolbar({
  onAdd,
  isPreviousVisit,
}) {
  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
        <Authorized authority="CREATE_VISIT_NOTE">
          <Button
            disabled={isPreviousVisit}
            type="primary" onClick={onAdd}><Icon type="plus" />Compose Note</Button>
        </Authorized>
      </Col>
    </Row>
  );
}

Toolbar.propTypes = {
  onAdd: PropTypes.func,
};

export default Toolbar;
