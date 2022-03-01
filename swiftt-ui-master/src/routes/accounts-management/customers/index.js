import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CustomersList from '../../../components/accounts-management/customers/List';
import CustomersSearch from '../../../components/accounts-management/customers/Search';
import styles from './index.less';

@connect(({ contacts, loading }) => ({
  contacts,
  loading: loading.effects['contacts/query'],
}))
class CustomersManagementView extends PureComponent {
  static propTypes = {
    contacts: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'contacts/purge' });
    dispatch({ type: 'contacts/query', payload: { isCustomer: true } });
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

    const customerSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
            payload.isCustomer = true;
          }
        }

        dispatch({
          type: 'contacts/query',
          payload,
        });
      },
    };

    const customerListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'contacts/query',
          payload: {
            isCustomer: true,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Customers"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <CustomersSearch {...customerSearchProps} />
          <CustomersList {...customerListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CustomersManagementView;
