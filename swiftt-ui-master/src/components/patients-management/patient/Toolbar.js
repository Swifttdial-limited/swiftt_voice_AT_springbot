import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Button, Dropdown, Menu, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';

function Toolbar() {
  const handleMenuClick = (e) => {
    console.log('click', e);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Barcode</Menu.Item>
      <Menu.Item key="2">Patient Profile</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Authorized authority="CREATE_VISIT">
        <Link to="/visit/create">
          <Button type="primary" icon="plus">New Visit</Button>
        </Link>
      </Authorized>
      <Dropdown overlay={menu}>
        <Button type="primary" >Print <Icon type="down" /></Button>
      </Dropdown>
    </div>
  );
}

export default Toolbar;
