import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';
import numeral from 'numeral';

import styles from './List.less';

const confirm = Modal.confirm;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD HH:mm:ss';

class List extends PureComponent {
  constructor(props) {
    super(props);
    const { current } = this.props.pagination;
    this.currentPage = current;
    this.newPage = current;
    this.state = {
      width: '100%',
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
      type,
    } = this.props;

    const renderRequestStatusTag = (status) => {
      switch (status) {
        case 'NEW':
          return <Tag color="magenta">NEW</Tag>;
        case 'ACTIVE':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CANCELLED':
          return <Tag color="red">CANCELLED</Tag>;
        case 'COMPLETED':
          return <Tag color="magenta">COMPLETED</Tag>;
        case 'AWAITING_CONFIRMATION':
          return <Tag color="purple">AWAITING CONFIRMATION</Tag>;
        case 'PENDING_BILL_PAYMENT':
          return <Tag color="purple">PENDING BILL PAYMENT</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Request Time',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
      }, {
        title: 'Department',
        dataIndex: 'request',
        render: request => (
          <div>
            <span>{request.sourceDepartment.name}</span> <Icon type="arrow-right" /> <span>{request.destinationDepartment.name}</span>
          </div>
        ),
      },
      {
        title: 'Request By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      },
      {
        title: 'Product',
        dataIndex: 'priceListItem.product.productName',
        key: 'priceListItem.product.productName',
        render: (text, record) => {
          return (
            <div>
              <span>{text}</span>
              <br /> <span>Code: {record.priceListItem.product.productCode}</span>
            </div>
          );
        },
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{renderRequestStatusTag(text)}</span>,
      }, {
        title: 'Type',
        dataIndex: 'priceListItem.product.productType',
        key: 'priceListItem.product.productType',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'right',
      }, {
        title: 'Price',
        dataIndex: 'priceListItem.sellingPrice',
        key: 'priceListItem.sellingPrice',
        align: 'right',
        render: text => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: 'Total',
        dataIndex: 'payableTotal',
        key: 'payableTotal',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0.00')}</span>,
      },
      // {
      //   title: 'Deduction',
      //   dataIndex: 'priceListItem.discount',
      //   key: 'priceListItem.discount',
      //   render: text => <span>{numeral(text).format('0,0.00')}</span>,
      // }, {
      //   title: 'Payable',
      //   dataIndex: 'payableTotal',
      //   key: 'payableTotal',
      //   render: text => <span>{numeral(text).format('0,0.00')}</span>,
      // },
    ];

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
            size="middle"
            rowKey={record => record.id}
          scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default List;
