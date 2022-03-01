import React, { PureComponent } from 'react';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';
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

  onEnd = e => e.target.style.height = 'auto';

  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, onGoToPermissionView } = this.props;
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to delete this record?',
        content: 'Users attached to this role will no longer have this role.',
        onOk() {
          onDeleteItem(record.publicId);
        },
      });
    } else if (e.key === '3') {
      onGoToPermissionView(record.publicId);
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
      }, {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => <Ellipsis lines={1}>{record.description}</Ellipsis>,
      }, {
        title: 'User Group',
        dataIndex: 'actor.name',
        key: 'actor.name',
      }, {
        title: 'Department',
        dataIndex: 'department.name',
        key: 'department.name',
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
              <Menu.Item key="1">Edit</Menu.Item>
              <Menu.Item key="3">Permissions</Menu.Item>
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
