import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Table, DatePicker, Row, Col, Card, Tabs } from 'antd';
import moment from 'moment';
import styles from './index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../../../utils/utils';
import { fetchIncomeStatementSummary, fetchIncomeStatementDetail } from '../../../../services/accounting/reports';
import List from '../../../../components/accounts-management/reports/income-statement/List';

const displayDateFormat = 'DD MMM YYYY';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class IncomeStatement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 950,
      dataSource: [],
      loading: false,
      rangePickerValue: getTimeDistance('today'),
      tabActiveKey: 'SUMMARY',
    };
  }

  componentDidMount() {
    this.getIncomeStatementSummary();
  }
  onTabChange = (key) => {
    if (key === 'SUMMARY') {
      this.getIncomeStatementSummary();
    } else if (key === 'DETAIL') {
      this.getIncomeStatementDetail();
    }
    this.setState({ tabActiveKey: key });
  };

  getIncomeStatementSummary = (payload) => {
    this.setState({ loading: true });
    fetchIncomeStatementSummary({ payload }).then((response) => {
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

  getIncomeStatementDetail = (payload) => {
    this.setState({ loading: true });
    fetchIncomeStatementDetail({ payload }).then((response) => {
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
  


  render() {
    const { tabActiveKey, dataSource, loading, rangePickerValue, height } = this.state;
    
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="small"
            src="https://www.shareicon.net/data/128x128/2017/01/23/874898_business_512x512.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Income Statement</div>
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
    const tabList = [{
      tab: 'Summary',
      key: 'SUMMARY',
    }, {
      tab: 'Detail',
      key: 'DETAIL',
    }];

    const ListProps = {
      dataSource,
      loading,
    };
    return (
      <PageHeaderLayout
        content={pageHeaderContent}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
      >
        <Row>
          <Col>
            {dateFilter}
          </Col>
        </Row>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <List {...ListProps} />
        </Card>

      </PageHeaderLayout>
    );
  }
}

export default IncomeStatement;
