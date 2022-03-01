import PropTypes from 'prop-types';
import React from 'react';
import { Button, Row, Col } from 'antd';

import Authorized from '../../../../utils/Authorized';

function Toolbar({
  onAdd,
  isPreviousVisit,
}) {
  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
        <Authorized authority="CREATE_VISIT_MEDICAL_SUPPLY">
          <Button
            disabled={isPreviousVisit}
            type="primary"
            onClick={onAdd} icon="plus">New Medical Supply</Button>
        </Authorized>
      </Col>
    </Row>
  );
}

Toolbar.defaultProps = {
  onAdd: () => {},
};

Toolbar.propTypes = {
  onAdd: PropTypes.func,
};

export default Toolbar;
