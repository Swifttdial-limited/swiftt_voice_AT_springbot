import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import numeral from 'numeral';
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


    const renderCreditNoteStatusTag = (status) => {
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
        title: 'Debit Note No.',
        dataIndex: 'creditNoteNumber',
        key: 'creditNoteNumber',
      }, {
        title: 'Customer',
        dataIndex: 'customer.name',
        key: 'customer.name',
        render: (text, record) => <span>{text} ({record.customer ? record.customer.code : null})</span>,
      }, {
        title: 'Reference No.',
        dataIndex: 'creditNoteReference',
        key: 'creditNoteReference',
        render: (text) => <span>{text ? text : null}</span>,
      }, {
        title: 'Status',
        dataIndex: 'creditNoteStatus',
        key: 'creditNoteStatus',
        render: (text) => <span>{text ? renderCreditNoteStatusTag(text) : null}</span>,
      }, {
        title: 'Created By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      }, {
        title: 'Date',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      },
      // {
      //   title: 'Amount',
      //   dataIndex: 'totalAmount',
      //   key: 'totalAmount',
      //   // className: 'column-money',
      //   align: 'right',
      //   render: (text) => (
      //     <span style={{ textAlign: 'right', fontWeight: 800 }}>
      //       {`${numeral(text ? text.toLocaleString() : text).format('0,0.00')}`}
      //     </span>
      //   ),
      // },
      {
        title: '',
        key: 'operation',
        render: (text, record) => <Link to={`/accounts/customer-bills-and-payments/debit-note/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
