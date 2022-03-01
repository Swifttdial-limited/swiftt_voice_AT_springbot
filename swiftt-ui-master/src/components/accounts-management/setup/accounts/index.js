import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import AccountList from './List';
import AccountSearch from './Search';
import AccountModal from './Modal';

@connect(({ accounts, loading }) => ({
  accounts,
  loading: loading.effects['accounts/query'],
}))
class AccountsView extends PureComponent {

  static defaultProps = {
    accounts: {},
  };

  static propTypes = {
    accounts: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'accounts/query', payload: { accountCategory: false, size: 2000 } });
  }

  render() {
    const { dispatch, accounts } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      accountModalVisible,
      accountModalType,
    } = accounts;

    const accountModalProps = {
      item: accountModalType === 'create' ? {} : currentItem,
      type: accountModalType,
      visible: accountModalVisible,
      onOk(data) {
        dispatch({ type: `accounts/${accountModalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'accounts/hideAccountModal' });
      },
    };

    const accountListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'accounts/query',
          payload: {
            accountCategory: false,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'accounts/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'accounts/showAccountModal',
          payload: {
            accountModalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const accountSearchProps = {
      onSearch(fieldsValue) {
        const payload = {
          accountCategory: false
        };

        if (fieldsValue.isControlAccount) { payload.isControlAccount = fieldsValue.isControlAccount; }

        if (fieldsValue.isVisible) { payload.isVisible = fieldsValue.isVisible; }

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          } else if (fieldsValue.field === 'accountNumber') {
            payload.accountNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'accounts/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'accounts/showAccountModal',
          payload: {
            accountModalType: 'create',
          },
        });
      },
    };

    const AccountModalGen = () => <AccountModal {...accountModalProps} />;

    return (
      <Card title="Chart of Accounts">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <AccountSearch {...accountSearchProps} />
            <AccountList {...accountListProps} />
            <AccountModalGen />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default AccountsView;
