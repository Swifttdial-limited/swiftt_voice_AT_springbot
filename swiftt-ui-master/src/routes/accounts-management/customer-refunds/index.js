import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CustomerRefundsList from '../../../components/accounts-management/customer-refunds/List';
import CustomerRefundsSearch from '../../../components/accounts-management/customer-refunds/Search';

@connect(({ customerRefunds, loading }) => ({
  customerRefunds,
  loading: loading.effects['customerRefunds/query'],
}))
class CustomerRefundsView extends PureComponent {

  static propTypes = {
    customerRefunds: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customerRefunds/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customerRefunds/purge' });
  }

  render() {
    const { customerRefunds, dispatch } = this.props;
    const { loading, list, pagination, success } = customerRefunds;

    const customerRefundSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'customerRefundNumber') {
            payload.customerRefundNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'customerRefunds/query', payload });
      },
    };

    const customerRefundListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'customerRefunds/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Customer Refunds"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <CustomerRefundsSearch {...customerRefundSearchProps} />
          <CustomerRefundsList {...customerRefundListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CustomerRefundsView;
