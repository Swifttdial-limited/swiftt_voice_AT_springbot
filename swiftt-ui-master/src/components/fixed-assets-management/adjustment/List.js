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
        title: 'Code',
        dataIndex: 'adjustmentCode',
        key: 'adjustmentCode',
        width: 100,
      }, {
        title: 'Request Date',
        dataIndex: 'requestDate',
        key: 'requestDate',
        width: 100,
      },{
        title: 'Current value',
        dataIndex: 'currentValue',
        key: 'currentValue',
        width: 50,
      },{
        title: 'Adjustment Value',
        dataIndex: 'AdjustmentAmount',
        key: 'AdjustmentAmount',
        width: 100,
      }, {
        title: 'Request By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text, record) => {
          return record.createdBy ? <Tag>{record.createdBy.name}</Tag> : null;
        },
      },{
        title: 'Approved By',
        dataIndex: 'approvedBy',
        key: 'approvedBy',
        render: (text, record) => {
          return record.approvedBy ? <Tag>{record.approvedBy.name}</Tag> : null;
        },
      },{
        title: 'Approval Date',
        dataIndex: 'approvalDate',
        key: 'approvalDate',
        width: 100,
      }, {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: (text, record) => <Link to={`/fixed-assets-mgt/adjustment/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
