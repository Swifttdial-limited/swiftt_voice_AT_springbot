import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import numeral from 'numeral';
import Ellipsis from '../../Ellipsis';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const confirm = Modal.confirm;
const dateFormat = 'YYYY-MM-DD';

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

    const renderVendorBillStatusTag = (status) => {
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
        title: 'Bill No.',
        dataIndex: 'vendorBillNumber',
        key: 'vendorBillNumber',
        align: 'center',
      }, {
        title: 'Vendor',
        dataIndex: 'vendor.name',
        key: 'vendor.name',
        render: (text, record) => <Ellipsis lines={1}>{text} ({record.vendor.code})</Ellipsis>,
      }, {
        title: 'Inv. Ref',
        dataIndex: 'purchaseInvoiceReference',
        key: 'purchaseInvoiceReference',
        align: 'center',
        render: (text) => <span>{text}</span>,
      }, {
        title: 'Status',
        dataIndex: 'vendorBillStatus',
        key: 'vendorBillStatus',
        align: 'center',
        render: (text, record) => <span>{renderVendorBillStatusTag(text)}</span>,
      }, {
        title: 'Amount',
        dataIndex: 'approvedTotal',
        key: 'approvedTotal',
        align: 'right',
        render: (text) => (
          <span style={{ float: 'right', paddingRight: 10 }}>
            {`${numeral(text ? text.toLocaleString() : text).format('0,0.00')}`}
          </span>
        ),
      }, {
        title: 'Bill By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
        render: (text, record) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Bill Date',
        dataIndex: 'billingDate',
        key: 'billingDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        render: (text, record) => <Link to={`/accounts/vendors-bills-and-payments/vendor-bill/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            className={styles.table}
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            onChange={::this.pageChange}
            pagination={pagination}
            simple
            rowKey={record => record.id}
            scroll={{ y: 240 }}
            // scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default list;
