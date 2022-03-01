import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { DatePicker, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const RangePicker = DatePicker.RangePicker;

function CustomDateRangePicker({
  allowFuture,
  allowPast,
  disabled,
  onRangeSelect
}) {

  const handleDateSelect = (dates, dateStrings) => {
    onRangeSelect(dates[0], dates[1]);
  };

  const disabledDate = (current) => {
    if (allowPast) {
      return current && current.valueOf() > Date.now();
    } else if (!allowPast && allowFuture) {
      return current && current.valueOf() < Date.now();
    }
  };

  return (
    <LocaleProvider locale={enUS}>
      <RangePicker
        disabled={disabled}
        disabledDate={(allowPast && allowFuture) ? null : disabledDate}
        onChange={handleDateSelect}
      />
    </LocaleProvider>
  );
}

CustomDateRangePicker.defaultProps = {
  disabled: false,
};

CustomDateRangePicker.propTypes = {
  allowPast: PropTypes.bool.isRequired,
  allowFuture: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onRangeSelect: PropTypes.func.isRequired,
};

export default CustomDateRangePicker;
