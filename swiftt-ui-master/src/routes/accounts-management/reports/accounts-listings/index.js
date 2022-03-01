import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Button, Col } from 'antd';
import arrayToTree from 'array-to-tree';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';

import styles from './index.less';

@connect(({ accounts, loading }) => ({
  accounts,
  loading: loading.effects['accounts/query'],
}))
class AccountsListingReportView extends PureComponent {
  state = {
    accountsTree: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'accounts/query',
      payload: {
        size: 2000,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts && nextProps.accounts.list) {
      this.setState({ accountsTree: this.generateTree(nextProps.accounts.list) });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'accounts/purge' });
  }

  generateTree = (accounts) => {
    return arrayToTree(accounts, {
      parentProperty: 'parentAccount.publicId',
      customID: 'publicId',
    });
  }
  printOpen =() => {
    console.log('am here am done');
  }
  handlePrintAccountListing = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'accounts/printAccountsListings',
      payload: {
        format: 'PDF',
      },
    });
  }

  render() {
    const { accounts } = this.props;
    const { loading } = accounts;

    const { accountsTree } = this.state;

    const columns = [
      {
        title: 'Account No.',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Account Type',
        dataIndex: 'parentAccount.name',
        key: 'parentAccount.name',
      }, {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
    ];


    return (
      <PageHeaderLayout
        title="Accounts Listing"
        content="Form pages are used to collect or verify information from users. Basic orms are common to form scenes with fewer data items."
        action={<Button type="primary" onClick={this.handlePrintAccountListing} icon="printer">Print</Button>}
      >
        <Card loading={loading} bordered={false}>
          <Table
            dataSource={accountsTree}
            columns={columns}
            rowKey={record => record.publicId}
            // defaultExpandAllRows={true}
            loading={loading}
            pagination={false}
            size="middle"
            bordered
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default AccountsListingReportView;
