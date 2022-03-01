import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Icon,
  Row,
  Col,
  Button,
  Tooltip,
  Table,
  LocaleProvider,
  DatePicker
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import numeral from 'numeral';
import { find } from 'lodash';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ProductSelect from '../../../../components/common/ProductSelect';
import LocationSelect from '../../../../components/common/LocationSelect';

import { query } from '../../../../services/inventory/inventoryBalanceThresholds';

const dateFormat = 'YYYY-MM-DD';

class InventoryReorderLevelsListingView extends PureComponent {
  state = {
    list: [],
    loading: false,
    location: {},
  };

  fetchExpiries = (product) => {
    this.setState({ loading: true });

    query({
      location: this.state.location.publicId,
      ...(product && { product: product.id}),
    }).then((response) => {
      this.setState({ list: response.content, loading: false });
    }).catch((error) => {
      this.setState({ list: [], loading: false });
    });
  }

  locationSelectHandler = (value) => {
    if (value) {
      this.setState({ location: value }, () => {
        this.fetchExpiries();
      });
    } else {
      this.setState({ list: [] });
    }
  }

  productSelectHandler = (value) => {
    if (value) {
      this.fetchExpiries(value);
    } else {
      this.setState({ list: [] });
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
    };

    const productSelectProps = {
      multiSelect: false,
      productTypes: ['MEDICATION', 'SUPPLIES'],
    };

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
        title: 'Reorder Level',
        dataIndex: 'reorderLevel',
        key: 'reorderLevel',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0')}</span>
      }, {
        title: 'Available Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0')}</span>
      }, {
        title: 'Variance',
        dataIndex: 'reorderLevelVariance',
        key: 'reorderLevelVariance',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0')}</span>
      },
    ];

    return (
      <PageHeaderLayout
        title="Inventory Reorder Levels Report"
        content="This report that shows minimum quantity an item holds in a store/location before re-stocking"
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={18} sm={24}>
              <LocationSelect {...locationSelectProps} onLocationSelect={this.locationSelectHandler} />
              <ProductSelect {...productSelectProps} onProductSelect={this.productSelectHandler} />
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

export default InventoryReorderLevelsListingView;
