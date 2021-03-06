import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Icon } from 'antd';

import SearchIdentificationType from '../../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onAdd,
}) {
  const searchIdentificationTypeProps = {
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
        <SearchIdentificationType {...searchIdentificationTypeProps} />
      </Col>
      <Col lg={{ offset: 4, span: 8 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={onAdd}><Icon type="plus" />New Identification Type</Button>
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
