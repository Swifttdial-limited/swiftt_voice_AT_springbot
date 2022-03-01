import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import SearchStockTakeList from '../../ui/search';

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
  const searchStockTakeListProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'stockTakeListNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'stockTakeListNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchStockTakeList {...searchStockTakeListProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Link to="/fixed-assets-management/stock-take-list/create">
          <Button type="primary" style={{ marginLeft: 8 }}><Icon type="plus" />New Stock Take List</Button>
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
