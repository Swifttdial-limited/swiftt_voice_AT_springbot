import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Icon } from 'antd';

import SearchHandOverReason from '../../../ui/search';

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
  const searchHandOverReasonProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'code', name: 'Code' }],
    selectProps: {
      defaultValue: field || 'code',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchHandOverReason {...searchHandOverReasonProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={onAdd}><Icon type="plus" />New Handover reason</Button>
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
