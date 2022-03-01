import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Form, Button, Row, Col } from 'antd';

import SearchJournals from '../../../ui/search';

function search({
  dateFilter,
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
  const searchJournalsProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'reference', name: 'Reference Number' }],
    selectProps: {
      defaultValue: field || 'reference',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={8} md={8} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchJournals {...searchJournalsProps} />
      </Col>
      <Col lg={16} md={16} sm={8} xs={24} style={{ marginBottom: 16 }}>
        <div>
          {dateFilter}
        </div>
        <Link to="/accounts/pettyCash/create">
          <Button type="primary" style={{ marginLeft: 8, float: 'right' }} icon="plus">New Petty Cash</Button>
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
