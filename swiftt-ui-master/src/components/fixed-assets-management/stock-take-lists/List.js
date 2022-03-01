import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table, Menu, Icon, LocaleProvider, Tag } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

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

    const renderStockTakeListStatusTag = (status) => {
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
        case 'REJECTED':
          return <Tag color="red">REJECTED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: '',
        dataIndex: 'reconciled',
        key: 'reconciled',
        align: 'center',
        render: (text) => <span>{text ? <Icon type="lock" style={{ color: 'red' }} /> : null}</span>
      }, {
        title: 'Stock Take List No.',
        dataIndex: 'stockTakeListNumber',
        key: 'stockTakeListNumber',
        align: 'center',
      }, {
        title: 'Location',
        dataIndex: 'location.name',
        key: 'location.name',
      }, {
        title: 'Stock Taking Date',
        dataIndex: 'stockTakingDate',
        key: 'stockTakingDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: 'Created By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, record) => <span>{renderStockTakeListStatusTag(text)}</span>,
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        render: (text, record) => <Link to={`/fixed-assets-management/stock-take-list/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
