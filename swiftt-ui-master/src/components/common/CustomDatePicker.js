import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { DatePicker, LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

function CustomDatePicker({
  allowFuture,
  allowPast,
  disabled,
  editValue,
  showTime,
  onDateSelect,
}) {
  // console.log(disabled);
  
  const dateFormat = 'YYYY-MM-DD';
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  const disabledDate = (current) => {
    if (allowPast) { return current && current.valueOf() > Date.now(); } else if (!allowPast && allowFuture) { return current && current.valueOf() < Date.now(); }
  };

  const handleDateSelect = (date, dateString) => {
    onDateSelect(date, dateString);
  };

  return (
    <DatePicker
      format={showTime ? dateTimeFormat : dateFormat}
      showTime={showTime}
      defaultValue={editValue ? moment(moment(editValue).format(dateFormat), dateFormat) : null}
      disabled={disabled}
      disabledDate={disabledDate}
      onChange={handleDateSelect}
      style={{ float: 'left' }}
    />
  );
}

CustomDatePicker.defaultProps = {
  disabled: false,
};

CustomDatePicker.propTypes = {
  allowPast: PropTypes.bool.isRequired,
  allowFuture: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  editValue: PropTypes.number,
  showTime: PropTypes.bool.isRequired,
  onDateSelect: PropTypes.func.isRequired,
};

export default CustomDatePicker;
