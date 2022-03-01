import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StockTakeListsList from '../../../components/fixed-assets-management/stock-take-lists/List';
import StockTakeListsSearch from '../../../components/fixed-assets-management/stock-take-lists/Search';

@connect(({ assetStockTakeLists, loading }) => ({
  assetStockTakeLists,
  loading: loading.effects['assetStockTakeLists/query'],
}))
class StockTakeListsView extends PureComponent {
  static propTypes = {
    assetStockTakeLists: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'assetStockTakeLists/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'assetStockTakeLists/purge' });
  }

  render() {
    const { assetStockTakeLists, dispatch } = this.props;
    const { loading, list, pagination, success } = assetStockTakeLists;

    const stockTakeListSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'stockTakeListNumber') {
            payload.stockTakeListNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'assetStockTakeLists/query', payload });
      },
    };

    const stockTakeListListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'assetStockTakeLists/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Asset Count"
        content="Stock taking is the process of counting, weighing or otherwise calculating all items in stock and recording the results."
      >
        <div className="content-inner">
          <StockTakeListsSearch {...stockTakeListSearchProps} />
          <StockTakeListsList {...stockTakeListListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default StockTakeListsView;
