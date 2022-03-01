import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DateRangeSearch from '../../../../components/common/DateRangeSearch';
import DepartmentSelect from '../../../../components/common/DepartmentSelect';

const ageDateFormat = 'YYYY, M, DD';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ requests, loading }) => ({
  requests,
  loading: loading.effects['requests/query'],
}))
class DepartmentalRequestsListingView extends PureComponent {
  static propTypes = {
    requests: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
  };

  state = {
    startDate: {},
    endDate: {},
    destinationDepartment: {},
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'requests/purge',
    });
  }

  fetchData = () => {
    const { dispatch } = this.props;
    const { startDate, endDate, destinationDepartment } = this.state;

    const queryPayload = {};

    if (startDate._isAMomentObject && endDate._isAMomentObject) {
      queryPayload.registrationStartDate = startDate.format(dateFormat);
      queryPayload.registrationEndDate = endDate.format(dateFormat);
    }

    if (destinationDepartment && destinationDepartment.publicId) {
      queryPayload.destinationDepartmentPublicId = destinationDepartment.publicId;
    }

    dispatch({
      type: 'requests/query',
      payload: queryPayload,
    });
  }

  departmentSelectHandler = (value) => {
    if (value) { this.setState({ destinationDepartment: value }); } else { this.setState({ destinationDepartment: {} }); }
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
    const { requests, dispatch } = this.props;
    const { loading, list, pagination, success } = requests;

    const departmentSelectProps = {
      multiSelect: false,
    };

    const columns = [
      {
        title: 'Patient Number',
        dataIndex: 'visit.patient.medicalRecordNumber',
        key: 'visit.patient.medicalRecordNumber',
        render: (text, record) => <span>{text || 'record.visit.patient.overTheCounterNumber'}</span>,
      }, {
        title: 'Name',
        dataIndex: 'visit.patient.user.fullName',
        key: 'visit.patient.user.fullName',
      }, {
        title: 'Date of Visit',
        dataIndex: 'visit.creationDate',
        key: 'visit.creationDate',
        render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
      }, {
        title: 'Creation Date',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
      }, {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: text => <span>{text || 'No description'}</span>,
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      }, {
        title: 'Paid',
        dataIndex: 'paid',
        key: 'paid',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      },
    ];

    return (
      <PageHeaderLayout
        title="Patient Visit per Department Report"
        content="This report shows patient visits per department."
      >
        <div className="content-inner">
          <Row gutter={24} style={{ marginBottom: 10 }}>
            <Col md={6} sm={24}>
              <DepartmentSelect {...departmentSelectProps} onDepartmentSelect={this.departmentSelectHandler} />
            </Col>
            <Col md={14} sm={24}>
              <DateRangeSearch onSearch={this.handleDateRangeSearchChange} />
            </Col>
            <Col md={4} sm={24} style={{ textAlign: 'right' }}>
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

export default DepartmentalRequestsListingView;
