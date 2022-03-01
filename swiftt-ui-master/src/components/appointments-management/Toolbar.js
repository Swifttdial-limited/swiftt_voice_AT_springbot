import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col, Select, Button, Form } from 'antd';

import CustomDateRangePicker from '../common/CustomDateRangePicker';
import UserSelect from '../common/UserSelect';

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

const dateFormat = 'YYYY-MM-DD';

function Toolbar({
  filter,
  currentTypeOfView,
  onChangeTypeOfView,
  onFilterChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  }
}) {

  const handleFields = (fields) => {
    const {
      appointmentDateRange
    } = fields;

    if (appointmentDateRange.length) {
      if(appointmentDateRange[0].format('YYYY-MM-DD') !== appointmentDateRange[1].format(dateFormat)) {
        fields.startDate = appointmentDateRange[0].format(dateFormat);
        fields.endDate = appointmentDateRange[1].format(dateFormat);
      } else {
        fields.date = appointmentDateRange[0].format(dateFormat);
      }
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

  const dateRangeSelectProps = {
    allowFuture: true,
    allowPast: true,
    onRangeSelect(startDate, endDate) {
      handleChange('appointmentDateRange', [startDate, endDate])
    },
  };

  // const userSelectProps = {
  //   searchByEnabled: true,
  //   department: (sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).department.publicId) ? JSON.parse(sessionStorage.getItem('current_user')).department.publicId : null,
  //   onUserSelect: (user) => {
  //     handleChange('assignedUsers', [user])
  //   }
  // };

  // TODO add Location and AppointmentType filters

  return(
    <Row gutter={24}>
      <Col {...ColProps}>
        {getFieldDecorator('appointmentDateRange', {
          initialValue: initialCreateTime
        })(<CustomDateRangePicker
            style={{ width: '100%' }}
            {...dateRangeSelectProps} />)}
      </Col>
      <Col {...ColProps}>
        {getFieldDecorator('status', {
          initialValue: "SCHEDULED"
        })(
          <Select
            onChange={handleChange.bind(null, 'status')}
            placeholder="Filter by Status"
            style={{ width: '100%' }}>
            <Option value="ALL">All</Option>
            <Option value="SCHEDULED">Scheduled</Option>
            <Option value="RESCHEDULED">Re-scheduled</Option>
            <Option value="WAITING">Waiting</Option>
            <Option value="ON_GOING">In Progress</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="CANCELLED_AND_NEEDS_RESCHEDULE">Cancelled and needs re-scheduling</Option>
            <Option value="MISSED">Missed</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        )}
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

      <Col {...TwoColProps}>
        { currentTypeOfView === 'CALENDAR' && (
          <Button
            type="primary"
            icon="layout"
            onClick={() => onChangeTypeOfView('NORMAL')}>Normal View</Button>
        )}

        { currentTypeOfView === 'NORMAL' && (
          <Button
            type="primary"
            icon="calendar"
            onClick={() => onChangeTypeOfView('CALENDAR')} style={{ marginLeft: 5 }}>Calendar View</Button>
        )}
      </Col>
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
