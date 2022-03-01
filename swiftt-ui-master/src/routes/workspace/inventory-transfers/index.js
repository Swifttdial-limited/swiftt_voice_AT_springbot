import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import InventoryTransfersList from '../../../components/common/inventory/inventory-transfers/List';
import InventoryTransfersSearch from '../../../components/common/inventory/inventory-transfers/Search';

@connect(({ inventoryTransfers, loading }) => ({
  inventoryTransfers,
  loading: loading.effects['inventoryTransfers/query'],
}))
class InventoryTransfersView extends PureComponent {
  static propTypes = {
    inventoryTransfers: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryTransfers/query',
      payload: {
        departmental: true,
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryTransfers/purge' });
  }

  render() {
    const { inventoryTransfers, dispatch } = this.props;
    const { loading, list, pagination, success } = inventoryTransfers;

    const inventoryTransferSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'inventoryTransferNumber') {
            payload.departmental = true;
            payload.inventoryTransferNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'inventoryTransfers/query', payload });
      },
    };

    const inventoryTransferListProps = {
      dataSource: list,
      loading,
      pagination,
      workspace: true,
      onPageChange(page) {
        dispatch({ type: 'inventoryTransfers/query',
          payload: {
            departmental: true,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Inventory Transfers"
        content="Records the transfer of inventory to a new location from another location."
      >
        <div className="content-inner">
          <InventoryTransfersSearch {...inventoryTransferSearchProps} />
          <InventoryTransfersList {...inventoryTransferListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default InventoryTransfersView;
