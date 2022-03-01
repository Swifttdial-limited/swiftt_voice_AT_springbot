import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchGroup from '../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onAdd,
  onImport,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'username', name: 'Username' }, { value: 'name', name: 'Name' }],
    selectProps: {
      defaultValue: field || 'username',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchGroup {...searchGroupProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_USER">
          <Button type="primary" onClick={onAdd} icon="plus"  style={{ marginRight: 10 }}>New User</Button>
        </Authorized>
        <Authorized authority="IMPORT_USERS">
          <Button type="primary" icon="upload" onClick={onImport}>Import Users</Button>
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
