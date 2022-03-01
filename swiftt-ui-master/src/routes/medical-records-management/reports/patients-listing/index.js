import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DateRangeSearch from '../../../../components/common/DateRangeSearch';

const dateFormat = 'YYYY-MM-DD';

@connect(({ patients, loading }) => ({
  patients,
  loading: loading.effects['patients/query'],
}))
class PatientListingView extends PureComponent {

  static propTypes = {
    patients: PropTypes.object,
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
      type: 'patients/purge',
    });
  }

  fetchData = () => {
    const { dispatch } = this.props;
    const { startDate, endDate } = this.state;

    const queryPayload = {};

    if (startDate._isAMomentObject && endDate._isAMomentObject) {
      queryPayload.registrationStartDate = startDate.format(dateFormat);
      queryPayload.registrationEndDate = endDate.format(dateFormat);
    }

    dispatch({
      type: 'patients/query',
      payload: queryPayload,
    });
  }

  handleDateRangeSearchChange = (value) => {
    this.setState({ startDate: value.startDate, endDate: value.endDate }, () => {
        this.fetchData();
    });
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const { patients, dispatch } = this.props;
    const { loading, list, pagination, success } = patients;

    const columns = [
      {
        title: 'Patient Number',
        dataIndex: 'medicalRecordNumber',
        key: 'medicalRecordNumber',
        render: (text, record) => <span>{text || record.overTheCounterNumber}</span>,
      }, {
        title: 'Name',
        dataIndex: 'user.fullName',
        key: 'user.fullName',
      }, {
        title: 'Sex',
        dataIndex: 'user.gender',
        key: 'user.gender',
      }, {
        title: 'Date of Birth',
        dataIndex: 'user.dateOfBirth',
        key: 'user.dateOfBirth',
        render: text => <span>{moment(text).format(dateFormat)}</span>,
      }, {
        title: 'Country of Origin',
        dataIndex: 'user.countryOfOrigin.countryName',
        key: 'user.countryOfOrigin.countryName',
      }, {
        title: 'Phone Number',
        dataIndex: 'user.phoneNumber',
        key: 'user.phoneNumber',
      }, {
        title: 'Marital Status',
        dataIndex: 'user.maritalStatus',
        key: 'user.maritalStatus',
      }, {
        title: 'Religion',
        dataIndex: 'user.religion.name',
        key: 'user.religion.name',
      }, {
        title: 'Deceased',
        dataIndex: 'deceased',
        key: 'deceased',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      }, {
        title: 'Registration Date',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).format(dateFormat)}</span>,
      }, {
        title: 'Registration Method',
        dataIndex: 'registrationMethod',
        key: 'registrationMethod',
        render: text => <span>{text === 'HOSPITAL_REGISTERED' ? 'Hospital' : 'Self'}</span>,
      },
    ];

    return (
      <PageHeaderLayout
        title="Patients Listing Report"
        content="This report shows patient details as captured during registration."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={16} sm={24}>
              <DateRangeSearch onSearch={this.handleDateRangeSearchChange} />
            </Col>
            <Col md={8} sm={24} style={{ textAlign: 'right' }}>
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

export default PatientListingView;
