import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchRequisition from '../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) {
  const searchRequisitionProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'customerPaymentNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'customerPaymentNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={6} md={6} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchRequisition {...searchRequisitionProps} />
      </Col>
      <Col style={{ textAlign: 'right' }}>
        <Authorized authority="CREATE_CUSTOMER_PAYMENT">
          <Link to="/accounts/customers-and-payments/customer-payment-schedule/create">
            <Button type="primary" style={{ marginLeft: 8 }}><Icon type="link" /> Schedule</Button>
          </Link>
        </Authorized>
        <Authorized authority="CREATE_CUSTOMER_PAYMENT">
          <Link to="/accounts/customers-and-payments/customer-payment/create">
            <Button type="danger" style={{ marginLeft: 8 }}><Icon type="book" /> Allocation</Button>
          </Link>
        </Authorized>
      </Col>
    </Row>
  );
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(search);
