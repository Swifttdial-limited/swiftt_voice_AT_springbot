import React, { PureComponent } from 'react';
// eslint-disable-next-line camelcase
import enGb from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import { Table, Icon, Modal, LocaleProvider } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import numeral from 'numeral';
import { fetchTrialBalance, fetchGeneralLedger } from '../../../../services/accounting/reports';
import GeneralLedgerList from '../general-ledger/list';
const { confirm } = Modal;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const displayDateFormat = 'DD MMM YYYY';
let cumulativeTotal = {
  debitTotal: 0,
  creditTotal: 0,
};

class DetailedList extends PureComponent {
  constructor(props) {
    super(props);
    this.enterAnim = [
      {
        opacity: 0,
        x: 30,
        backgroundColor: '#fffeee',
        duration: 0,
      }, {
        height: 0,
        duration: 200,
        type: 'from',
        delay: 250,
        ease: 'easeOutQuad',
        onComplete: this.onEnd,
      }, {
        opacity: 1,
        x: 0,
        duration: 250,
        ease: 'easeOutQuad',
      }, {
        delay: 1000,
        backgroundColor: '#fff',
      },
    ];
    this.leaveAnim = [
      {
        duration: 250,
        opacity: 0,
      }, {
        height: 0,
        duration: 200,
        ease: 'easeOutQuad',
      },
    ];
    this.state = {
      width: 800,
      dataSource: [],
      loading: false,
    };
  }
  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.getReportData();
  }

  getReportData = (payload) => {
    this.setState({ loading: true });
    fetchTrialBalance({ payload }).then((response) => {
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
  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }
  onEnd = (e) => {
    e.target.style.height = 'auto';
  };

  getBodyWrapper = (body) => {
    // Switch paging to remove animation
    if (this.currentPage !== this.newPage) {
      this.currentPage = this.newPage;
      return body;
    }
    return (
      <TweenOneGroup
        component="tbody"
        className={body.props.className}
        enter={this.enterAnim}
        leave={this.leaveAnim}
        appear={false}
      >
        {body.props.children}
      </TweenOneGroup>
    );

  };

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    if (window.innerWidth < 1000) {
      this.setState({ width: 850 });
    } else if (window.innerWidth > 1000) {
      this.setState({ width: 0 });
    } else {
      const updateWidth = window.innerWidth - 100;
      this.setState({ width: updateWidth });
    }
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


  handleExpandedRowRender = (record) => {
    return (
      <GeneralLedgerList publicId={record.publicId} />
    );
  };

  render() {
    const { dataSource, loading, rangePickerValue } = this.state;

    let totalledListingData = [];
    let positionDebitCredit = [];

    if (dataSource && dataSource.length > 0) {
      let summarizedListingTotal = 0;
      let detailedListingDebitTotal = 0;
      let detailedListingCreditTotal = 0;

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
    const detailedListingColumns = [
      {
        title: 'Account Code',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        width: '20%',
      }, {
        title: 'Account',
        dataIndex: 'accountName',
        key: 'accountName',
        width: '50%',
      },
      {
        title: 'Debit',
        dataIndex: 'debitAmount',
        key: 'debitAmount',
        className: 'column-money',
        width: "15%",
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
        width: "15%",
        render: (text, record) => (
          <span style={{ float: 'right' }}>
            {`${numeral(text).format('(0,0.00)')}`}
            {record.debitFormated ? "*" : ""}
          </span>
        ),
      }];
    this.calculateItemsAggregate(positionDebitCredit);

    return (
      <div>
        <LocaleProvider locale={enGb}>
          <Table
            dataSource={positionDebitCredit}
            rowKey={record => record.publicId}
            columns={detailedListingColumns}
            bordered
            loading={loading}
            pagination={false}
            expandedRowRender={record => this.handleExpandedRowRender(record)}
            footer={() => {
              return (
                <table style={{ marginTop: 0, border: "none" }} className="">
                  <tbody className="ant-table-tbody">
                    <tr className="ant-table-row">
                      <td align="right" style={{ fontWeight: 600, fontSize: 13, color: "#fff" }} colSpan={2}>
                        Total
                        </td>
                      <td align="right" style={{ fontWeight: 600, fontSize: 13, color: "#fff", width: "15%" }} >
                        <span>{numeral(cumulativeTotal.debitTotal).format('(0,0.00)')}</span>
                      </td>
                      <td align="right" style={{ fontWeight: 600, fontSize: 13, color: "#fff", width: "15%" }} >
                        <span>{numeral(cumulativeTotal.creditTotal).format('(0,0.00)')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

              );
            }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default DetailedList;
