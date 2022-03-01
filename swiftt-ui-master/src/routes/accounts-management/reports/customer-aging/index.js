import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Table, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import styles from './index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../../../utils/utils';
import ContactSelect from '../../../../components/common/ContactSelect';
import { queryCustomerAging } from '../../../../services/accounting/journals';

const displayDateFormat = 'DD MMM YYYY';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
class CustomerAginReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      contact: {},
      loading: false,
      rangePickerValue: getTimeDistance('today'),
    };
  }
  getReportData = (payload) => {
    this.setState({ loading: true });
    queryCustomerAging({ ...payload }).then((response) => {
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
    const { contact } = this.state;
    this.setState({
      rangePickerValue,
      loading: true,
    });

    if (contact) {
      queryCustomerAging({
        addressTo: contact.publicId,
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      }).then((response) => {
        this.setState({
          loading: false,
          dataSource: response.content,
        });
      }).catch(() => {
        this.setState({
          loading: false,
          dataSource: [],
        });
      });
    }
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

  contactChangeHandler = (value) => {
    if (value) {
      this.getReportData({
        customer: value.publicId
       });
    }
  }

  render() {
    const { dataSource, loading, rangePickerValue } = this.state;
    // const { journals } = this.props;
    // const { list, loading, success } = journals;
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://www.shareicon.net/data/128x128/2017/01/23/874898_business_512x512.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Customer Aging</div>
        </div>
      </div>
    );
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
    const columns = [
      {
        title: 'Customer',
        dataIndex: 'contactName',
        key: 'contactName',
      },
      {
        title: '1-30 Days',
        dataIndex: 'balanceAmountThirtyDays',
        key: 'balanceAmountThirtyDays',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),
      },
      
      {
        title: '31-60 Days',
        dataIndex: 'balanceAmountSixtyDays',
        key: 'balanceAmountSixtyDays',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),
      },

      {
        title: '60-90 Days',
        dataIndex: 'balanceAmountNinetyDays',
        key: 'balanceAmountNinetyDays',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),
      },
      {
        title: '+90 Days',
        dataIndex: 'balanceAmountNinetyDays',
        key: 'balanceAmountNinetyDays',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),
      },
      {
        title: 'Credit Balance',
        dataIndex: 'balanceAmountNinetyDays',
        key: 'balanceAmountNinetyDays',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),

      },
  
    ];
    const contactSelectProps = {
      multiSelect: false,
      contactType: 'CUSTOMER',
    };

    const CustomerSelect = (
      <ContactSelect
        onContactSelect={this.contactChangeHandler}
        {...contactSelectProps}
      />
    );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Row>
          <Col md={4}>
            {CustomerSelect}
          </Col>
          <Col>
            {salesExtra}
          </Col>
        </Row>


        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          bordered
          rowKey={record => record.id}
        />
      </PageHeaderLayout>
    );
  }
}

export default CustomerAginReport;
