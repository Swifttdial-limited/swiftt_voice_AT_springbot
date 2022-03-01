import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Menu, Dropdown, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../../utils/Authorized';
import SearchProduct from '../../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onImport,
  onProductsBulkUpdate,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) {
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Bulk Account Linking</Menu.Item>
    </Menu>
  );

  function handleMenuClick(e) {
    if (e.key === '1') { onProductsBulkUpdate(); }
    else if(e.key === '2') { onImport(); }
  }

  const searchProductProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'code', name: 'Code' }, { value: 'customProductCode', name: 'Custom Code' }, { value: 'name', name: 'Name' }],
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
        <SearchProduct {...searchProductProps} />
      </Col>
      <Col lg={12} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_PRODUCT">
          <Link to="/catalogue/product/create">
            <Button type="primary" icon="plus" style={{ marginRight: 10 }}>New Product</Button>
          </Link>
        </Authorized>
        <Authorized authority="IMPORT_PRODUCTS">
          <Button type="primary" icon="upload" onClick={onImport} style={{ marginRight: 10 }}>Import Products</Button>
        </Authorized>
        <Dropdown.Button type="primary" overlay={menu}>
          <Icon type="copy" />Other Actions
        </Dropdown.Button>
      </Col>
    </Row>
  );
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  onImport: PropTypes.func,
  onProductsBulkUpdate: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(search);
