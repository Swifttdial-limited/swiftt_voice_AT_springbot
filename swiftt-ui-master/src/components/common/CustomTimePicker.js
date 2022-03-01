import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';

import { TimePicker, LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

const timeFormat = 'HH:mm';

class CustomTimePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { minimumTime: '' };
  }

  componentWillReceiveProps(nextProps) {
    if ('minimumTime' in nextProps) { this.setState({ minimumTime: nextProps.minimumTime }); }
  }

  disabledHours = () => {
    if (this.state.minimumTime) {
      const minimumHour = moment(this.state.minimumTime, timeFormat).hour();
      return this.range(0, minimumHour);
    } else { return []; }
  }

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  timeSelectChangeHandler = e => this.props.onTimeSelect(e);

  render() {
    const {
      disabled,
      editValue,
      minimumTime,
      placeholder,
    } = this.props;

    return (
      <TimePicker
        disabled={disabled}
        defaultOpenValue={moment('00:00', timeFormat)}
        disabledHours={this.disabledHours}
        format={timeFormat}
        placeholder={placeholder}
        hideDisabledOptions
        onChange={this.timeSelectChangeHandler}
      />
    );
  }
}

CustomTimePicker.defaultProps = {
  disabled: false,
};

CustomTimePicker.propTypes = {
  disabled: PropTypes.bool,
  editValue: PropTypes.number,
  minimumTime: PropTypes.string,
  placeholder: PropTypes.string,
  onTimeSelect: PropTypes.func.isRequired,
};

export default CustomTimePicker;
