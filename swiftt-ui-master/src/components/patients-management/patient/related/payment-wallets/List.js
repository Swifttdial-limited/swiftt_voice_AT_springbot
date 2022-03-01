import React, { PureComponent } from 'react';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const confirm = Modal.confirm;

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
    const {
      onDeleteItem,
      onEditItem,
      onActivateItem,
      onDeactivateItem,
    } = this.props;
    
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to delete this record?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    } else if (e.key === '3') {
      confirm({
        title: 'Are you sure you want to activate this wallet?',
        onOk() {
          onActivateItem(record.id);
        },
      });
    } else if (e.key === '4') {
      confirm({
        title: 'Are you sure you want to deactivate this wallet?',
        onOk() {
          onDeactivateItem(record.id);
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

    const handleExpandedRowRender = (wallet) => {
      return <p>Customer : {wallet.walletType.scheme.contact.name} Scheme : {wallet.walletType.scheme.name}</p>;
    };

    const renderWalletStatusTag = (status) => {
      switch (status) {
        case 'ACTIVE':
          return <Tag color="green">ACTIVE</Tag>;
        case 'INACTIVE':
          return <Tag color="red">INACTIVE</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Wallet Type',
        dataIndex: 'walletType.name',
        key: 'walletType.name',
      }, {
        title: 'Payment Type',
        dataIndex: 'walletType.paymentType',
        key: 'walletType.paymentType',
        render: (text) => {
          if (text === 'CASH_PREPAY') { return (<span>Cash PrePay</span>); } else if (text === 'CASH_POSTPAY') { return (<span>Cash PostPay</span>); } else if (text === 'CREDIT') { return (<span>Credit</span>); }
        },
      }, {
        title: 'Identification',
        dataIndex: 'identification',
        key: 'identification',
        render: text => <span>{text || 'Not Specified'}</span>,
      }, {
        title: 'Default',
        dataIndex: 'default',
        key: 'default',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <span>{renderWalletStatusTag(text)}</span>,
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
              <Menu.Item key="1">Edit</Menu.Item>
              <Menu.Divider />

              { record.status === 'INACTIVE' ? (
                  <Menu.Item key="3">Activate</Menu.Item>
              ) : (
                <Menu.Item key="4">Deactivate</Menu.Item>
              )}

              <Menu.Divider />
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
            // size="small"
            columns={columns}
            dataSource={dataSource}
            expandedRowRender={record => (record.walletType.paymentType === 'CREDIT' ? handleExpandedRowRender(record) : null)}
            loading={loading}
            onChange={::this.pageChange}
            pagination={pagination}
            rowKey={record => record.id}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default List;
