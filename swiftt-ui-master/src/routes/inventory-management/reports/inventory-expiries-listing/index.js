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

import { query } from '../../../../services/inventory/inventoryExpiries';

const dateFormat = 'YYYY-MM-DD';

class InventoryExpiriesListingView extends PureComponent {
  state = {
    list: [],
    loading: false,
    location: {},
  };

  fetchExpiries = (location, product, date) => {
    this.setState({ loading: true });

    query({
      location: this.state.location.publicId,
      //product: product,
    }).then((response) => {
      this.setState({ list: response.content, loading: false });
    }).catch((error) => {
      this.setState({ list: [], loading: false });
    });
  }

  locationSelectHandler = (value) => {
    if (value) {
      this.setState({ location: value }, () => {
        this.fetchExpiries(value);
      });
    } else {
      this.setState({ list: [] });
    }
  }

  productSelectHandler = (value) => {
    if (value) {
      this.setState({ location: value }, () => {
        this.fetchExpiries(null, value);
      });
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
        title: 'Expiry Date',
        dataIndex: 'bestBeforeDate',
        key: 'bestBeforeDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
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
         title: 'Serial Number',
         dataIndex: 'serialNumber',
         key: 'serialNumber',
       }, {
        title: 'Available Balance',
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

    return (
      <PageHeaderLayout
        title="Inventory Expiries Report"
        content="This report that shows inventory items in stock with expiries and their current balance"
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={18} sm={24}>
              {/*Filters: Location, Product, Expiry Date*/}
              <LocationSelect {...locationSelectProps} onLocationSelect={this.locationSelectHandler} />
              {/*
                <ProductSelect {...productSelectProps} onProductSelect={this.productSelectHandler} />
                <DatePicker />
              */}              
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

export default InventoryExpiriesListingView;
