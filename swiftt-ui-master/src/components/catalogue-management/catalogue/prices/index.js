import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PriceList from './List';
import PriceSearch from './Search';

@connect(({ catalogue_prices, loading }) => ({
  catalogue_prices,
  loading: loading.effects['catalogue_prices/query']
}))
class PricesView extends PureComponent {

  static defaultProps = {
    catalogue_prices: {},
  };

  static propTypes = {
    catalogue_prices: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_prices/query' });
  }

  render() {
    const { dispatch, catalogue_prices } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = catalogue_prices;

    const priceListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_prices/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_prices/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_prices/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const priceSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.productName = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.productCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_prices/query',
          payload,
        });
      },
      onBulkAdd() {
        dispatch(routerRedux.push('/catalogue/prices/create'));
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <PriceSearch {...priceSearchProps} />
            <PriceList {...priceListProps} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PricesView;
