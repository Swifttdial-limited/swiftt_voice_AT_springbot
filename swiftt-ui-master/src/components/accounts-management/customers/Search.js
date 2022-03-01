import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'antd';

import SearchCustomer from '../../ui/search';

function search({
  field,
  keyword,
  onSearch,
}) {
  const searchCustomerProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [
      { value: 'name', name: 'Name' },
      // {value: 'code', name: 'Code'},
      // {value: 'identification', name: 'Identification'}
    ],
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
        <SearchCustomer {...searchCustomerProps} />
      </Col>
    </Row>
  );
}

search.defaultProps = {
  onSearch: () => {},
  field: '',
  keyword: '',
};

search.propTypes = {
  onSearch: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default search;
