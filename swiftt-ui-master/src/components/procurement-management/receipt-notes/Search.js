import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import SearchReceiptNote from '../../ui/search';

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
  const searchReceiptNoteProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'purchaseInvoiceReference', name: 'Purchase Inv.' }, { value: 'receiptNoteNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'receiptNoteNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchReceiptNote {...searchReceiptNoteProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Link to="/procurement/receipt-note/create">
          <Button type="primary" style={{ marginLeft: 8 }}><Icon type="plus" />New Receipt Note</Button>
        </Link>
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
