import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import {
  Table,
  Dropdown,
  Button,
  Menu,
  Icon,
  Modal,
  LocaleProvider,
  Tag
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import Ellipsis from '../../Ellipsis';

import styles from './List.less';

const confirm = Modal.confirm;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

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

    const renderPurchaseOrderStatusTag = (status) => {
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
        title: '',
        dataIndex: 'closed',
        key: 'closed',
        align: 'center',
        render: (text) => <span>{text ? <Icon type="lock" style={{ color: 'red' }} /> : null}</span>
      }, {
        title: 'Order No.',
        dataIndex: 'purchaseOrderNumber',
        key: 'purchaseOrderNumber',
        align: 'center',
      }, {
        title: 'Vendor',
        dataIndex: 'vendor.name',
        key: 'vendor.name',
      }, {
        title: 'Type',
        dataIndex: 'purchaseOrderType',
        key: 'purchaseOrderType',
        render: (text) => {
          if(text === 'GOODS') {
            return <span>Purchase Order (Goods)</span>;
          } else if(text === 'SERVICE') {
            return <span>Service Order (Service)</span>
          }
        }
      }, {
        title: 'Raised By',
        dataIndex: 'raisedBy.fullName',
        key: 'raisedBy.fullName',
      }, {
        title: 'Date',
        dataIndex: 'raisedDate',
        key: 'raisedDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : null}</span>,
      }, {
        title: 'Status',
        dataIndex: 'purchaseOrderStatus',
        key: 'purchaseOrderStatus',
        align: 'center',
        render: (text, record) => <span>{renderPurchaseOrderStatusTag(text)}</span>,
      }, {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        render: (text, record) => <Link to={`/procurement/purchase-order/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
            simple rowKey={record => record.id}
            scroll={{ x: this.state.width }} />
        </LocaleProvider>
      </div>
    );
  }
}

export default list;
