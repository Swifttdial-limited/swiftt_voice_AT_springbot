import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PurchaseOrdersList from '../../../components/procurement-management/purchase-orders/List';
import PurchaseOrdersSearch from '../../../components/procurement-management/purchase-orders/Search';

@connect(({ purchaseOrders, loading }) => ({
  purchaseOrders,
  loading: loading.effects['purchaseOrders/query'],
}))
class PurchaseOrdersView extends PureComponent {

  static propTypes = {
    purchaseOrders: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'purchaseOrders/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'purchaseOrders/purge' });
  }

  render() {
    const { purchaseOrders, dispatch } = this.props;
    const { loading, list, pagination, success } = purchaseOrders;

    const purchaseOrderSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'purchaseOrderNumber') {
            payload.purchaseOrderNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'purchaseOrders/query', payload });
      },
    };

    const purchaseOrderListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'purchaseOrders/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Purchase Orders"
        content="Purchase order (PO) is a document issued by a buyer to the seller, providing the information about the details of the order. That is the quantity, type of product, prices, etc."
      >
        <div className="content-inner">
          <PurchaseOrdersSearch {...purchaseOrderSearchProps} />
          <PurchaseOrdersList {...purchaseOrderListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PurchaseOrdersView;
