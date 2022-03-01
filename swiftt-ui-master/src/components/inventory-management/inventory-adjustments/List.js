import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import numeral from 'numeral';
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

  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props;
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to delete this record?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
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

    const renderInventoryAdjustmentStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">INCOMPLETE</Tag>;
        case 'PENDING':
          return <Tag color="orange">PENDING</Tag>;
        case 'IN_PROCESS':
          return <Tag color="blue">IN PROCESS</Tag>;
        case 'PRE_APPROVED':
          return <Tag color="purple">PREAPPROVED</Tag>;
        case 'APPROVED':
          return <Tag color="green">APPROVED</Tag>;
        case 'COMPLETED':
          return <Tag color="green">COMPLETED</Tag>;
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
        title: 'Adjustment No.',
        dataIndex: 'inventoryAdjustmentNumber',
        key: 'inventoryAdjustmentNumber',
        align: 'center',
      }, {
        title: 'Location',
        dataIndex: 'location.name',
        key: 'location.name',
      }, {
        title: 'Adjusted By',
        dataIndex: 'adjustedBy.fullName',
        key: 'adjustedBy.fullName',
      }, {
        title: 'Date',
        dataIndex: 'adjustmentDate',
        key: 'adjustmentDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: 'Status',
        dataIndex: 'inventoryAdjustmentStatus',
        key: 'inventoryAdjustmentStatus',
        align: 'center',
        render: (text, record) => <span>{renderInventoryAdjustmentStatusTag(text)}</span>,
      }, {
        title: 'Total',
        dataIndex: 'adjustmentTotal',
        key: 'adjustmentTotal',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        render: (text, record) => <Link to={`/inventory/inventory-adjustment/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
            scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default list;
