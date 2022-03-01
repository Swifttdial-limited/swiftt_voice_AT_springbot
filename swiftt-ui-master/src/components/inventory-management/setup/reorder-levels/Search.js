import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col } from 'antd';

import Authorized from '../../../../utils/Authorized';
import SearchReorderLevel from '../../../ui/search';

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
  const searchReorderLevelProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'item', name: 'Item' }],
    selectProps: {
      defaultValue: field || 'item',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchReorderLevel {...searchReorderLevelProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_REORDER_LEVEL">
          <Button type="primary" onClick={onAdd} icon="plus">New Reorder Level</Button>
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
