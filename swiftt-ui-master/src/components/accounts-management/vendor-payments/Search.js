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
    selectOptions: [{ value: 'vendorPaymentNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'vendorPaymentNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchRequisition {...searchRequisitionProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_VENDOR_PAYMENT">
          <Link to="/accounts/vendors-bills-and-payments/vendor-payment/create">
            <Button type="primary" style={{ marginLeft: 8 }} icon="plus">New Payment</Button>
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
