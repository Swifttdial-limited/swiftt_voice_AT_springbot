import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import DisposalSearch from "../../fixed-assets-management/disposal/Search";
import DisposalList from "../../fixed-assets-management/disposal/List";

@connect(({ fixed_assets, loading }) => ({
  fixed_assets,
  loading: loading.effects['fixed_asset_disposal/query'] ,
}))

class AssetDisposalView extends PureComponent {

  static propTypes = {
    fixed_assets: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_disposal/query' });
  }

  render() {
    const { dispatch, fixed_assets } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = fixed_assets;

    const DisposalListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_asset_disposal/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset_disposal/delete', payload: id });
      },
    };

    const DisposalSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'date') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.DisposalCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'fixed_asset_disposal/query',
          payload,
        });
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <DisposalSearch {...DisposalSearchProps} />
            <DisposalList {...DisposalListProps} />
          </Col>
        </Row>
      </div>
    );
  }


}

export default AssetDisposalView;
