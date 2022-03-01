import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import StocktakeSearch from "../../fixed-assets-management/inventory/Search";
import StockTakeList from "../../fixed-assets-management/inventory/List";

@connect(({ fixed_assets, loading }) => ({
  fixed_assets,
  loading: loading.effects['fixed_asset_stocktakes/query'] ,
}))

class AssetStocktakeView extends PureComponent {

  static propTypes = {
    fixed_assets: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_stocktakes/query' });
  }

  render() {
    const { dispatch, fixed_assets } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = fixed_assets;

    const StockTakeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_asset_stocktakes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset_stocktakes/delete', payload: id });
      },
    };

    const StocktakeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'date') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.StocktakeCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'fixed_asset_stocktakes/query',
          payload,
        });
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <StocktakeSearch {...StocktakeSearchProps} />
            <StockTakeList {...StockTakeListProps} />
          </Col>
        </Row>
      </div>
    );
  }


}

export default AssetStocktakeView;
