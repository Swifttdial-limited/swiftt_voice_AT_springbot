import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import GoodsReturnsList from '../../../components/inventory-management/goods-returns/List';
import GoodsReturnsSearch from '../../../components/inventory-management/goods-returns/Search';
import ViewDescription from '../../../components/common/ViewDescription';

@connect(({ goodsReturns, loading }) => ({
  goodsReturns,
  loading: loading.effects['goodsReturns/query']
}))
class goodsReturnsView extends PureComponent {

  static propTypes = {
    goodsReturns: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'goodsReturns/query' });
  }

  render() {
    const { goodsReturns, dispatch } = this.props;
    const { loading, list, pagination, success } = goodsReturns;

    const goodsReturnSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'goodsReturnNumber') {
            payload.goodsReturnNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'goodsReturns/query', payload });
      },
    };

    const goodsReturnListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'goodsReturns/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Goods Returns"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <GoodsReturnsSearch {...goodsReturnSearchProps} />
          <GoodsReturnsList {...goodsReturnListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default goodsReturnsView;
