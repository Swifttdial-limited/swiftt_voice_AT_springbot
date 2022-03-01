import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Tag, List, Icon, Avatar, Modal, Divider } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AppointmentsCalender from '../../components/common/appointments/AppointmentsCalendar';
import AppointmentView from '../../components/appointments-management/appointment';
import Toolbar from '../../components/appointments-management/Toolbar';

const ageDateFormat = 'YYYY, M, DD';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const timeFormat = 'HH:mm';

@connect(({ appointments, loading }) => ({
  appointments,
  loading: loading.effects['appointments/query'],
}))
class AppointmentsView extends PureComponent {

  static defaultProps = {
    loading: false,
  };

  static propTypes = {
    loading: PropTypes.bool,
    appointments: PropTypes.object,
  };

  state = {
    width: 800,
    currentTypeOfView: '',
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));

    this.fetchAppointments();
    this.changeTypeOfViewHandler('NORMAL');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  changeTypeOfViewHandler = (typeOfView) => {
    this.setState({ currentTypeOfView: typeOfView });
  }

  fetchAppointments = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appointments/query',
      payload: {
        date: moment().format(dateFormat),
        status: 'SCHEDULED'
      }
    });
  }

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  updateDimensions() {
    if (window.innerWidth < 1000) {
      this.setState({ width: 850 });
    } else if (window.innerWidth > 1000) {
      this.setState({ width: 0 });
    } else {
      const updateWidth = window.innerWidth - 100;
      this.setState({ width: updateWidth });
    }
  }

  appointmentClickHandler = (appointment) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'appointment/query',
      payload: { id: appointment.id },
    });
  }

  selectedDateChangeHandler = (selectedDate) => {
    // const { dispatch } = this.props;
    // dispatch({ type: 'appointments/query', payload: { date: selectedDate.format(dateFormat) } });
    //
    // this.setState({ selectedDate: selectedDate.format(dateFormat) });
  }

  dateRangeSelectHandler = (startDate, endDate) => {
    // const { dispatch } = this.props;
    // dispatch({ type: 'appointments/query', payload: {startDate: startDate, endDate: endDate} });
  }

  render() {
    const { dispatch, loading, appointments } = this.props;
    const { list, pagination } = appointments;

    const { currentTypeOfView } = this.state;

    const renderAppointmentStatusTag = (status) => {
      switch (status) {
        case 'WAITING':
          return <Tag color="orange">WAITING</Tag>;
        case 'ON_GOING':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CANCELLED':
          return <Tag color="red">CANCELLED</Tag>;
        case 'COMPLETED':
          return <Tag color="magenta">COMPLETED</Tag>;
        case 'SCHEDULED_AND_NEEDS_CONFIRMATION':
          return <Tag color="blue">NEEDS CONFIRMATION</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const toolbarProps = {
      filter: {},
      currentTypeOfView: currentTypeOfView,
      onChangeTypeOfView: this.changeTypeOfViewHandler,
      onFilterChange(value) {
        let payload = {
          date: moment().format(dateFormat),
        };

        if(value.status && value.status !== 'ALL') {
          payload.status = value.status
        }

        if(value.startDate && value.endDate) {
          payload.startDate = value.startDate
          payload.endDate = value.endDate
        }

        if(value.date) {
          payload.date = value.date;
        }

        if(value.assignedUsers !== undefined && value.assignedUsers.length > 0) {
          payload.assignedUsers = [];

          value.assignedUsers.forEach(function(user) {
            if(user != undefined)
              payload.assignedUsers.push(user.publicId);
          });
        }

        dispatch({ type: 'appointments/query', payload });
      },
    };

    const renderCardTitle = (item) => {
      if(item.patient.user) {
        let title = item.patient.user.fullName;
        if(item.patient.medicalRecordNumber)
          title += ' (' + item.patient.medicalRecordNumber + ')'

        return title;
      }
      return null;
    }

    const renderCardDescription = (item) => {
      if(item) {
        let description = '';
        if(item.appointmentType) {
          description += 'Type: ' + item.appointmentType.name;
        }
        if(item.proposedStartTime && item.proposedEndTime) {
          description += ' Time: ' + item.proposedStartTime + ' - ' + item.proposedEndTime;
        }

        return description;
      }

      return null;
    }

    return (
      <PageHeaderLayout
        title="Appointments"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Toolbar {...toolbarProps} />
          </Row>
          <Divider />
          { currentTypeOfView === 'NORMAL' && (
            <Row gutter={8}>
              <Col span={8}>
                <div className="infinite-container">
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    useWindow={false}>
                      <List
                        loading={loading}
                        size="small"
                        header={<div>Appointments ({list.length})</div>}
                        footer={<div>Pagination Footer</div>}
                        bordered
                        split
                        dataSource={list}
                        renderItem={item => (
                          <List.Item key={item.id} onClick={() => this.appointmentClickHandler(item)}>
                            <List.Item.Meta
                              title={renderCardTitle(item)}
                              description={renderCardDescription(item)}
                            />
                            <div>
                              <span style={{ display: 'block', textAlign: 'right', padding: 5 }}>
                                {renderAppointmentStatusTag(item.status)}
                              </span>
                              <span style={{ display: 'block', textAlign: 'right', padding: 5 }}>
                                {moment(item.appointmentDate).local().format(dateTimeFormat)}
                              </span>
                            </div>
                          </List.Item>
                        )}
                      />
                  </InfiniteScroll>
                </div>
              </Col>
              <Col span={16}>
                <AppointmentView fetchAppointments={this.fetchAppointments} />
              </Col>
            </Row>
          )}
          { currentTypeOfView === 'CALENDAR' && (
            <AppointmentsCalender
              appointments={list}
              onDateClick={this.selectedDateChangeHandler}
            />
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default AppointmentsView;
