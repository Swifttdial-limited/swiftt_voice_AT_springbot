import React, { PureComponent } from 'react';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';

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
        dataIndex: 'fullName',
        key: 'fullName',
      }, {
        title: 'Phone No',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      }, {
        title: 'Alternative Phone No',
        dataIndex: 'alternativePhoneNumber',
        key: 'alternativePhoneNumber',
        render: text => <span>{text || 'Not Specified'}</span>,
      }, {
        title: 'Email Address',
        dataIndex: 'emailAddress',
        key: 'emailAddress',
        render: text => <span>{text || 'Not Specified'}</span>,
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
            expandedRowRender={record => <p>Customer : {record.comment}</p>}
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
