import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card } from 'antd';

import InventoryAdjustmentReasonList from './List';
import InventoryAdjustmentReasonSearch from './Search';
import InventoryAdjustmentReasonModal from './Modal';

@connect(({ inventoryAdjustmentReasons, loading }) => ({
  inventoryAdjustmentReasons,
  loading: loading.effects['inventoryAdjustmentReasons/query'],
}))
class InventoryAdjustmentReasonsView extends PureComponent {
  static propTypes = {
    inventoryAdjustmentReasons: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryAdjustmentReasons/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryAdjustmentReasons/purge' });
  }

  render() {
    const { dispatch, inventoryAdjustmentReasons } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = inventoryAdjustmentReasons;

    const inventoryAdjustmentReasonModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `inventoryAdjustmentReasons/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'inventoryAdjustmentReasons/hideModal' });
      },
    };

    const inventoryAdjustmentReasonListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'inventoryAdjustmentReasons/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'inventoryAdjustmentReasons/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'inventoryAdjustmentReasons/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const inventoryAdjustmentReasonSearchProps = {
      onSearch(fieldsValue) {
      },
      onAdd() {
        dispatch({
          type: 'inventoryAdjustmentReasons/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const InventoryAdjustmentReasonModalGen = () => <InventoryAdjustmentReasonModal {...inventoryAdjustmentReasonModalProps} />;

    return (
      <div className="content-inner">
        <InventoryAdjustmentReasonSearch {...inventoryAdjustmentReasonSearchProps} />
        <InventoryAdjustmentReasonList {...inventoryAdjustmentReasonListProps} />
        <InventoryAdjustmentReasonModalGen />
      </div>
    );
  }
}

export default InventoryAdjustmentReasonsView;
