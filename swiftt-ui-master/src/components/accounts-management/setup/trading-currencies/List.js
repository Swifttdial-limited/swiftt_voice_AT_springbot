import React, { PureComponent } from 'react';
import {
  Table,
  Dropdown,
  Button,
  Menu,
  Icon,
  Modal,
  LocaleProvider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import numeral from 'numeral';

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

    const expandedRowRender = (record) => {
      const columns = [
          {
           title: 'Date',
           dataIndex: 'stockDate',
           key: 'stockDate',
           align: 'center',
           render: text => <span>{text ? moment(text).local().format(dateFormat) : ''}</span>,
         }, {
          title: 'Rate',
          dataIndex: 'vendorName',
          key: 'vendorName',
          align: 'right',
        },
      ];

      return (
        <Table
          style={{ margin: 5 }}
          columns={columns}
          dataSource={record.details ? record.details : []}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: 'Currency',
        dataIndex: 'currency.name',
        key: 'currency.name',
        align: 'center',
        width: '35%',
        render: (text, record) => {return (<span>{text} ({record.currency.code})</span>);}
      }, {
        title: 'Auto Update',
        dataIndex: 'autoUpdateRate',
        key: 'autoUpdateRate',
        align: 'center',
        width: '15%',
        render: (text) => {return (<span>{text ? 'Yes' : 'No'}</span>);}
      }, {
        title: 'Exchange Rate',
        dataIndex: 'rate',
        key: 'rate',
        align: 'center',
        width: '15%',
      }, {
        title: 'Last Rate Update',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
        align: 'center',
        width: '20%',
      }, {
        title: '',
        key: 'operation',
        align: 'center',
        width: '9%',
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
            size="default"
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            expandedRowRender={expandedRowRender}
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
