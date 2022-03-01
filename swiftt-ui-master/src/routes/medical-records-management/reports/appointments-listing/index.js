import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DateRangeSearch from '../../../../components/common/DateRangeSearch';

const ageDateFormat = 'YYYY, M, DD';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ appointments, loading }) => ({
  appointments,
  loading: loading.effects['appointments/query'],
}))
class AppointmentsListingView extends PureComponent {
  static propTypes = {
    appointments: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
  };

  state = {
    startDate: {},
    endDate: {},
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appointments/purge',
    });
  }

  fetchData = () => {
    const { dispatch } = this.props;
    const { startDate, endDate } = this.state;

    const queryPayload = {};

    if (startDate._isAMomentObject && endDate._isAMomentObject) {
      queryPayload.startDate = startDate.format(dateFormat);
      queryPayload.endDate = endDate.format(dateFormat);
    }

    dispatch({
      type: 'appointments/query',
      payload: queryPayload,
    });
  }

  handleDateRangeSearchChange = (value) => {
    this.setState({ startDate: value.startDate, endDate: value.endDate });
  }

  async pageChange(pagination) {
    console.log('action for getting data');
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const { appointments, dispatch } = this.props;
    const { loading, list, pagination, success } = appointments;

    const dateRangeSearchProps = {
      allowFuture: true,
      allowPast: true,
    };

    const columns = [
      {
        title: 'Patient Number',
        dataIndex: 'patient.medicalRecordNumber',
        key: 'patient.medicalRecordNumber',
        render: (text, record) => <span>{text || record.patient.overTheCounterNumber}</span>,
      }, {
        title: 'Name',
        dataIndex: 'patient.user.fullName',
        key: 'patient.user.fullName',
      }, {
        title: 'Appointment Date and Time',
        dataIndex: 'appointmentDate',
        key: 'appointmentDate',
        render: (text, record) => <span>{moment(text).format(dateTimeFormat)} ({record.proposedStartTime} - {record.proposedEndTime})</span>,
      }, {
        title: 'Type',
        dataIndex: 'appointmentType.name',
        key: 'appointmentType.name',
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      }, {
        title: 'Age',
        dataIndex: 'patient.user.dateOfBirth',
        key: 'patient.user.dateOfBirth',
        render: text => <span>{moment(moment(text).format(ageDateFormat)).fromNow(true)} old</span>,
      }, {
        title: 'Sex',
        dataIndex: 'patient.user.gender',
        key: 'patient.user.gender',
      }, {
        title: 'Phone Number',
        dataIndex: 'patient.user.phoneNumber',
        key: 'patient.user.phoneNumber',
      },
    ];

    return (
      <PageHeaderLayout
        title="Appointments Listing Report"
        content="This report shows appointments that can be filtered by appointment date, appointment status and attendees e.g. Doctor"
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={12} sm={24}>
              <DateRangeSearch
                {...dateRangeSearchProps}
                onSearch={this.handleDateRangeSearchChange}
              />
            </Col>
            <Col md={8} sm={24} offset={4} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="filter" onClick={this.fetchData}>Filter</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={24} lg={24}>
              <LocaleProvider locale={enUS}>
                <Table
                  size="middle"
                  bordered
                  columns={columns}
                  dataSource={list}
                  loading={loading}
                  onChange={::this.pageChange}
                  pagination={pagination}
                  simple
                  rowKey={record => record.id}
                />
              </LocaleProvider>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default AppointmentsListingView;
