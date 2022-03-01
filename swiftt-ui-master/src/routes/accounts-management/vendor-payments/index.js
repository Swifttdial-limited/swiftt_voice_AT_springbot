import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import VendorPaymentsList from '../../../components/accounts-management/vendor-payments/List';
import VendorPaymentsSearch from '../../../components/accounts-management/vendor-payments/Search';

@connect(({ vendorPayments, loading }) => ({
  vendorPayments,
  loading: loading.effects['vendorPayments/query'],
}))
class VendorPaymentsView extends PureComponent {
  static propTypes = {
    vendorPayments: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'vendorPayments/query' });
  }

  render() {
    const { vendorPayments, dispatch } = this.props;
    const { loading, list, pagination, success } = vendorPayments;

    const vendorPaymentSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'vendorPaymentNumber') {
            payload.vendorPaymentNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'vendorPayments/query', payload });
      },
    };

    const vendorPaymentListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'vendorPayments/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Vendor Payments"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <VendorPaymentsSearch {...vendorPaymentSearchProps} />
          <VendorPaymentsList {...vendorPaymentListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorPaymentsView;
