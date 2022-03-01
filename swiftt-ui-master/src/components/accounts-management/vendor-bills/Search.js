import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchVendorBill from '../../ui/search';

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
  const searchVendorBillProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'vendorBillNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'vendorBillNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchVendorBill {...searchVendorBillProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_VENDOR_BILL">
          <Link to="/accounts/vendors-bills-and-payments/vendor-bill/create">
            <Button type="primary" style={{ marginLeft: 8 }}><Icon type="plus" />New Vendor Bill</Button>
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
