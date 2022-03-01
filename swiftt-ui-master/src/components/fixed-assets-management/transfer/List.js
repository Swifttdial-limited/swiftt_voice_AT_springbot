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
        title: 'Asset',
        dataIndex: 'asset',
        key: 'asset',
        //render: text => <span>{moment(text).local().format(dateFormat)}</span>,
        render: (text, record) => {
          return record.asset ? <span>{record.asset.assetName}</span> : null;
        },
        width: 100,
      }, {
        title: 'Transfer Date',
        dataIndex: 'transferDate',
        key: 'transferDate',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
        width: 100,
      },{
        title: 'Current location',
        dataIndex: 'asset',
        key: 'asset',
        render: (text, record) => {
          return record.currentLocation ? <span>{record.currentLocation.name}</span> : null;
        },
        width: 50,
      },{
        title: 'New Location',
        dataIndex: 'location',
        key: 'location',
        render: (text, record) => {
          return record.newLocation ? <span>{record.newLocation.name}</span> : null;
        },
        width: 50,
      }, {
        title: 'Request By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text, record) => {
          return record.createdBy ? <span>{record.createdBy.fullName}</span> : null;
        },
      },{
        title: 'Approved By',
        dataIndex: 'approvedBy',
        key: 'approvedBy',
        render: (text, record) => {
          return record.approvedBy ? <span>{record.approvedBy.fullName}</span> : null;
        },
      },{
        title: 'Approval Date',
        dataIndex: 'approvalDate',
        key: 'approvalDate',
        //render: record.approvalDate ? text => <span>{moment(text).local().format(dateFormat)}</span> : null,
        render: (text, record) => {
          return record.approvalDate ? text => <span>{moment(text).local().format(dateFormat)}</span> : null;
        },
        width: 100,
      }, {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: (text, record) => <Link to={`/fixed-assets-mgt/Transfer/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            size="small"
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
