import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import AdjustmentSearch from "../../fixed-assets-management/adjustment/Search";
import AdjustmentList from "../../fixed-assets-management/adjustment/List";

@connect(({ fixed_assets, loading }) => ({
  fixed_assets,
  loading: loading.effects['fixed_asset_adjustment/query'] ,
}))

class AssetAdjustmentView extends PureComponent {

  static propTypes = {
    fixed_assets: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_adjustment/query' });
  }

  render() {
    const { dispatch, fixed_assets } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = fixed_assets;

    const AdjustmentListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_asset_adjustment/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset_adjustment/delete', payload: id });
      },
    };

    const AdjustmentSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'date') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.adjustmentCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'fixed_asset_adjustment/query',
          payload,
        });
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <AdjustmentSearch {...AdjustmentSearchProps} />
            <AdjustmentList {...AdjustmentListProps} />
          </Col>
        </Row>
      </div>
    );
  }


}

export default AssetAdjustmentView;
