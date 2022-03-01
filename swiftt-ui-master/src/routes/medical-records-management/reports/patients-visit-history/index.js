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

@connect(({ encounters, loading }) => ({
  encounters,
  loading: loading.effects['encounters/query'],
}))
class PatientsVisitHistoryListingView extends PureComponent {

  static propTypes = {
    encounters: PropTypes.object,
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
      type: 'encounters/purge',
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
      type: 'encounters/query',
      payload: queryPayload,
    });
  }

  handleDateRangeSearchChange = (value) => {
    this.setState({ startDate: value.startDate, endDate: value.endDate }, () => {
        this.fetchData();
    });
  }

  async pageChange(pagination) {
    console.log('action for getting data');
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const { encounters, dispatch } = this.props;
    const { loading, list, pagination, success } = encounters;

    const columns = [
      {
        title: 'Date of Visit',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
      }, {
        title: 'Visit No.',
        dataIndex: 'visitNumber',
        key: 'visitNumber',
      }, {
        title: 'Name',
        dataIndex: 'patient.user.fullName',
        key: 'patient.user.fullName',
      }, {
        title: 'MR No.',
        dataIndex: 'patient.medicalRecordNumber',
        key: 'patient.medicalRecordNumber',
        render: (text, record) => <span>{text || record.patient.overTheCounterNumber}</span>,
      }, {
        title: 'Age',
        dataIndex: 'patient.user.dateOfBirth',
        key: 'patient.user.dateOfBirth',
        render: text => <span>{moment(moment(text).format(ageDateFormat)).fromNow(true)} old</span>,
      }, {
        title: 'Gender',
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
        title="Patient Visit History Report"
        content="This report shows patient visit history details."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={12} sm={24}>
              <DateRangeSearch onSearch={this.handleDateRangeSearchChange} />
            </Col>
            <Col md={8} sm={24} offset={4} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="filter" onClick={this.fetchData}>Filter</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={24} lg={24}>
              <LocaleProvider locale={enUS}>
                <Table
                  size="small"
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

export default PatientsVisitHistoryListingView;
