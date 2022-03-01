import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import VendorBillsList from '../../../components/accounts-management/vendor-bills/List';
import VendorBillsSearch from '../../../components/accounts-management/vendor-bills/Search';

@connect(({ vendorBills, loading }) => ({
  vendorBills,
  loading: loading.effects['vendorBills/query'],
}))
class VendorBillsView extends PureComponent {
  static propTypes = {
    vendorBills: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'vendorBills/query' });
  }

  render() {
    const { vendorBills, dispatch } = this.props;
    const { loading, list, pagination, success } = vendorBills;

    const vendorBillSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'vendorBillNumber') {
            payload.vendorBillNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'vendorBills/query', payload });
      },
    };

    const vendorBillListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'vendorBills/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Vendor Bills"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <VendorBillsSearch {...vendorBillSearchProps} />
          <VendorBillsList {...vendorBillListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorBillsView;
