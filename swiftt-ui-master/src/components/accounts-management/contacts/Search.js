import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Icon } from 'antd';

import Authorized from '../../../utils/Authorized';
import SearchContact from '../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onImport,
}) {
  const searchContactProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [
      { value: 'name', name: 'Name' },
      // {value: 'code', name: 'Code'},
      // {value: 'identification', name: 'Identification'}
    ],
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
        <SearchContact {...searchContactProps} />
      </Col>
      <Col lg={{ offset: 4, span: 8 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Authorized authority="CREATE_CONTACT">
          <Link to="/accounts/contact/create" style={{ marginRight: 10 }}>
            <Button type="primary"><Icon type="plus" />New Contact</Button>
          </Link>
        </Authorized>
        <Authorized authority="IMPORT_CONTACTS">
          <Button type="primary" icon="upload" onClick={onImport}>Import Contacts</Button>
        </Authorized>
      </Col>
    </Row>
  );
}

search.defaultProps = {
  onSearch: () => {},
  onImport: () => {},
  field: '',
  keyword: '',
};

search.propTypes = {
  onSearch: PropTypes.func,
  onImport: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default search;
