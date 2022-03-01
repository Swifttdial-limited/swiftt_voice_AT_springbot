import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import LocationSelect from '../../../../components/common/LocationSelect';
import DateRangeSearch from '../../../../components/common/DateRangeSearch';
import Trend from '../../../../components/Trend';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ inventoryTransactions, loading }) => ({
  inventoryTransactions,
  loading: loading.effects['inventoryTransactions/query'],
}))
class InventoryActivitySummaryView extends PureComponent {

  static propTypes = {
    inventoryTransactions: PropTypes.object,
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
      type: 'inventoryTransactions/purge',
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
      type: 'inventoryTransactions/query',
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
    const { inventoryTransactions, dispatch } = this.props;
    const { loading, list, pagination, success } = inventoryTransactions;

    const locationSelectProps = {
      multiSelect: false,
      //isStore: true,
    };

    const renderInventoryTransactionTypeTag = (type) => {
      switch (type) {
        case 'RECEIPT_NOTE':
          return <span>Goods Receipt Note</span>;
        case 'PATIENT_BILL_DISPENSATION':
          return <span>Dispensation</span>;
        case 'STOCK_DEPRECIATION':
          return <span>Depreciation</span>;
        case 'INVENTORY_ADJUSTMENT':
          return <span>Inventory Adjustment</span>;
        case 'INVENTORY_TRANSFER':
          return <span>Inventory Transfer</span>;
        case 'VENDOR_RETURN':
          return <span>Vendor Goods Return</span>;
        default:
          return <span>{type}</span>;
      }
    };

    const columns = [
      {
        title: 'Product',
        dataIndex: 'inventoryMetadata.product.productName',
        key: 'inventoryMetadata.product.productName',
        render: (text, record) => <span>{record.inventoryMetadata.product.productName} ({record.inventoryMetadata.product.productCode})</span>,
      }, {
        title: 'Pack Size',
        dataIndex: 'inventoryMetadata.product.packSize',
        key: 'inventoryMetadata.product.packSize',
      }, {
        title: 'Tracking Code',
        dataIndex: 'inventoryMetadata.stockTrackingNumber',
        key: 'inventoryMetadata.stockTrackingNumber',
        align: 'center',
      }, {
        title: 'Expiry Date',
        dataIndex: 'inventoryMetadata.bestBeforeDate',
        key: 'inventoryMetadata.bestBeforeDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: 'Batch Number',
        dataIndex: 'inventoryMetadata.serialNumber',
        key: 'inventoryMetadata.serialNumber',
      }, {
        title: 'Quantity',
        dataIndex: 'transactionQuantity',
        key: 'transactionQuantity',
        align: 'right',
        render: text => (
          <span>
            {`${numeral(text ? text.toLocaleString() : text).format('0,0')}`}
          </span>
        ),
      }, {
        title: 'Value',
        dataIndex: 'transactionValue',
        key: 'transactionValue',
        align: 'right',
        render: (text, record) => (
          <span>
            {`${numeral(record.transactionQuantity * record.inventoryMetadata.cost).format('0,0.00')}`}
          </span>
        ),
      }, {
        title: 'Activity Type',
        dataIndex: 'stockTransactionType',
        key: 'stockTransactionType',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.transactionQuantity < 0 ? 'down' : 'up'} style={{ float: 'right' }}>
            <span style={{ marginRight: 4 }}>{renderInventoryTransactionTypeTag(text)}</span>
          </Trend>
        ),
      }, {
        title: 'Activity Date',
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      },
    ];

    return (
      <PageHeaderLayout
        title="Inventory Activity Report"
        content="This report that shows inventory activities within your organization within stores or locations."
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

export default InventoryActivitySummaryView;
