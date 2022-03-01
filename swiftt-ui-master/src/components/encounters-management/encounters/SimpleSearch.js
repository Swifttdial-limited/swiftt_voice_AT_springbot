import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Input, Icon } from 'antd';

import DateRangeSearch from '../../common/DateRangeSearch';

const Search = Input.Search;

const dateFormat = 'YYYY-MM-DD';

function search({
  field,
  keyword,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
}) {
  const handleReset = () => {
    const fields = getFieldsValue();
    for (const item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    setFieldsValue(fields);
    handleSubmit();
  };

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      let fields = getFieldsValue();

      if (fields.dateRange.startDate._isAMomentObject && fields.dateRange.endDate._isAMomentObject) {
        const queryPayload = {};

        if(fields.name)
          queryPayload.patientName = fields.name;

        queryPayload.startDate = fields.dateRange.startDate.format(dateFormat);
        queryPayload.endDate = fields.dateRange.endDate.format(dateFormat);

        onSearch(queryPayload)
      }
    });
  };

  const handleDateRangeSearchChange = (value) => {
    setFieldsValue({ dateRange: value })
  }

  return (
    <Row gutter={24}>
      <Col md={6} sm={24}>
        {getFieldDecorator('name', {})(<Search placeholder="Search Name" onSearch={handleSubmit} />)}
      </Col>
      <Col md={13} sm={24}>
        {getFieldDecorator('dateRange', {
          rules: [
              {
                  required: true,
                  message: 'Payment mode name must be specified',
              },
          ],
        })(<DateRangeSearch onSearch={handleDateRangeSearchChange} />)}
      </Col>
      <Col md={5} sm={24} style={{ textAlign: 'right' }}>
        <Button icon="search" type="primary" onClick={handleSubmit} style={{ marginRight: 10 }}>Search</Button>
        <Button onClick={handleReset}>Reset</Button>
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
