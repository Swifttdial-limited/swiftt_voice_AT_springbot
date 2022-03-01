import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider, Tag } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ContactSelect from '../../../../components/common/ContactSelect';
import DateRangeSearch from '../../../../components/common/DateRangeSearch';

const dateFormat = 'YYYY-MM-DD';

@connect(({ purchaseOrders, loading }) => ({
  purchaseOrders,
  loading: loading.effects['purchaseOrders/query'],
}))
class PurchaseOrdersListingView extends PureComponent {
  static propTypes = {
    purchaseOrders: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
  };

  state = {
    startDate: {},
    endDate: {},
    vendor: {},
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrders/purge',
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
      type: 'purchaseOrders/query',
      payload: queryPayload,
    });
  }

  contactSelectHandler = (value) => {
    if (value) { this.setState({ vendor: value }); } else { this.setState({ vendor: {} }); }
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
    const { purchaseOrders, dispatch } = this.props;
    const { loading, list, pagination, success } = purchaseOrders;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const columns = [
      {
        title: 'Purchase Order No.',
        dataIndex: 'purchaseOrderNumber',
        key: 'purchaseOrderNumber',
      }, {
        title: 'Status',
        dataIndex: 'purchaseOrderStatus',
        key: 'purchaseOrderStatus',
      }, {
        title: 'Vendor',
        dataIndex: 'vendor.name',
        key: 'vendor.name',
      }, {
        title: 'Raised By',
        dataIndex: 'raisedBy.fullName',
        key: 'raisedBy.fullName',
      }, {
        title: 'Raise Date',
        dataIndex: 'raiseDate',
        key: 'raiseDate',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
      },
    ];

    return (
      <PageHeaderLayout
        title="Purchase Orders Listing Report"
        content="This is a report that shows purchase orders issued to suppliers and originating from a store or location."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={6} sm={24}>
              <ContactSelect {...contactSelectProps} onContactSelect={this.contactSelectHandler} />
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

export default PurchaseOrdersListingView;
