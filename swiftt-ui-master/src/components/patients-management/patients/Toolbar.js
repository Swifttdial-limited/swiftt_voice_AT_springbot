import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Button, Row, Col } from 'antd';

import Authorized from '../../../utils/Authorized';

function Toolbar({
  onImport,
}) {
  return (
    <div>
      <Authorized authority="CREATE_PATIENT">
        <Link to="/patient/create">
          <Button type="primary" icon="plus" style={{ marginRight: 10 }}>New Registration</Button>
        </Link>
      </Authorized>
      <Authorized authority="IMPORT_PATIENTS">
        <Button type="primary" icon="upload" onClick={onImport}>Import Patients</Button>
      </Authorized>
    </div>
  );
}

export default Toolbar;
