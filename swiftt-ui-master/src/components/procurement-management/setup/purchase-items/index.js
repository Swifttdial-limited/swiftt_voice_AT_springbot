import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card } from 'antd';

import PurchaseItemList from './List';
import PurchaseItemSearch from './Search';
import PurchaseItemModal from './Modal';

@connect(({ purchaseItems, loading }) => ({
  purchaseItems,
  loading: loading.effects['purchaseItems/query'],
}))
class PurchaseItemsView extends PureComponent {
  static propTypes = {
    purchaseItems: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'purchaseItems/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'purchaseItems/purge' });
  }

  render() {
    const { dispatch, purchaseItems } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = purchaseItems;

    const purchaseItemModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `purchaseItems/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'purchaseItems/hideModal' });
      },
    };

    const purchaseItemListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'purchaseItems/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'purchaseItems/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'purchaseItems/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const purchaseItemSearchProps = {
      onSearch(fieldsValue) {
      },
      onAdd() {
        dispatch({
          type: 'purchaseItems/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const PurchaseItemModalGen = () => <PurchaseItemModal {...purchaseItemModalProps} />;

    return (
      <div className="content-inner">
        <Card title="Vendor Purchase Items">
          <PurchaseItemSearch {...purchaseItemSearchProps} />
          <PurchaseItemList {...purchaseItemListProps} />
          <PurchaseItemModalGen />
        </Card>
      </div>
    );
  }
}

export default PurchaseItemsView;
