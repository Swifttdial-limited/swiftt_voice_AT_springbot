import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';
import numeral from 'numeral';
import Ellipsis from '../../../Ellipsis';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const confirm = Modal.confirm;

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

    const columns = [
      {
        title: 'Name',
        dataIndex: 'product.productName',
        key: 'product.productName',
        render: (text, record) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Price list',
        dataIndex: 'priceList.name',
        key: 'priceList.name',
        render: (text, record) => <Ellipsis lines={1}>{record.priceList.name}</Ellipsis>,
      }, {
        title: 'Selling',
        dataIndex: 'sellingPrice',
        key: 'sellingPrice',
        render: (text, record) => <span>{numeral(record.sellingPrice).format('0,0.00')}</span>,
      }, {
        title: 'Min/Max',
        dataIndex: 'minimumSellingPrice',
        key: 'minimumSellingPrice',
        render: (text, record) => <span>{numeral(record.minimumSellingPrice).format('0,0.00')} / {numeral(record.maximumSellingPrice).format('0,0.00')}</span>,
      }, {
        title: '',
        dataIndex: 'product.locked',
        key: 'product.locked',
        render: (text) => {
          if(text) {
            return <span><Icon type="lock" /></span>
          }
        }
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => <Link to={`/catalogue/price/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
