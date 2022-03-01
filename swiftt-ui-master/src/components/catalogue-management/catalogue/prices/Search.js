import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Menu, Dropdown, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../../utils/Authorized';
import SearchProduct from '../../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onBulkAdd,
}) {
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Bulk Price Operations</Menu.Item>
    </Menu>
  );

  function handleMenuClick(e) {
    if (e.key === '1') { onBulkAdd(); }
  }

  const searchProductProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'code', name: 'Code' }, { value: 'name', name: 'Name' }],
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
      <Col lg={{ offset: 4, span: 8 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_PRICE">
          <Link to="/catalogue/price/create">
            <Button type="primary" icon="plus" style={{ marginRight: 10 }}>New Price</Button>
          </Link>
        </Authorized>
        <Dropdown.Button type="primary" overlay={menu}>
          <Icon type="copy" />Other Actions
        </Dropdown.Button>
      </Col>
    </Row>
  );
}

search.defaultProps = {
  onSearch: () => {},
  onBulkAdd: () => {},
  field: '',
  keyword: '',
};

search.propTypes = {
  onSearch: PropTypes.func,
  onBulkAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default search;
