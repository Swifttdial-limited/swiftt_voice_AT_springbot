import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CustomerPaymentsList from '../../../components/accounts-management/customer-payments/List';
import CustomerPaymentsSearch from '../../../components/accounts-management/customer-payments/Search';

@connect(({ customerPayments, loading }) => ({
  customerPayments,
  loading: loading.effects['customerPayments/query'],
}))
class CustomerPaymentsView extends PureComponent {
  static propTypes = {
    customerPayments: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customerPayments/query' });
  }

  render() {
    const { customerPayments, dispatch } = this.props;
    const { loading, list, pagination, success } = customerPayments;

    const customerPaymentSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'customerPaymentNumber') {
            payload.customerPaymentNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'customerPayments/query', payload });
      },
    };

    const customerPaymentListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'customerPayments/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Customer Payments"
        // content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <CustomerPaymentsSearch {...customerPaymentSearchProps} />
          <CustomerPaymentsList {...customerPaymentListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CustomerPaymentsView;
