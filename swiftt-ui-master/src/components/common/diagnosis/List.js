import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider } from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';
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

    handleDiagnosesMenuClick = (record, e) => {
      const { onDeleteItem } = this.props;
      confirm({
        title: 'Are you sure you want to delete this record?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
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
        onDeleteItem,
        onEditItem,
      } = this.props;

      const columns = [
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'By', dataIndex: 'createdBy.fullName', key: 'by.fullName' },
        {
          title: 'Date',
          dataIndex: 'creationDate',
          key: 'creationDate',
          render: text => <span>{moment(text).local().format(dateTimeFormat)}</span> },
        {
          title: '',
          key: 'operation',
          width: 100,
          render: (text, record) => {
            return (
              <Button type="dashed" shape="circle" icon="delete" onClick={this.handleDiagnosesMenuClick.bind(null, record)} />
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
