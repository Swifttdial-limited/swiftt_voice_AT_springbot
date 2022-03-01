import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import Ellipsis from '../../Ellipsis';
import enUS from 'antd/lib/locale-provider/en_US';
import numeral from 'numeral';

const confirm = Modal.confirm;
const dateTimeFormat = 'YYYY-MM-DD';

class list extends PureComponent {
  constructor(props) {
    super(props);
    const { current } = this.props.pagination;
    this.currentPage = current;
    this.newPage = current;
    this.state = {
      width: 800,
    };
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

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

  render() {
    const {
      loading,
      dataSource,
      pagination,
      onDeleteItem,
      onEditItem,
    } = this.props;

    const renderCustomerBillStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">DRAFT</Tag>;
        case 'IN_PROCESS':
          return <Tag color="blue">IN PROCESS</Tag>;
        case 'PRE_APPROVED':
          return <Tag color="purple">PREAPPROVED</Tag>;
        case 'APPROVED':
          return <Tag color="green">APPROVED</Tag>;
        case 'REJECTED':
          return <Tag color="red">REJECTED</Tag>;
        case 'CANCELED':
          return <Tag color="red">CANCELED</Tag>;
        case 'DELETED':
          return <Tag color="red">DELETED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Payment No.',
        dataIndex: 'customerPaymentNumber',
        key: 'customerPaymentNumber',
        align: 'center',
      }, {
        title: 'Customer',
        dataIndex: 'customer.name',
        key: 'customer.name',
      }, {
        title: 'Reference',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => <Ellipsis lines={1}>{record.description}</Ellipsis>,
      }, {
        title: 'Payment Method',
        dataIndex: 'payment.paymentMode.name',
        key: 'payment.paymentMode.name',
        render: (text) => <span>{text ? text : null}</span>,
      }, {
        title: 'Prepared By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      }, {
        title: ' Date',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateTimeFormat) : ''}</span>,
      }, {
        title: 'Status',
        dataIndex: 'customerPaymentStatus',
        key: 'customerPaymentStatus',
        align: 'center',
        render: (text, record) => <span>{renderCustomerBillStatusTag(text)}</span>,
      }, {
        title: 'Total',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: 100,
        render: (text) => (
          <span style={{ float: 'right', paddingRight: 10 }}>
            {`${numeral(text ? text.toLocaleString() : text).format('0,0.00')}`}
          </span>
        ),
      },
      {
        title: 'Paid',
        dataIndex: 'approvedTotal',
        key: 'approvedTotal',
        align: 'right',
        width: 100,
        render: (text) => (
          <span style={{ float: 'right', paddingRight: 10 }}>
            {`${numeral(text ? text.toLocaleString() : text).format('0,0.00')}`}
          </span>
        ),
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        render: (text, record) => <Link to={`/accounts/customers-and-payments/customer-payment/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
      },
    ];

    const calculateBillItemsAggregate = (dataset) => {
      let cumulativeTotal = 0;
      cumulativeTotal = dataset.reduce((tot, arr) => {
        return tot + cumulativeTotal + arr.amount;
      }, 0);
      return cumulativeTotal;
    };

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            onChange={::this.pageChange}
            pagination={pagination}
          simple
            rowKey={record => record.id}
          scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default list;
