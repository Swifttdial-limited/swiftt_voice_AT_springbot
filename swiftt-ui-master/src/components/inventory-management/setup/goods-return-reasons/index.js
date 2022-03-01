import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card } from 'antd';

import GoodsReturnReasonList from './List';
import GoodsReturnReasonSearch from './Search';
import GoodsReturnReasonModal from './Modal';

@connect(({ goodsReturnReasons, loading }) => ({
  goodsReturnReasons,
  loading: loading.effects['goodsReturnReasons/query'],
}))
class GoodsReturnReasonsView extends PureComponent {
  static propTypes = {
    goodsReturnReasons: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'goodsReturnReasons/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'goodsReturnReasons/purge' });
  }

  render() {
    const { dispatch, goodsReturnReasons } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = goodsReturnReasons;

    const goodsReturnReasonModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `goodsReturnReasons/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'goodsReturnReasons/hideModal' });
      },
    };

    const goodsReturnReasonListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'goodsReturnReasons/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'goodsReturnReasons/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'goodsReturnReasons/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const goodsReturnReasonSearchProps = {
      onSearch(fieldsValue) {
      },
      onAdd() {
        dispatch({
          type: 'goodsReturnReasons/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const GoodsReturnReasonModalGen = () => <GoodsReturnReasonModal {...goodsReturnReasonModalProps} />;

    return (
      <div className="content-inner">
        <GoodsReturnReasonSearch {...goodsReturnReasonSearchProps} />
        <GoodsReturnReasonList {...goodsReturnReasonListProps} />
        <GoodsReturnReasonModalGen />
      </div>
    );
  }
}

export default GoodsReturnReasonsView;
