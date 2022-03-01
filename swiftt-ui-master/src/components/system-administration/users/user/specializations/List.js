import React, { PureComponent } from 'react';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const confirm = Modal.confirm;

class List extends PureComponent {
  constructor(props) {
    super(props);
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
      onDeleteItem,
      onEditItem,
    } = this.props;

    const columns = [
      {
        title: 'Group',
        dataIndex: 'actor.name',
        key: 'actor.name',
      }, {
        title: 'Identification Type',
        dataIndex: 'identificationType.name',
        key: 'identificationType.name',
      }, {
        title: 'Identification',
        dataIndex: 'identification',
        key: 'identification',
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
