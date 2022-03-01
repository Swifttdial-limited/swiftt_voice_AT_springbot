import React, {PureComponent} from 'react';
import {Link} from 'dva/router';
import {
  Table,
  Icon,
  LocaleProvider,
  Tag,
} from 'antd';

import Ellipsis from '../../Ellipsis';
import {map} from 'lodash';

import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';
import moment from "moment";

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class list extends PureComponent {

  constructor(props) {
    super(props);
    const {current} = this.props.pagination;
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
        title: 'Supplier',
        dataIndex: 'supplier',
        key: 'supplier',
        render: (text, record) => {
          return record.supplier ? <span>{record.supplier.name}</span> : null;
        },
      }, {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
      },{
        title: 'End Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
      },{
        title: 'Cost',
        dataIndex: 'costAmount',
        key: 'costAmount',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (text, record) => {
          return record.category ? <Tag>{record.category.categoryName}</Tag> : null;
        },
      },
      {
        title: 'Asset',
        dataIndex: 'asset',
        key: 'category',
        render: (text, record) => {
          return record.asset ? <span>{record.asset.assetName}</span> : null;
        },
      },
      {
        title: 'Complete',
        dataIndex: 'complete',
        key: 'complete',
        render: (text, record) => {
          return record.completed ? <span>Yes</span> : <span>No</span>;
        },
      },
      {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: (text, record) => <Link to={`/fixed-assets-mgt/Maintenance/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            size="small"
            //className={styles.table}
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
