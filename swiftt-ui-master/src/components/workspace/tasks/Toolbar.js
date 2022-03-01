import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col, Select, Button, Form } from 'antd';

import CustomDateRangePicker from '../../common/CustomDateRangePicker';
import UserSelect from '../../common/UserSelect';

const Option = Select.Option;
const ColProps = {
  xs: 24,
  sm: 5,
  style: {
    marginBottom: 0,
  },
};

const TwoColProps = {
  xl: 96,
  xs: 24,
  sm: 14,
  style: {
    textAlign: 'right',
  },
};

function Toolbar({
  filter,
  onFilterChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  }
}) {

  const dateRangeSelectProps = {
    allowFuture: false,
    allowPast: true,
    onRangeSelect(startDate, endDate) {
      handleChange('createDateRange', [startDate, endDate])
    },
  };

  // const userSelectProps = {
  //   searchByEnabled: true,
  //   department: (sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).department.publicId) ? JSON.parse(sessionStorage.getItem('current_user')).department.publicId : null,
  //   onUserSelect: (user) => {
  //     handleChange('assignedUsers', [user])
  //   }
  // };

  const handleFields = (fields) => {
    const { createDateRange } = fields
    if (createDateRange.length) {
      fields.startDate = createDateRange[0].format('YYYY-MM-DD')
    }

    if (createDateRange.length) {
      fields.endDate = createDateRange[1].format('YYYY-MM-DD')
    }

    return fields
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleChange()
  }

  const { status, startDate, endDate } = filter

  let initialCreateTime = []
  if (filter.startDate && filter.startDate) {
    initialCreateTime[0] = moment(filter.startDate)
  }
  if (filter.endDate && filter.endDate) {
    initialCreateTime[1] = moment(filter.endDate)
  }

  return(
    <Row gutter={24}>
      <Col {...ColProps}>
        {getFieldDecorator('status', {
          initialValue: "ALL"
        })(
          <Select
            onChange={handleChange.bind(null, 'status')}
            placeholder="Filter by Task Status"
            style={{ width: '100%' }}>
            <Option value="ALL">All</Option>
            <Option value="NEW">New</Option>
            <Option value="ACTIVE">In Progress</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps}>
        {getFieldDecorator('createDateRange', {
          initialValue: initialCreateTime
        })(<CustomDateRangePicker
            style={{ width: '100%' }}
            {...dateRangeSelectProps} />)}
      </Col>
      {/*
        {(sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).department.publicId)
          ? (
            <Col {...ColProps}>
              {getFieldDecorator('assignedUsers', {})
              (<UserSelect {...userSelectProps} />)}
            </Col>
          ) : null}
      */}

      <Col {...TwoColProps}></Col>
    </Row>
  );
}

Toolbar.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(Toolbar);
