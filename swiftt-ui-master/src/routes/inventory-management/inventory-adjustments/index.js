import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import InventoryAdjustmentsList from '../../../components/inventory-management/inventory-adjustments/List';
import InventoryAdjustmentsSearch from '../../../components/inventory-management/inventory-adjustments/Search';

@connect(({ inventoryAdjustments, loading }) => ({
  inventoryAdjustments,
  loading: loading.effects['inventoryAdjustments/query'],
}))
class InventoryAdjustmentsView extends PureComponent {
  static propTypes = {
    inventoryAdjustments: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryAdjustments/query',
      payload: {
        natures: ["MANUAL"]
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryAdjustments/purge' });
  }

  render() {
    const { inventoryAdjustments, dispatch } = this.props;
    const { loading, list, pagination, success } = inventoryAdjustments;

    const inventoryAdjustmentSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'inventoryAdjustmentNumber') {
            payload.inventoryAdjustmentNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'inventoryAdjustments/query', payload });
      },
    };

    const inventoryAdjustmentListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'inventoryAdjustments/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Inventory Adjustments"
        content="inventory adjustments, records the adjustment of inventory within a location."
      >
        <div className="content-inner">
          <InventoryAdjustmentsSearch {...inventoryAdjustmentSearchProps} />
          <InventoryAdjustmentsList {...inventoryAdjustmentListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default InventoryAdjustmentsView;
