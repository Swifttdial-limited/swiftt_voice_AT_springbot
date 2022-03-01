import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import {
  Table,
  Icon,
  LocaleProvider,
  Tag,
} from 'antd';
import Ellipsis from '../../../Ellipsis';
import { map } from 'lodash';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

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
        title: '',
        dataIndex: 'locked',
        key: 'locked',
        render: (text) => {
          if(text) {
            return <span><Icon type="lock" /></span>
          }
        }
      }, {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode',
      }, {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Custom Code',
        dataIndex: 'customProductCode',
        key: 'customProductCode',
      }, {
        title: 'Type',
        dataIndex: 'productType',
        key: 'productType',
        render: (text) => {
          if(text === 'MEDICATION') {
            return <span>Medication</span>
          } else if(text === 'SERVICE') {
            return <span>Service</span>;
          } else if(text === 'SUPPLIES') {
            return <span>Supplies</span>;
          } else if(text === 'PACKAGE') {
            return <span>Package</span>;
          }
        }
      }, {
        title: 'Group',
        dataIndex: 'group',
        key: 'group',
        render: (text, record) => {
          return record.group ? <Tag>{record.group.groupName}</Tag> : null;
        }
      }, {
        title: 'Department',
        dataIndex: 'group',
        key: 'group',
        render: (text, record) => {
          return record.group ? map(record.group.departments, department => <span>{department.name}</span>) : null;
        }
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => <Link to={`/catalogue/product/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
