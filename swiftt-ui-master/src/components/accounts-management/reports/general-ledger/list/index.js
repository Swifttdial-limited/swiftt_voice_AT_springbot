import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Table, DatePicker, Row, Col, Tag } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import { fetchGeneralLedger } from '../../../../../services/accounting/reports';

const displayDateFormat = 'DD MMM YYYY';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
let cumulativeTotal = {
  debitTotal: 0,
  creditTotal: 0,
};
let positionDebitCredit = [];
class GeneralLedgerList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      payeeAccount: {},
      dataSource: [],
    };
  }


  componentDidMount() {
    this.getReportData();
  }

  componentDidUpdate(prevProps) {
    const { publicId } = this.props;
    if (publicId !== prevProps.publicId) {
      this.getReportData(publicId);
    }
  }


  getReportData = () => {
    this.clearData();
    const { publicId } = this.props;
    this.setState({ loading: true });
    fetchGeneralLedger({ publicId }).then((response) => {
      this.setState({
        loading: false,
        dataSource: response,
      });
    }).catch(() => {
      this.setState({
        loading: false,
        dataSource: [],
      });
    });
  }
  clearData =() => {
    cumulativeTotal = {
      debitTotal: 0,
      creditTotal: 0,
    };
    positionDebitCredit = [];
    this.setState({
      loading: false,
      dataSource: [],
    });

  }

  calculateItemsAggregate = (dataset) => {
    cumulativeTotal = dataset.reduce((tot, arr) => {
      return {
        debitTotal: tot.debitTotal + cumulativeTotal.debitTotal + arr.debitAmount,
        creditTotal: tot.creditTotal + cumulativeTotal.creditTotal + arr.creditAmount,
      }
    }, { debitTotal: 0, creditTotal: 0 });
    return cumulativeTotal;
  };



  render() {
    const {  dataSource, loading } = this.state;
    

    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item) => {
        let newItem = { ...item, debitFormated: false, creditFormated: false };
        if (item.creditAmount < 0) {
          newItem.debitAmount = (item.creditAmount * -1);
          newItem.creditAmount = 0;
          newItem.creditFormated = true;
        }
        if (item.debitAmount < 0) {
          newItem.creditAmount = (item.debitAmount * -1);
          newItem.debitAmount = 0;
          newItem.debitFormated = true;
        }
        positionDebitCredit.push(newItem);
      });

    }


    const renderTransactionTypeTag = (status) => {
      switch (status) {
        case 'SALES_RECEIPT':
          return <Tag color="grey">SALE RECEIPT</Tag>;
        case 'REFUND':
          return <Tag color="blue">REFUND</Tag>;
        case 'INVOICE':
          return <Tag color="purple">INVOICE</Tag>;
        case 'CUSTOMER_PAYMENT':
          return <Tag color="green">CUSTOMER PAYMENT</Tag>;
        case 'BANKING_DEPOSIT':
          return <Tag color="red">BANKING DEPOSIT</Tag>;
        case 'BANKING_WITHDRAW':
          return <Tag color="red">BANKING WITHDWAL</Tag>;
        case 'EXPENSE':
          return <Tag color="red">EXPENSE</Tag>;
        case 'CASH_EXPENSE':
          return <Tag color="red">CASH ZEXPENSE</Tag>;
        case 'EXPENSE':
          return <Tag color="red">EXPENSE</Tag>;
        case 'INVENTORY_QUANTITY_ADJUSTMENT':
          return <Tag color="red">INVENTORY QUANTITY ADJUSTMENT</Tag>;
        case 'STOCK_DEPRECIATION':
          return <Tag color="red">STOCK DEPRECIATION</Tag>;
        case 'GOODS_RECEIPT':
          return <Tag color="red">GOOD RECEIPT</Tag>;
        case 'SERVICE_RECEIPT':
          return <Tag color="red">SERVICE RECEIPT</Tag>;
        case 'MANUAL':
          return <Tag color="red">MANUAL</Tag>;
        case 'PATIENT_DEPOSIT':
          return <Tag color="blue">PATIENT DEPOSIT</Tag>;
        case 'CREDIT_NOTE':
          return <Tag color="red">CREDIT NOTE</Tag>;
        case 'DEBIT_NOTE':
          return <Tag color="red">DEBIT NOTE</Tag>;
        case 'PETTY_CASH':
          return <Tag color="red">PETTY CASH</Tag>;

        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
      },
      {
        title: 'Account Name',
        dataIndex: 'accountName',
        key: 'accountName',
        // filters: positionDebitCredit.map(data => {
        //   return {
        //     text: data.accountName,
        //     value: data.accountNumber,
        //   }
        // }),
        // // specify the condition of filtering result
        // // here is that finding the name started with `value`
        // onFilter: (value, record) => record.accountName.indexOf(value) === 0,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
      {
        title: 'Date',
        dataIndex: 'journalDate',
        key: 'journalDate',
        render: text => (
          <span>{moment(text)
            .format(dateFormat)}
          </span>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Type',
        dataIndex: 'transactionType',
        key: 'transactionType',
        align: 'center',
        render: (text, record) => <span>{renderTransactionTypeTag(text)}</span>,
      },
      {
        title: 'Reference',
        dataIndex: 'journalReferenceId',
        key: 'journalReferenceId',
      },
      {
        title: 'Debit',
        dataIndex: 'debitAmount',
        key: 'debitAmount',
        className: 'column-money',
        width: "10%",
        render: (text, record) => (
          <span style={{ float: 'right' }}>
            {`${numeral(text).format('(0,0.00)')}`}
            {record.creditFormated ? "*" : ""}
          </span>

        ),
      },
      {
        title: 'Credit',
        dataIndex: 'creditAmount',
        key: 'creditAmount',
        className: 'column-money',
        width: "10%",
        render: (text, record) => (
          <span style={{ float: 'right' }}>
            {`${numeral(text).format('(0,0.00)')}`}
            {record.debitFormated ? "*" : ""}
          </span>
        ),
      }];
    this.calculateItemsAggregate(positionDebitCredit);
    return (
      <Table
        dataSource={positionDebitCredit}
        columns={columns}
        loading={loading}
        pagination={false}
        bordered
        rowKey={record => record.id}
        footer={() => {
          return (
            <table style={{ marginTop: 0, border: "none" }} className="">
              <tbody className="ant-table-tbody">
                <tr className="ant-table-row">
                  <td align="right" style={{ fontWeight: 600, fontSize: 11, color: "#fff" }} colSpan={7} width="80%">
                    Total
                        </td>
                  <td align="right" style={{ fontWeight: 600, fontSize: 11, color: "#fff" }} width="10%">
                    <span>{numeral(cumulativeTotal.debitTotal).format('(0,0.00)')}</span>
                  </td>
                  <td align="right" style={{ fontWeight: 600, fontSize: 11, color: "#fff" }} width="10%">
                    <span>{numeral(cumulativeTotal.creditTotal).format('(0,0.00)')}</span>
                  </td>
                </tr>
              </tbody>
            </table>

          );
        }}
      />
    );
  }
}

export default GeneralLedgerList;
