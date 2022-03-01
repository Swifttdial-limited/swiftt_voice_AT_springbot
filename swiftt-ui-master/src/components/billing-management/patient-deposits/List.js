import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import moment from 'moment';
import numeral from 'numeral';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
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
    } = this.props;

    const columns = [
      {
        title: '',
        dataIndex: 'reversed',
        key: 'reversed',
        align: 'center',
        render: (text) => <span>{text ? <Icon type="lock" style={{ color: 'red' }} /> : null}</span>
      }, {
        title: 'Deposit No',
        dataIndex: 'depositNumber',
        key: 'depositNumber',
        align: 'center',
      }, {
        title: 'Deposited By',
        dataIndex: 'addressTo',
        key: 'addressTo',
        render: (text, record) => <span>{record.addressTo.name} ({record.addressTo.code})</span>
      }, {
        title: 'Deposit Date',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
      }, {
        title: 'Received Amount',
        dataIndex: 'depositedAmount',
        key: 'depositedAmount',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      }, {
        title: 'Reference No.',
        dataIndex: 'paymentReference',
        key: 'paymentReference',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Received By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        render: (text, record) => <Link to={`/billing/deposit/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
