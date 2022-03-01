import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchInventoryAdjustment from '../../ui/search';

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
  const searchInventoryAdjustmentProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'inventoryAdjustmentNumber', name: 'Number' }],
    selectProps: {
      defaultValue: field || 'inventoryAdjustmentNumber',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchInventoryAdjustment {...searchInventoryAdjustmentProps} />
      </Col>
      <Col lg={{ offset: 6, span: 6 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_INVENTORY_ADJUSTMENT">
          <Link to="/inventory/inventory-adjustment/create">
            <Button type="primary" style={{ marginLeft: 8 }} icon="plus">New Inventory Adjustment</Button>
          </Link>
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
