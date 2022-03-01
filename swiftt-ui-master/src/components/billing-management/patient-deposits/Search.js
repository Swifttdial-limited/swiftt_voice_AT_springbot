import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchPatientDeposit from '../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) {
  const searchPatientDepositProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'patientDepositNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'patientDepositNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchPatientDeposit {...searchPatientDepositProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}></Col>
    </Row>
  );
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(search);
