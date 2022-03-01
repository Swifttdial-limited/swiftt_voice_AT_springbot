import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import AssetSearch from "../../fixed-assets-management/report/Search";
import AssetList from "../../fixed-assets-management/report/List";

@connect(({ fixed_assets, loading }) => ({
  fixed_assets,
  loading: loading.effects['fixed_assets/query'] ,
}))

class AssetsView extends PureComponent {

  static propTypes = {
    fixed_assets: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_assets/query' });
  }

  render() {
    const { dispatch, fixed_assets } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = fixed_assets;

    const assetListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_assets/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset/delete', payload: id });
      },
    };

    const assetSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'assetCode') {
            payload.assetCode = fieldsValue.keyword;
          } else if (fieldsValue.field === 'customAssetCode') {
            payload.customAssetCode = fieldsValue.keyword;
          }
        }
        dispatch({
          type: 'fixed_assets/query',
          payload,
        });
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <AssetSearch {...assetSearchProps} />
            <AssetList {...assetListProps} />
          </Col>
        </Row>
      </div>
    );
  }


}

export default AssetsView;
