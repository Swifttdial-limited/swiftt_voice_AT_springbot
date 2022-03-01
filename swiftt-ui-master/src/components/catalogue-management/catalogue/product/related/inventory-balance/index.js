import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Table,
  LocaleProvider,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import numeral from 'numeral';
import { find } from 'lodash';

import {
  queryDetailed,
  querySummarized,
} from '../../../../../../services/inventory/inventoryBalances';

const dateFormat = 'YYYY-MM-DD';

class InventoryBalanceView extends PureComponent {
  static propTypes = {
    product: PropTypes.object.isRequired,
  };

  state = {
    list: [],
    loading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 0,
      total: 0,
    },
  };

  componentDidMount() {
    this.fetchSummaryInventoryBalance();
  }

  fetchSummaryInventoryBalance = () => {
    this.setState({ loading: true });

    querySummarized({
      product: this.props.product.id,
    }).then((response) => {
      this.setState({ list: response.content, loading: false });
    }).catch((error) => {
      this.setState({ list: [], loading: false });
    });
  }

  fetchDetailedInventoryBalance = (location, product) => {
    this.setState({ loading: true });

    queryDetailed({
      location: location,
      product: product,
    }).then((response) => {
      const list = this.state.list;
      const summary = find(list, { 'locationId': location, 'productId': product });
      summary.details = response.content;

      this.setState({ loading: false });
    }).catch((error) => {
      this.setState({ list: [], loading: false });
    });
  }

  rowExpandHandler = (expanded, record) => {
    if(expanded) {
      this.fetchDetailedInventoryBalance(record.locationId, record.productId);
    }
  }

  async pageChange(pagination) {
    console.log('action for getting data');
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const { list, loading, pagination } = this.state;

    const columns = [
      {
        title: 'Product',
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record) => <span>{text} ({record.productCode})</span>
      }, {
        title: 'Pack Size',
        dataIndex: 'productPackSize',
        key: 'productPackSize',
      }, {
        title: 'Location',
        dataIndex: 'locationName',
        key: 'locationName',
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
    );
  }
}

export default InventoryBalanceView;
