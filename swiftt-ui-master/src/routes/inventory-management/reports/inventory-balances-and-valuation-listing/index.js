import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import numeral from 'numeral';
import { find } from 'lodash';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import LocationSelect from '../../../../components/common/LocationSelect';

import { queryDetailed, querySummarized } from '../../../../services/inventory/inventoryBalances';

const dateFormat = 'YYYY-MM-DD';

class StocksListingView extends PureComponent {
  state = {
    list: [],
    loading: false,
    location: {},
  };

  fetchSummarizedData = (location) => {
    this.setState({ loading: true });

    querySummarized({
      location: location.publicId,
    }).then((response) => {
      this.setState({ list: response.content, loading: false });
    }).catch((error) => {
      this.setState({ list: [], loading: false });
    });
  }

  fetchDetailedData = (product) => {
    this.setState({ loading: true });

    queryDetailed({
      location: this.state.location.publicId,
      product: product,
    }).then((response) => {
      const list = this.state.list;
      const summary = find(list, ['productId', product]);
      summary.details = response.content;

      this.setState({ loading: false });
    }).catch((error) => {
      this.setState({ list: [], loading: false });
    });
  }

  locationSelectHandler = (value) => {
    if (value) {
      this.setState({ location: value }, () => {
        this.fetchSummarizedData(value);
      });
    } else {
      this.setState({ list: [] });
    }
  }

  rowExpandHandler = (expanded, record) => {
    if(expanded) {
      this.fetchDetailedData(record.productId);
    }
  }

  async pageChange(pagination) {
    console.log('action for getting data');
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const { loading, list, pagination } = this.state;

    const locationSelectProps = {
      multiSelect: false,
      //isStore: true,
    };

    const columns = [
      {
        title: 'Product',
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record) => <span>{text} ({record.productCode})</span>
      }, {
        title: 'Bin Location',
        dataIndex: 'binLocation.name',
        key: 'binLocation.name',
      }, {
        title: 'Pack Size',
        dataIndex: 'productPackSize',
        key: 'productPackSize',
      }, {
        title: 'Total Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0')}</span>
      }, {
        title: 'Total Value',
        dataIndex: 'value',
        key: 'value',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0.00')}</span>
      },
    ];

    const expandedRowRender = (record) => {
      const columns = [
          {
           title: 'Tracking Code',
           dataIndex: 'stockTrackingNumber',
           key: 'stockTrackingNumber',
           align: 'center',
         }, {
           title: 'Stock Date',
           dataIndex: 'stockDate',
           key: 'stockDate',
           align: 'center',
           render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
         }, {
          title: 'Vendor',
          dataIndex: 'vendorName',
          key: 'vendorName',
        }, {
         title: 'Purchase Invoice',
         dataIndex: 'purchaseInvoice',
         key: 'purchaseInvoice',
       }, {
          title: 'Serial Number',
          dataIndex: 'serialNumber',
          key: 'serialNumber',
        }, {
          title: 'Expiry Date',
          dataIndex: 'bestBeforeDate',
          key: 'bestBeforeDate',
          align: 'center',
          render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
        }, {
          title: 'Balance',
          dataIndex: 'balance',
          key: 'balance',
          align: 'right',
          render: (text) => <span>{numeral(text).format('0,0')}</span>
        }, {
          title: 'Cost',
          dataIndex: 'cost',
          key: 'cost',
          align: 'right',
          render: (text) => <span>{numeral(text).format('0,0.00')}</span>
        }, {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          align: 'right',
          render: (text) => <span>{numeral(text).format('0,0.00')}</span>
        },
      ];

      return (
        <Table
          size="small"
          columns={columns}
          dataSource={record.details ? record.details : []}
          pagination={false}
        />
      );
    };

    return (
      <PageHeaderLayout
        title="Inventory Balances and Valuation Report"
        content="This report that shows stock balances of a product at a store or location."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={12} sm={24}>
              <LocationSelect {...locationSelectProps} onLocationSelect={this.locationSelectHandler} />
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
                  onExpand={::this.rowExpandHandler}
                  pagination={pagination}
                  simple
                  rowKey={record => record.id}
                  expandedRowRender={expandedRowRender}
                />
              </LocaleProvider>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default StocksListingView;
