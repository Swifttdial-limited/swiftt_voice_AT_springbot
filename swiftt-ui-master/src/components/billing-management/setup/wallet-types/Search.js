import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Icon } from 'antd';

import SearchWalletType from '../../../ui/search';

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
  const searchWalletTypeProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'name', name: 'Name' }],
    selectProps: {
      defaultValue: field || 'name',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchWalletType {...searchWalletTypeProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={onAdd}><Icon type="plus" />New Wallet Type</Button>
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
