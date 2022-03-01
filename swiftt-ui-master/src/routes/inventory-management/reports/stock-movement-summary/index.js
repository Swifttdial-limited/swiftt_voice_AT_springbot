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

@connect(({ inventoryTransfers, loading }) => ({
  inventoryTransfers,
  loading: loading.effects['inventoryTransfers/query'],
}))
class InventoryTransferSummaryView extends PureComponent {

  static propTypes = {
    inventoryTransfers: PropTypes.object,
    location: PropTypes.object,
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
      type: 'inventoryTransfers/purge',
    });
  }

  fetchData = () => {
    const { dispatch } = this.props;
    const { location, startDate, endDate } = this.state;

    const queryPayload = {
      location: location.publicId,
    };

    if (startDate._isAMomentObject && endDate._isAMomentObject) {
      queryPayload.startDate = startDate.format(dateFormat);
      queryPayload.endDate = endDate.format(dateFormat);
    }

    dispatch({
      type: 'inventoryTransfers/query',
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
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const { inventoryTransfers, dispatch } = this.props;
    const { loading, list, pagination, success } = inventoryTransfers;

    const locationSelectProps = {
      multiSelect: false,
      isStore: true,
    };

    const renderGoodsReceiptNoteStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">INCOMPLETE</Tag>;
        case 'PENDING':
          return <Tag color="orange">PENDING</Tag>;
        case 'IN_PROCESS':
          return <Tag color="blue">IN PROCESS</Tag>;
        case 'PRE_APPROVED':
          return <Tag color="purple">PREAPPROVED</Tag>;
        case 'APPROVED':
          return <Tag color="green">APPROVED</Tag>;
        case 'COMPLETED':
          return <Tag color="green">COMPLETED</Tag>;
        case 'REJECTED':
          return <Tag color="red">REJECTED</Tag>;
        case 'CANCELED':
          return <Tag color="red">CANCELED</Tag>;
        case 'DELETED':
          return <Tag color="red">DELETED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Movement No.',
        dataIndex: 'inventoryTransferNumber',
        key: 'inventoryTransferNumber',
      }, {
        title: 'Status',
        dataIndex: 'inventoryTransferStatus',
        key: 'inventoryTransferStatus',
        render: (text, record) => <span>{renderGoodsReceiptNoteStatusTag(text)}</span>,
      }, {
        title: 'From Location',
        dataIndex: 'fromLocation.name',
        key: 'fromLocation.name',
      }, {
        title: 'To Location',
        dataIndex: 'toLocation.name',
        key: 'toLocation.name',
      }, {
        title: 'Order Date',
        dataIndex: 'orderDate',
        key: 'orderDate',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: 'Fulfilment Date',
        dataIndex: 'sentDate',
        key: 'sentDate',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: 'Received Date',
        dataIndex: 'receiveDate',
        key: 'receiveDate',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }
    ];

    return (
      <PageHeaderLayout
        title="Inventory Transfer Summary Report"
        content="This report that shows stock movements within your organization between ordering and receiving stock stores or locations."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={12} sm={24}>
              <LocationSelect {...locationSelectProps} onLocationSelect={this.locationSelectHandler} />
            </Col>
            {/*
              <Col md={8} sm={24}>
                <DateRangeSearch onSearch={this.handleDateRangeSearchChange} />
              </Col>
            */}
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

export default InventoryTransferSummaryView;
