import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Row,
  Col,
} from 'antd';
import Ellipsis from '../../Ellipsis';
import numeral from 'numeral';
import moment from 'moment';

import { query as queryJournalEntries } from '../../../services/accounting/journals';

import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';

export default class TableForm extends PureComponent {
  static defaultProps = {
    rowSelectionEnabled: false,
  };

  static propTypes = {
    account: PropTypes.string,
    endDate: PropTypes.string,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    data: [],
    loading: false,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value.map(item => {
          item.depositAmount = item.deposit ? item.transactionAmount : 0;
          item.paymentAmount = !item.deposit ? item.transactionAmount : 0;
          
          return item;
        }),
      });
    }
  }

  fetchJournalEntries = () => {
    const { account, endDate } = this.props;

    this.setState({ loading: true });

    queryJournalEntries({
      account: account,
      endDate: endDate
    }).then((response) => {
      if(response.content) {
        const items = response.content.map(journalEntry => {
          let deposit = false;
          let transactionAccount = '';

          if(journalEntry.debitAccount.publicId !== account) {
              transactionAccount = journalEntry.debitAccount;
          } else {
              transactionAccount = journalEntry.creditAccount;
              deposit = true;
          }

          return {
            reconciled: false,
            deposit: deposit,
            depositAmount: deposit ? journalEntry.totalAmount : 0,
            paymentAmount: !deposit ? journalEntry.totalAmount : 0,
            transactionId: journalEntry.id,
            transactionType: journalEntry.journalReference.transactionType,
            transactionReferenceNumber: journalEntry.journalReference.transactionNumber,
            transactionToName: journalEntry.journalReference.description,
            transactionToAccount: transactionAccount,
            transactionDate: journalEntry.journalReference.transactionDate,
            transactionAmount: journalEntry.totalAmount,
          }
        });

        this.setState({ data: items, loading: false });
      }
    }).catch((e) => {
      this.setState({ loading: false });
    });
  }

  handleSelectAllRow = (selected, selectedRows, changeRows) => {
    if(selected) {
      selectedRows.forEach(row => this.handleSelectRow(row, selected, selectedRows));
    } else {
      changeRows.forEach(row => this.handleSelectRow(row, selected, changeRows));
    }
  }

  handleSelectRow = (record, selected, selectedRows) => {
    const { data } = this.state;

    if(selected) {
      data.forEach(item => {
        if(record.transactionId === item.transactionId) {
          item.reconciled = true;
        }
      });
    } else {
      data.forEach(item => {
        if(record.transactionId === item.transactionId) {
          item.reconciled = false;
        }
      });
    }

    this.setState({
      selectedRows: selectedRows,
      data
    }, () => {
      this.props.onChange(this.state.data);
    });
  }

  // handleSelectRows = (selectedRowKeys, selectedRows) => {
  //   const { onChange } = this.props;
  //   const { data } = this.state;
  //
  //   data.forEach(item => {
  //     item.reconciled = false;
  //   })
  //
  //   selectedRows.forEach(selectedRow => {
  //     data.forEach(item => {
  //       if(selectedRow.transactionId === item.transactionId) {
  //         item.reconciled = true;
  //       }
  //     });
  //   });
  //
  //   this.setState({ data }, () => {
  //     onChange(data);
  //   });
  // };

  render() {
    const { rowSelectionEnabled } = this.props;

    const renderTransactionType = (transactionType) => {
      switch (transactionType) {
        case 'SALES_RECEIPT':
          return <span color="grey">Sale</span>;
        case 'REFUND':
          return <span color="blue">Refund</span>;
        case 'INVOICE':
          return <span color="purple">Invoice</span>;
        case 'CUSTOMER_PAYMENT':
          return <span color="green">Customer Payment</span>;
        case 'VENDOR_PAYMENT':
          return <span color="red">Vendor Payment</span>;
        case 'BANKING_DEPOSIT':
          return <span color="red">Bank Deposit</span>;
        case 'BANKING_WITHDRAW':
          return <span color="red">Bank Withdrawal</span>;
        case 'PETTY_CASH':
          return <span color="grey">Petty Cash</span>;
        case 'EXPENSE':
          return <span color="blue">Expense</span>;
        case 'CASH_EXPENSE':
          return <span color="purple">Cash Expense</span>;
        case 'INVENTORY_QUANTITY_ADJUSTMENT':
          return <span color="green">Inv. Qty. Adjustment</span>;
        case 'STOCK_DEPRECIATION':
          return <span color="red">Stock Depreciation</span>;
        case 'GOODS_RECEIPT':
          return <span color="red">Goods Receipt</span>;
        case 'MANUAL':
          return <span color="red">Manual Entry</span>;
        case 'PATIENT_DEPOSIT':
          return <span color="blue">Patient Deposit</span>;
        case 'CREDIT_NOTE':
          return <span color="purple">Credit Note</span>;
        case 'DEBIT_NOTE':
          return <span color="green">Debit Note</span>;
        default:
          return <span color="blue">{transactionType}</span>;
      }
    };

    const columns = [
      {
        title: 'Date',
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        width: '10%',
        render: (text) => <span>{moment(text).local().format(dateFormat)}</span>,
      }, {
        title: 'Type',
        dataIndex: 'transactionType',
        key: 'transactionType',
        width: '15%',
        render: (text, record) => <span>{renderTransactionType(text)}</span>,
      }, {
        title: 'Tx Reference',
        dataIndex: 'transactionReferenceNumber',
        key: 'transactionReferenceNumber',
        width: '10%',
      }, {
        title: 'Account',
        dataIndex: 'transactionToAccount.name',
        key: 'transactionToAccount.name',
        width: '15%',
        render: (text, record) =>  <span>{text} ({record.transactionToAccount.accountNumber})</span>,
      }, {
        title: 'Payee',
        dataIndex: 'transactionToName',
        key: 'transactionToName',
        width: '20%',
        render: (text) => <span>{text ? text : null}</span>,
      }, {
        title: 'Deposit',
        dataIndex: 'depositAmount',
        key: 'depositAmount',
        align: 'right',
        render: (text, record) => (
          <span>
            {record.deposit ? `${numeral(text).format('0,0.00')}` : 0.00}
          </span>
        ),
      }, {
        title: 'Payments / Withdrawal',
        dataIndex: 'paymentAmount',
        key: 'paymentAmount',
        align: 'right',
        render: (text, record) => (
          <span>
            {!record.deposit ? `${numeral(text).format('0,0.00')}` : 0.00}
          </span>
        ),
      },
    ];

    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow,
    };

    return (
      <Fragment>
        <div>
          <Row>
            <Col offset={20} span={4} style={{ textAlign: 'right' }}>
              <Button icon="reload" onClick={this.fetchJournalEntries}>Refresh Entries</Button>
            </Col>
          </Row>
          <Table
            className={styles.table}
            loading={this.state.loading}
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            rowKey={record => record.transactionId}
            rowSelection={rowSelection}
          />
        </div>
      </Fragment>
    );
  }
}
