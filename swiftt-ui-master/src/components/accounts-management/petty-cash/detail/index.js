import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Table } from 'antd';
import DescriptionList from '../../../DescriptionList';
import numeral from 'numeral';

const { Description } = DescriptionList;

@connect(({ banking, loading }) => ({
  banking,
  loading: loading.effects['banking/query'],
}))
class JournalDetail extends PureComponent {
  componentDidMount() {
    const { dispatch, journalReference } = this.props;
    dispatch({
      type: 'banking/fetchBankingEntryLines',
      payload: { id: journalReference.id },
    });
  }

  render() {
    const { banking, journalReference } = this.props;
    const { success, loading } = banking;
    const bankingLines = (!loading && success && banking[journalReference.id] ? banking[journalReference.id] : {
      list: [],
      pagination: {},
    });
  

    const columns = [{
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: 'Debit Account',
      dataIndex: 'debitAccount.name',
      key: 'debitAccount.name',
    }, {
      title: 'Credit Account',
      dataIndex: 'creditAccount.name',
      key: 'creditAccount.name',
    }, {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      render: (text, record) => <span>{numeral(text).format('0,0.00')}</span>,
    }];
  
    return (
      <div className="content-inner">
        {!loading && success &&
          <Table size="middle" dataSource={bankingLines.list} pagination={bankingLines.pagination} columns={columns} />
        }
      </div>
    );
  }
}

export default JournalDetail;
