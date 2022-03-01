import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col } from 'antd';

import Authorized from '../../../../utils/Authorized';
import SearchGoodsReturnReason from '../../../ui/search';

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
  const searchGoodsReturnReasonProps = {
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
        <SearchGoodsReturnReason {...searchGoodsReturnReasonProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_GOODS_RETURN_REASON">
          <Button type="primary" onClick={onAdd} icon="plus">New Goods Return Reason</Button>
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
