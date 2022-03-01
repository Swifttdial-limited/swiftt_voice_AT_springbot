import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import BinLocationList from './List';
import BinLocationSearch from './Search';
import BinLocationModal from './Modal';

@connect(({ binLocations, loading }) => ({
  binLocations,
  loading: loading.effects['binLocations/query'],
}))
class BinLocationsView extends PureComponent {
  static defaultProps = {
    binLocations: {},
  };

  static propTypes = {
    binLocations: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'binLocations/query' });
  }

  render() {
    const { dispatch, binLocations } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = binLocations;

    const binLocationModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({
          type: `binLocations/${modalType}`,
          payload: Object.assign({}, currentItem, data),
        });
      },
      onCancel() {
        dispatch({ type: 'binLocations/hideModal' });
      },
    };

    const binLocationListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'binLocations/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'binLocations/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'binLocations/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const binLocationSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'binLocations/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'binLocations/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const BinLocationModalGen = () => <BinLocationModal {...binLocationModalProps} />;

    return (
      <div className="content-inner">
        <BinLocationSearch {...binLocationSearchProps} />
        <BinLocationList {...binLocationListProps} />
        <BinLocationModalGen />
      </div>
    );
  }
}

export default BinLocationsView;
