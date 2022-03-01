import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Table, DatePicker, Row, Col, Tabs, Card } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import styles from './index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../../../utils/utils';
import ContactSelect from '../../../../components/common/ContactSelect';
import { queryCustomerStatement } from '../../../../services/accounting/journals';


const displayDateFormat = 'DD MMM YYYY';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class CustomerStatementReport extends PureComponent {
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
    queryCustomerStatement({ ...payload }).then((response) => {
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
      queryCustomerStatement({
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
        customer: value.publicId,
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
          <div className={styles.contentTitle}>Customer Statement</div>
        </div>
      </div>
    );
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            Today
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            1-30 Days Due
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            1-60 Days Due
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            61-90 Days Due
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            +90 Days Due
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
        title: 'Date',
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        render: text => (
          <span>{moment(text)
            .format(displayDateFormat)}
          </span>
        ),
      },
      {
        title: 'Customer',
        dataIndex: 'customer.name',
        key: 'customer.name',
      },
      {
        title: 'Invoice No',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
      },
      //  {
      //   title: 'Identification No',
      //   dataIndex: 'patientName',
      //   key: 'secondaryAddressTo.code',
      // }, 
      {
        title: 'Patient Name',
        dataIndex: 'patientName',
        key: 'patientName',
      },
      //  {
      //   title: 'MRN',
      //   dataIndex: 'account.name',
      //   key: 'account.name',
      // },
      {
        title: 'Visit Number',
        dataIndex: 'visitNumber',
        key: 'visitNumber',
      }, {
        title: 'Invoice Amount',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
        align: 'right',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),
      },
      {
        title: 'Paid Amount',
        dataIndex: 'paidAmount',
        key: 'paidAmount',
        align: 'right',
        render: text => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(text).format('0,0.00')}`}
          </span>
        ),
      },
      {
        title: 'Balance Amount',
        dataIndex: 'balanceAmount',
        key: 'balanceAmount',
        align: 'right',
        render: (text, record) => (
          <span style={{ fontWeight: 800 }}>
            {`${numeral(record.invoiceAmount - record.paidAmount).format('0,0.00')}`}
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

export default CustomerStatementReport;
