import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card } from 'antd';

import ReorderLevelList from './List';
import ReorderLevelSearch from './Search';
import ReorderLevelModal from './Modal';

@connect(({ reorderLevels, loading }) => ({
  reorderLevels,
  loading: loading.effects['reorderLevels/query'],
}))
class ReorderLevelsView extends PureComponent {
  static propTypes = {
    reorderLevels: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reorderLevels/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reorderLevels/purge' });
  }

  render() {
    const { dispatch, reorderLevels } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = reorderLevels;

    const reorderLevelModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `reorderLevels/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'reorderLevels/hideModal' });
      },
    };

    const reorderLevelListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'reorderLevels/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'reorderLevels/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'reorderLevels/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const reorderLevelSearchProps = {
      onSearch(fieldsValue) {
      },
      onAdd() {
        dispatch({
          type: 'reorderLevels/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ReorderLevelModalGen = () => <ReorderLevelModal {...reorderLevelModalProps} />;

    return (
      <div className="content-inner">
        <ReorderLevelSearch {...reorderLevelSearchProps} />
        <ReorderLevelList {...reorderLevelListProps} />
        <ReorderLevelModalGen />
      </div>
    );
  }
}

export default ReorderLevelsView;
