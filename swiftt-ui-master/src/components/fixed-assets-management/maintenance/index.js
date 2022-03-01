import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import MaintenanceSearch from "../../fixed-assets-management/maintenance/Search";
import MaintenanceList from "../../fixed-assets-management/maintenance/List";

@connect(({ fixed_asset_maintenances, loading }) => ({
  fixed_asset_maintenances,
  loading: loading.effects['fixed_asset_maintenances/query'] ,
}))

class AssetMaintenanceView extends PureComponent {

  static propTypes = {
    fixed_asset_maintenances: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_maintenances/query' });
  }

  render() {
    const { dispatch, fixed_asset_maintenances } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem
    } = fixed_asset_maintenances;

    const maintenanceListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_asset_maintenances/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset_maintenances/delete', payload: id });
      },
    };

    const maintenanceSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'date') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.MaintenanceCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'fixed_asset_maintenances/query',
          payload,
        });
      },
    };

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <MaintenanceSearch {...maintenanceSearchProps} />
            <MaintenanceList {...maintenanceListProps} />
          </Col>
        </Row>
      </div>
    );
  }


}

export default AssetMaintenanceView;
