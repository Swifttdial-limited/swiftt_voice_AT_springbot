import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import LocationSelect from '../../../../components/common/LocationSelect';
import DateRangeSearch from '../../../../components/common/DateRangeSearch';

const dateFormat = 'YYYY-MM-DD';

@connect(({ inventoryBalances, loading }) => ({
  inventoryBalances,
  loading: loading.effects['inventoryBalances/query'],
}))
class StocttakeSummaryView extends PureComponent {
  static propTypes = {
    inventoryBalances: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
  };

  state = {
    startDate: {},
    endDate: {},
    location: {},
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryBalances/purge',
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
      type: 'inventoryBalances/query',
      payload: queryPayload,
    });
  }

  locationSelectHandler = (value) => {
    if (value) { this.setState({ location: value }); } else { this.setState({ location: {} }); }
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
    const { inventoryBalances, dispatch } = this.props;
    const { loading, list, pagination, success } = inventoryBalances;

    const locationSelectProps = {
      multiSelect: false,
    };

    const columns = [
      {
        title: 'PurchaseOrder Number',
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
        title="Stocktake Summary Report"
        content="This report show stocktaking data in your organization at a store or location."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={6} sm={24}>
              <LocationSelect {...locationSelectProps} onLocationSelect={this.locationSelectHandler} />
            </Col>
            <Col md={14} sm={24}>
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

export default StocttakeSummaryView;
