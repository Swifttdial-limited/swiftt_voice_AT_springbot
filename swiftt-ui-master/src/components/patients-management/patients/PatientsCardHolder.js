import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import moment from 'moment';
import { Card, List, Col, Row } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PatientCard from './PatientCard';

const dateFormat = 'YYYY-MM-DD';

function PatientsCardHolder({
  loading,
  dataSource,
}) {
  return (
    <List
      rowKey="id"
      style={{ marginTop: 24 }}
      grid={{ gutter: 24, column: 3, size: 'small' }}
      loading={loading}
      dataSource={dataSource}
      renderItem={item => (
        <List.Item>
          <PatientCard patient={item} />
        </List.Item>
      )}
    />
  );
}

PatientsCardHolder.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default PatientsCardHolder;
