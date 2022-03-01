import PropTypes from 'prop-types';
import React from 'react';
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Collapse,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';

const Panel = Collapse.Panel;

const dateFormat = 'YYYY-MM-DD';

function BankReconciliationView({
  bankReconciliation,
  currency,
}) {

  /**
    * Calculate totals
    *
    **/
  let clearedDeposits = { total: 0, count: 0, items: [] };
  let clearedPayments = { total: 0, count: 0, items: [] };
  let unclearedDeposits = { total: 0, count: 0, items: [] };
  let unclearedPayments = { total: 0, count: 0, items: [] };

  bankReconciliation.items.forEach((item) => {
    if(item.reconciled) {
      if(item.deposit) {
        clearedDeposits.total += item.transactionAmount;
        clearedDeposits.count += 1;
        clearedDeposits.items.push(item);
      } else {
        clearedPayments.total += item.transactionAmount;
        clearedPayments.count += 1;
        clearedPayments.items.push(item);
      }
    } else {
      if(item.deposit) {
        unclearedDeposits.total += item.transactionAmount;
        unclearedDeposits.count += 1;
        unclearedDeposits.items.push(item);
      } else {
        unclearedPayments.total += item.transactionAmount;
        unclearedPayments.count += 1;
        unclearedPayments.items.push(item);
      }
    }
  });

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
      width: '25%',
      render: (text, record) => <span>{renderTransactionType(text)}</span>,
    }, {
      title: 'Transaction Reference',
      dataIndex: 'transactionReferenceNumber',
      key: 'transactionReferenceNumber',
      width: '10%',
    }, {
      title: 'Account',
      dataIndex: 'transactionToAccount.name',
      key: 'transactionToAccount.name',
      width: '25%',
      render: (text, record) =>  <span>{text} ({record.transactionToAccount ? record.transactionToAccount.accountNumber : null})</span>,
    }, {
      title: 'Payee',
      dataIndex: 'transactionToName',
      key: 'transactionToName',
      width: '20%',
      render: (text) => <span>{text ? text : null}</span>,
    }, {
      title: 'Amount (' + currency + ')',
      dataIndex: 'transactionAmount',
      key: 'transactionAmount',
      align: 'right',
      render: (text, record) => (
        <span>
          {`${numeral(text ? text.toLocaleString() : text).format('0,0.00')}`}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ fontWeight: '600' }}>
        <Row gutter={24}>
          <Col span={18}><span>Statement beginning balance</span></Col>
          <Col span={6}><span>{currency} {numeral(bankReconciliation.beginningBalance).format('0,0.00')}</span></Col>
        </Row>
        <Row gutter={24}>
          <Col span={18}><span>Checks and payments cleared ({clearedPayments.count})</span></Col>
          <Col span={6}><span>{currency} -{numeral(clearedPayments.total).format('0,0.00')}</span></Col>
        </Row>
        <Row gutter={24}>
          <Col span={18}><span>Deposits and other credits cleared ({clearedDeposits.count})</span></Col>
          <Col span={6}><span>{currency} {numeral(clearedDeposits.total).format('0,0.00')}</span></Col>
        </Row>
        <Row gutter={24}>
          <Col span={18}><span>Statement ending balance</span></Col>
          <Col span={6}><span><u>{currency} {numeral(bankReconciliation.statementEndingBalance).format('0,0.00')}</u></span></Col>
        </Row>
        <br />
        <Row gutter={24}>
          <Col span={18}><span>Uncleared transactions as of {moment(bankReconciliation.statementEndingDate).format(dateFormat)}</span></Col>
          <Col span={6}><span>{currency} -{numeral(unclearedDeposits.total + unclearedPayments.total).format('0,0.00')}</span></Col>
        </Row>
        <Row gutter={24}>
          <Col span={18}><span>Register balance as of {moment(bankReconciliation.statementEndingDate).format(dateFormat)}</span></Col>
          <Col span={6}><span><u>{currency} {numeral(bankReconciliation.statementEndingBalance - (unclearedDeposits.total + unclearedPayments.total)).format('0,0.00')}</u></span></Col>
        </Row>
      </Card>

      <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
        <Panel header={"Checks and Payments cleared (" + clearedPayments.count + ")"} key="1">
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            dataSource={clearedPayments.items}
            columns={columns}
            rowKey="transactionId"
          />
        </Panel>
        <Panel header={"Deposits and other credits cleared (" + clearedDeposits.count + ")" } key="2">
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            dataSource={clearedDeposits.items}
            columns={columns}
            rowKey="transactionId"
          />
        </Panel>
        <Panel header={"Uncleared checks and payments as of " + moment(bankReconciliation.statementEndingDate).format(dateFormat) } key="3">
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            dataSource={unclearedPayments.items}
            columns={columns}
            rowKey="transactionId"
          />
        </Panel>
        <Panel header={"Uncleared deposits and other credits as of " + moment(bankReconciliation.statementEndingDate).format(dateFormat) } key="4">
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            dataSource={unclearedDeposits.items}
            columns={columns}
            rowKey="transactionId"
          />
        </Panel>
      </Collapse>

      <br />
    </div>
  );
}

BankReconciliationView.propTypes = {
  bankReconciliation: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
};

export default BankReconciliationView;
