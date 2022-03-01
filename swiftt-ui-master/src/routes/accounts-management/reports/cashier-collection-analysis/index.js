import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Table, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import styles from './index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../../../utils/utils';
import PaymentModeSelect from '../../../../components/common/accounting/PaymentModeSelect';
import { fetchCashierCollectionAnalysis } from '../../../../services/accounting/reports';

const displayDateFormat = 'DD MMM YYYY';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
let cumulativeTotal = 0;
class CashBookReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      payeeAccount: {},
      dataSource: [],
      contact: {},
      loading: false,
      rangePickerValue: getTimeDistance('today'),
    };
  }

  componentDidMount() {
    this.getReportData();
  }

  getReportData = (payload) => {
    this.setState({ loading: true });
    fetchCashierCollectionAnalysis({ payload }).then((response) => {
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
  handleRangePickerChange = (rangePickerValue) => {
    // const { contact } = this.state;
    // this.setState({
    //   rangePickerValue,
    //   loading: true,
    // });

    // if (contact) {
    //   queryVendorInvoices({
    //     addressTo: contact.publicId,
    //     startDate: rangePickerValue[0].format(dateFormat),
    //     endDate: rangePickerValue[1].format(dateFormat),
    //   }).then((response) => {
    //     this.setState({
    //       loading: false,
    //       dataSource: response.content,
    //     });
    //   }).catch(() => {
    //     this.setState({
    //       loading: false,
    //       dataSource: [],
    //     });
    //   });
    // }
  };

  selectDate = (type) => {
    const rangePickerValue = getTimeDistance(type);
    // this.props.dispatch({
    //   type: 'journals/queryTrialBalance',
    //   payload: {
    //     startDate: rangePickerValue[0].format(dateFormat),
    //     endDate: rangePickerValue[1].format(dateFormat),
    //   },
    // });
    this.setState({
      rangePickerValue,
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  handlePrinting = () => {
    const { dispatch } = this.props;

    // dispatch({
    //   type: 'accounts/printAccountsListings',
    //   payload: {
    //     format: 'PDF',
    //   },
    // });
  }
  selectedAccountHandler = (value) => {
    this.setState({ payeeAccount: value });
  };

  // contactChangeHandler = (value) => {
  //   if (value) {
  //     this.setState({ loading: true });
  //     queryVendorInvoices({
  //       addressTo: value.publicId,
  //     }).then((response) => {
  //       this.setState({
  //         loading: false,
  //         contact: value,
  //         dataSource: response.content,
  //       });
  //     }).catch(() => {
  //       this.setState({
  //         loading: false,
  //         dataSource: [],
  //       });
  //     });
  //   }
  // }
  calculateItemsAggregate = (dataset) => {
    cumulativeTotal = dataset.reduce((tot, arr) => {
      return tot + cumulativeTotal + arr.amount;
    },0);
    return cumulativeTotal;
  };
  


  render() {
    const { dataSource, loading, rangePickerValue } = this.state;
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="small"
            src="https://www.shareicon.net/data/128x128/2017/01/23/874898_business_512x512.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Casher Collection Analysis</div>
        </div>
      </div>
    );
    const dateFilter = (
      <div className={styles.dateFilterWrap}>
        <div className={styles.dateFilter}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            Today
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            This week
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            This month
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            This year
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
    const columns = [
      {
        title: 'Receipt No',
        dataIndex: 'transactionNumber',
        key: 'transactionNumber',
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
        title: 'Payement Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
      },
      {
        title: 'Cashier',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('(0,0.00)')}`}
          </span>
        ),
      },
    ];
    this.calculateItemsAggregate(dataSource);
    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Row>
          <Col md={6}>

          </Col>
          <Col>
            {dateFilter}
          </Col>
        </Row>


        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={false}
          bordered
          rowKey={record => record.id}
          footer={() => {
              return (
                <table style={{ marginTop: 0, border: "none"}} className="">
                  <tbody className="ant-table-tbody">
                    <tr className="ant-table-row">
                      <td align="right" style={{ fontWeight: 600, fontSize: 13, color: "#fff" }} colSpan={6} width="80%">
                        Total
                        </td>
                      <td align="right" style={{ fontWeight: 600, fontSize: 13, color: "#fff", border: "none"   }} width="10%">
                        <span>{numeral(cumulativeTotal).format('(0,0.00)')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

              );
            }}
        />
      </PageHeaderLayout>
    );
  }
}

export default CashBookReport;
