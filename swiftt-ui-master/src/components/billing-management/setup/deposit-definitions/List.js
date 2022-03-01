import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import Ellipsis from '../../../Ellipsis';

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
        dataIndex: 'name',
        key: 'name',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => <Ellipsis lines={1}>{record.description}</Ellipsis>,
      }, {
        title: 'Account',
        dataIndex: 'liabilityAccount.name',
        key: 'liabilityAccount.name',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Dep. Amount',
        dataIndex: 'requiredDepositAmount',
        key: 'requiredDepositAmount',
        className: 'column-money',
        render: (text, record) => (
          <span style={{ paddingRight: 10 }}>
            {`${numeral(text ? text.toLocaleString() : text).format('0,0.00')}`}
          </span>
        ),
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
              <Menu.Item key="1">Edit</Menu.Item>
              <Menu.Item key="2">Delete</Menu.Item>
            </Menu>}
            >
              <Button style={{ border: 'none' }}>
                <Icon style={{ marginRight: 2 }} type="bars" />
                <Icon type="down" />
              </Button>
            </Dropdown>
          );
        },
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
