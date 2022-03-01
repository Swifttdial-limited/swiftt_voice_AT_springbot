import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Menu, Dropdown, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchMaintenance from '../../ui/search';

function search({
                  field,
                  keyword,
                  onSearch,

                  form: {
                    getFieldDecorator,
                    validateFields,
                    getFieldsValue,
                  },
                }) {

  const searchAssetMaintenanceProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'code', name: 'Code' },  { value: 'date', name: 'Date' }],
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
        <SearchMaintenance {...searchAssetMaintenanceProps} />
      </Col>
      <Col lg={12} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="">
          {/*<Link to="/fixed-assets-management/asset/new">*/}
            {/*<Button type="primary" icon="plus" style={{ marginRight: 10 }}>New Asset</Button>*/}
          {/*</Link>*/}
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
