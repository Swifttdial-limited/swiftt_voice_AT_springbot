import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import moment from 'moment';

import CustomDateRangePicker from './CustomDateRangePicker';

const Option = Select.Option;
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 0,
  },
};

class DateRangeSearch extends PureComponent {

  static defaultProps = {
    allowFuture: false,
    allowPast: true,
  };

  static propTypes = {
    allowFuture: PropTypes.bool,
    allowPast: PropTypes.bool,
    onSearch: PropTypes.func,
  };

  state = {
    dateRangePickerDisabled: false,
  };

  handleChange = (value) => {
    const { onSearch } = this.props;

    if(value === 'CUSTOM') {
      this.setState({ dateRangePickerDisabled: false });
    } else {
      this.setState({ dateRangePickerDisabled: true });

      let startDate, endDate = '';

      if(value === 'WEEK') {
        startDate = moment().startOf('week');
        endDate = moment().endOf('week');
      } else if(value === 'MONTH') {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
      } else if(value === 'TODAY') {
        startDate = moment();
        endDate = moment();
      }

      onSearch({ startDate, endDate });
    }
  }

  render() {

    const {
      onSearch,
      allowFuture,
      allowPast,
    } = this.props;

    const dateRangeSelectProps = {
      allowFuture,
      allowPast,
      disabled: this.state.dateRangePickerDisabled,
      onRangeSelect(startDate, endDate) {
        onSearch({ startDate, endDate });
      },
    };

    return (
      <Row gutter={24}>
        <Col {...ColProps}>
          <Select
            defaultValue="CUSTOM"
            style={{ width: '100%' }}
            onChange={this.handleChange}
          >
            <Option value="TODAY">Today</Option>
            <Option value="WEEK">This Week</Option>
            <Option value="MONTH">This Month</Option>
            <Option value="CUSTOM">Custom</Option>
          </Select>
        </Col>
        <Col {...ColProps}>
          <CustomDateRangePicker
            style={{ width: '100%' }}
            {...dateRangeSelectProps}
          />
        </Col>
      </Row>
    );
  }

}

export default DateRangeSearch;
