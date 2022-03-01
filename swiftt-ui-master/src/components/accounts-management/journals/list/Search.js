import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Form, Button, Row, Col } from 'antd';

import Authorized from '../../../../utils/Authorized';
import SearchJournals from '../../../ui/search';

function search({
  dateFilter,
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
  const searchJournalsProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'reference', name: 'Reference Number' }],
    selectProps: {
      defaultValue: field || 'reference',
    },
    onSearch: (value) => {
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col lg={6} md={8} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchJournals {...searchJournalsProps} />
      </Col>
      <Col lg={18} md={16} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        {dateFilter}
        <Authorized authority="CREATE_MANUAL_JOURNAL_ENTRY">
          <Link to="/accounts/journal/create">
            <Button type="primary" style={{ marginRight: 10 }} icon="plus">New Entry</Button>
          </Link>
        </Authorized>
        <Authorized authority="IMPORT_MANUAL_JOURNALS">
          <Button type="primary" icon="upload" onClick={onImport}>Import Entries</Button>
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
