import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import VendorsList from '../../../components/accounts-management/vendors/List';
import VendorsSearch from '../../../components/accounts-management/vendors/Search';

@connect(({ contacts, loading }) => ({
  contacts,
  loading: loading.effects['contacts/query'],
}))
class VendorsManagementView extends PureComponent {
  static propTypes = {
    contacts: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;

    dispatch({ type: 'contacts/purge' });
    if (location.pathname === '/accounts/vendors-bills-and-payments/vendors') { dispatch({ type: 'contacts/query', payload: { isVendor: true } }); }
  }

  render() {
    const { dispatch, contacts } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = contacts;

    const vendorSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
            payload.isVendor = true;
          }
        }

        dispatch({
          type: 'contacts/query',
          payload,
        });
      },
    };

    const vendorListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'contacts/query',
          payload: {
            isVendor: true,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Vendors"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <VendorsSearch {...vendorSearchProps} />
          <VendorsList {...vendorListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorsManagementView;
