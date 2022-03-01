import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Checkbox, Row, Col } from 'antd';

import CustomTimePicker from './CustomTimePicker';

const timeFormat = 'HH:mm';

class CustomTimeRangeInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { endTime: '', startTime: '' };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) { this.setState(nextProps.value); }
  }

  endTimeChangeHandler = (value) => {
    if (value) {
      this.setState({ endTime: value.format(timeFormat) });
    }
    this.triggerChange({ endTime: value.format(timeFormat) });
  }

  startTimeChangeHandler = (value) => {
    if (value) {
      this.setState({ startTime: value.format(timeFormat) });
    }
    this.triggerChange({ startTime: value.format(timeFormat) });
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { startTime } = this.state;

    return (
      <Row gutter={24}>
        <Col span={12}>
          <CustomTimePicker
            placeholder="Start time"
            onTimeSelect={this.startTimeChangeHandler}
          />
        </Col>
        <Col span={12}>
          <CustomTimePicker
            placeholder="End time"
            disabled={!(startTime.length > 1)}
            minimumTime={startTime}
            onTimeSelect={this.endTimeChangeHandler}
          />
        </Col>
      </Row>
    );
  }
}

CustomTimeRangeInput.defaultProps = {};

CustomTimeRangeInput.propTypes = {};

export default CustomTimeRangeInput;
