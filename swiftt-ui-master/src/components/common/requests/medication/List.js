import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const confirm = Modal.confirm;

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class List extends PureComponent {
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

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
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

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  render() {
    const {
      loading,
      dataSource,
      pagination,
    } = this.props;

    const columns = [
      {
        title: 'Product',
        dataIndex: 'priceListItem.product.productName',
        key: 'priceListItem.product.productName',
      }, {
        title: 'Qty',
        dataIndex: 'quantity',
        key: 'quantity',
      }, {
        title: 'Dosage',
        dataIndex: 'dosage',
        key: 'dosage',
      }, {
        title: 'Freq.',
        dataIndex: 'frequency',
        key: 'frequence',
      }, {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
      }, {
        title: 'Precaution',
        dataIndex: 'precaution',
        key: 'precaution',
      }, {
        title: 'Date',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
      }, {
        title: 'By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
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

export default List;
