import PropTypes from 'prop-types';
import React from 'react';
import { Menu, Dropdown, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../../utils/Authorized';

function Toolbar({
  onAdd,
  isPreviousVisit,
}) {

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Referral Medication</Menu.Item>
      <Menu.Item key="2">External Medication</Menu.Item>
    </Menu>
  );

  function handleMenuClick(e) {
    if (e.key === '1') { onAdd('IntraNonDispensable'); } else if (e.key === '2') { onAdd('ExtraDispensable'); }
  }

  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
        <Authorized authority="CREATE_VISIT_MEDICATION">
          <Dropdown.Button
            disabled={isPreviousVisit}
            type="primary"
            onClick={() => onAdd('IntraDispensable')}
            overlay={menu}
            style={{ marginRight: 10 }}>
            <Icon type="plus" />New Medication
          </Dropdown.Button>
        </Authorized>
        <Authorized authority="CREATE_REQUEST_FROM_VISIT_MEDICATION">
        <Button icon="printer" style={{ marginRight: 10 }}>Print</Button>

        </Authorized>
      </Col>
    </Row>
  );
}

Toolbar.propTypes = {
  onAdd: PropTypes.func,
};

export default Toolbar;
