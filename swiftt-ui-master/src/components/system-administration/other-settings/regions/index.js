import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import RegionList from './List';
import RegionSearch from './Search';
import RegionModal from './Modal';

@connect(({ regions, loading }) => ({
  regions,
  loading: loading.effects['regions/query'],
}))
class RegionsView extends PureComponent {
  static propTypes = {
    regions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'regions/query' });
  }

  render() {
    const { dispatch, regions } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = regions;

    const regionModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `regions/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'regions/hideModal' });
      },
    };

    const regionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'regions/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'regions/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'regions/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const regionSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'regions/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'regions/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const RegionModalGen = () => <RegionModal {...regionModalProps} />;

    return (
      <Card title="Regions">
        <RegionSearch {...regionSearchProps} />
        <RegionList {...regionListProps} />
        <RegionModalGen />
      </Card>
    );
  }
}

export default RegionsView;
