import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Table, DatePicker, Row, Col, Tag } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import styles from './index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../../../utils/utils';
import AccountSelect from '../../../../components/common/AccountSelect';
import GeneralLedgerList from '../../../../components/accounts-management/reports/general-ledger/list';
import { fetchGeneralLedger } from '../../../../services/accounting/reports';

const displayDateFormat = 'DD MMM YYYY';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
let cumulativeTotal = {
  debitTotal: 0,
  creditTotal: 0,
};
class GeneralLedger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 950,
      account: {},
      contact: {},
      loading: false,
      rangePickerValue: getTimeDistance('today'),
    };
  }


  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    if (window.innerHeight < 1000) {
      this.setState({ height: 950 });
    } else if (window.innerHeight > 1000) {
      this.setState({ height: 0 });
    } else {
      const updateHeight = window.innerHeight - 100;
      this.setState({ width: updateHeight });
    }
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
    //       dataSource: response,
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
    console.log(value);
    this.setState({ account: value });
  };



  render() {
    const { account, rangePickerValue, height } = this.state;

    const GeneralLedgerProps = {
      publicId: account ? account.publicId : null,
      rangePickerValue,
    };
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="small"
            src="https://www.shareicon.net/data/128x128/2017/01/23/874898_business_512x512.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>General Ledger</div>
        </div>
      </div>
    );
    const dateFilter = (
      <Row>
        <Col span={6}>
          <AccountSelect
            style={{ minWidth: '100%' }}
            onAccountSelect={e => this.selectedAccountHandler(e)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
          />

        </Col>
        <Col>
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
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Row>
          <Col>
            {dateFilter}
          </Col>
        </Row>
        <GeneralLedgerList {...GeneralLedgerProps} />

      </PageHeaderLayout>
    );
  }
}

export default GeneralLedger;
