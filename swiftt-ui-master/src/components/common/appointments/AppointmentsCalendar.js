import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { map, uniq } from 'lodash';
import moment from 'moment';
import { Calendar, Badge, LocaleProvider, Icon, message, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './AppointmentsCalendar.less';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';

@connect()
class AppointmentsCalendar extends PureComponent {

  static propTypes = {
    appointments: PropTypes.array,
    onDateClick: PropTypes.func,
    dispatch: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    if ('appointments' in nextProps) {

    }
  }

  panelChangeHandler = (date, mode) => {
    const { onRangeSelect } = this.props;

    let startDate = '';
    let endDate = '';

    if(mode === 'month') {
      startDate = date.startOf('month').format(dateFormat);
      endDate = date.endOf('month').format(dateFormat);
      onRangeSelect(startDate, endDate);
    } else if(mode === 'year') {
      startDate = date.startOf('year').format(dateFormat);
      endDate = date.endOf('year').format(dateFormat);
      onRangeSelect(startDate, endDate);
    }
  }

  render() {
    const {
      dispatch,
      appointments,
      onDateClick,
    } = this.props;

    const listDates = appointments.map(dateItem => moment(dateItem.appointmentDate).format(dateFormat));
    const uniqueDates = uniq(listDates);

    const calendarData = {};

    uniqueDates.forEach((uniqueDate) => {
      const dayOfTheMonth = moment(uniqueDate).format('DDD');
      calendarData[dayOfTheMonth] = [];

      appointments.forEach((appointment) => {
        if (moment(appointment.appointmentDate).format(dateFormat) === uniqueDate) { calendarData[dayOfTheMonth].push(appointment); }
      });
    });

    const dateCellRender = (value) => {
      const data = calendarData[value.dayOfYear()];

      if (data) {
        return (
          <ul className="events">
            {
              data.map(item => (
                <li key={item.id}>
                  {item.appointmentType.name}
                  {/* {item.proposedStartTime} - {item.proposedEndTime} */}
                </li>
              ))
            }
          </ul>
        );
      }
    };

    return (
      <LocaleProvider locale={enUS}>
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={onDateClick}
          onPanelChange={this.panelChangeHandler} />
      </LocaleProvider>
    );
  }
}

export default AppointmentsCalendar;
