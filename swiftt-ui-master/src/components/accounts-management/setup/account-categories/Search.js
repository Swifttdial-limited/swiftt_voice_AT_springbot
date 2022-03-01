import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../../utils/Authorized';
import SearchAccountCategory from '../../../ui/search';

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
  const searchAccountCategoryProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'accountNumber', name: 'Number' }, { value: 'name', name: 'Name' }],
    selectProps: {
      defaultValue: field || 'accountNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchAccountCategory {...searchAccountCategoryProps} />
      </Col>
      <Col lg={{ offset: 4, span: 8 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_ACCOUNT">
          <Button type="primary" icon="plus" onClick={onAdd}>New Account Category</Button>
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
