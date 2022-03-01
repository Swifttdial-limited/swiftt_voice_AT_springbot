import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';

import styles from './List.less';

import enUS from 'antd/lib/locale-provider/en_US';

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

    const rendergoodsReturnStatusTag = (status) => {
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
        title: 'Goods Return No.',
        dataIndex: 'goodsReturnNumber',
        key: 'goodsReturnNumber',
      }, {
        title: 'Status',
        dataIndex: 'goodsReturnStatus',
        key: 'goodsReturnStatus',
        render: (text, record) => <span>{rendergoodsReturnStatusTag(text)}</span>,
      }, {
        title: 'Vendor',
        dataIndex: 'vendor.name',
        key: 'vendor.name',
      }, {
        title: 'Location',
        dataIndex: 'location.name',
        key: 'location.name',
      }, {
        title: 'Returned By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      }, {
        title: 'Return Date',
        dataIndex: 'returnDate',
        key: 'returnDate',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
      }, {
        title: '',
        key: 'operation',
        render: (text, record) => <Link to={`/inventory/goods-return/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
