import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StockTakeListsList from '../../../components/inventory-management/stock-take-lists/List';
import StockTakeListsSearch from '../../../components/inventory-management/stock-take-lists/Search';

@connect(({ stockTakeLists, loading }) => ({
  stockTakeLists,
  loading: loading.effects['stockTakeLists/query'],
}))
class StockTakeListsView extends PureComponent {
  static propTypes = {
    stockTakeLists: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'stockTakeLists/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'stockTakeLists/purge' });
  }

  render() {
    const { stockTakeLists, dispatch } = this.props;
    const { loading, list, pagination, success } = stockTakeLists;

    const stockTakeListSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'stockTakeListNumber') {
            payload.stockTakeListNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'stockTakeLists/query', payload });
      },
    };

    const stockTakeListListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'stockTakeLists/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Stock Take"
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
