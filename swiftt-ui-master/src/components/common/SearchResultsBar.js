import PropTypes from 'prop-types';
import React from 'react';

import { Col, Row } from 'antd';

function SearchResultsBar({ count, type }) {
  return (
    <Row gutter={24}>
      <Col>
        <h2>Search results: {count} {type} records found</h2>
      </Col>
    </Row>
  );
}

SearchResultsBar.propTypes = {
  count: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default SearchResultsBar;
