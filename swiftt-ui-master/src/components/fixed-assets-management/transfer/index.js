import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import TransferSearch from "../../fixed-assets-management/transfer/Search";
import TransferList from "../../fixed-assets-management/transfer/List";

@connect(({ fixed_asset_transfers, loading }) => ({
  fixed_asset_transfers,
  loading: loading.effects['fixed_asset_transfers/query'] ,
}))

class AssetTransferView extends PureComponent {

  static propTypes = {
    fixed_asset_transfers: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_transfers/query' });
  }

  render() {
    const { dispatch, fixed_asset_transfers } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = fixed_asset_transfers;

    const transferListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_asset_transfers/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset_transfers/delete', payload: id });
      },
    };

    const transferSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'date') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.TransferCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'fixed_asset_transfers/query',
          payload,
        });
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <TransferSearch {...transferSearchProps} />
            <TransferList {...transferListProps} />
          </Col>
        </Row>
      </div>
    );
  }


}

export default AssetTransferView;
