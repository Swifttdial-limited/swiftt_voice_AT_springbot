import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import moment from 'moment';

import styles from './List.less';

const confirm = Modal.confirm;
import enUS from 'antd/lib/locale-provider/en_US';

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

    const columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName',
      }, {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      }, {
        title: 'Out of Office',
        dataIndex: 'outOfOffice',
        key: 'outOfOffice',
        render: text => (
          <span>{text
              ? 'Yes'
              : 'No'}
          </span>
        ),
      }, {
        title: 'Status',
        dataIndex: 'enabled',
        key: 'enabled',
        render: text => (text ? <Tag color="green">Enabled</Tag> : <Tag color="red">Disabled</Tag>),
      }, {
        title: '',
        key: 'operation',
        render: (text, record) => <Link to={`/system-administration/user/view/${record.publicId}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
            rowKey={record => record.publicId}
            scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default list;
