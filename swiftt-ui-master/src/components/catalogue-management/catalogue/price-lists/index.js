import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PriceListList from './List';
import PriceListSearch from './Search';
import PriceListModal from './Modal';

@connect(({ catalogue_price_lists, loading }) => ({
  catalogue_price_lists,
  loading: loading.effects['catalogue_price_lists/query'],
}))
class PriceListsView extends PureComponent {

  static defaultProps = {
    catalogue_price_lists: {},
  };

  static propTypes = {
    catalogue_price_lists: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_price_lists/query' });
  }

  render() {
    const { dispatch, catalogue_price_lists } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_price_lists;

    const priceListModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_price_lists/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_price_lists/hideModal' });
      },
    };

    const priceListListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_price_lists/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_price_lists/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_price_lists/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const priceListSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_price_lists/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_price_lists/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const PriceListModalGen = () => <PriceListModal {...priceListModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <PriceListSearch {...priceListSearchProps} />
            <PriceListList {...priceListListProps} />

            <PriceListModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PriceListsView;
