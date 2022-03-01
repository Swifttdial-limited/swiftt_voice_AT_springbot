import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Input } from 'antd';

import CustomDateRangePicker from '../../common/CustomDateRangePicker';

const Search = Input.Search;

const ColProps = {
  xs: 24,
  sm: 8,
  style: {
    marginBottom: 0,
  },
};

const TwoColProps = {
  ...ColProps,
  xl: 96,
};

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
    let fields = getFieldsValue();
    fields = handleFields(fields);
    onFilterChange(fields);
  };

  const dateRangeSelectProps = {
    allowFuture: false,
    allowPast: true,
    onRangeSelect(value) {
      console.log(value);
    },
  };

  return (
    <Row gutter={24}>
      <Col {...ColProps}>
        {getFieldDecorator('name', { initialValue: name })(<Search placeholder="Search Name" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps}>
        {getFieldDecorator('createTime', {})(<CustomDateRangePicker style={{ width: '100%' }} {...dateRangeSelectProps} />)}
      </Col>
      <Col {...TwoColProps}>
        <Button type="primary" className="margin-right" onClick={handleSubmit}>Search</Button>
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
