import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Avatar,
  Table,
  DatePicker,
  Select,
  Tabs,
  Card,
  Row,
  Col,
  Button,
} from 'antd';
import numeral from 'numeral';

import { getTimeDistance } from '../../../../utils/utils';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DetailedList from '../../../../components/accounts-management/reports/trial-balance/detailed';
import SummaryList from '../../../../components/accounts-management/reports/trial-balance/summary';


import styles from './index.less';

// import RequestsList from '../../../components/workspace/trialBalances/List';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { TabPane } = Tabs;
const { Option } = Select;
let cumulativeTotal = {
  debitTotal: 0,
  creditTotal: 0,
};

@connect(({ journals }) => ({
  journals,
}))
class TrialBalanceReportView extends PureComponent {

  state = {
    rangePickerValue: getTimeDistance('today'),
    dataSource: [],
    loading: false,
  };

  componentDidMount() {
    
  }

  getGeneralLedge = (payload) => {
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
  handleLedgerType = (value) => {
    const { dispatch } = this.props;
    this.setState({ ledgerType: value });
    dispatch({
      type: 'journals/queryTrialBalance',
      payload: {
        ledgerType: value,
      },
    });
  };

  // handleTabChange = (key) => {
  //   this.setState({
  //     currentTabKey: key,
  //   });
  // };

  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'journals/queryTrialBalance',
      payload: {
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
  };

  selectDate = (type) => {
    const rangePickerValue = getTimeDistance(type);
    this.props.dispatch({
      type: 'journals/queryTrialBalance',
      payload: {
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
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

  handleTrialBalalancePrinting = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'accounts/printAccountsListings',
      payload: {
        format: 'PDF',
      },
    });
  }


  render() {
    const { dataSource, loading, rangePickerValue } = this.state;

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
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

    return (
      <PageHeaderLayout
        title="Trial Balance"
        // content="Form pages are used to collect or verify information from users. Basic orms are common to form scenes with fewer data items."
        // action={<Button type="primary" onClick={this.handleTrialBalalancePrinting} icon="printer">Print</Button>}
      >
      <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
        <div className={styles.salesCard}>
          <Tabs
            tabBarExtraContent={salesExtra}
            // size="large"
            tabBarStyle={{ marginBottom: 0 }}
          >
            <TabPane tab="Summary" key="Summary">
              <SummaryList />
            </TabPane>
            <TabPane tab="Detail" key="Detail">
              <DetailedList />
            </TabPane>

          </Tabs>
        </div>
      </Card>
      </PageHeaderLayout>
    );
  }
}

export default TrialBalanceReportView;
