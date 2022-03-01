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
        title: 'Code',
        dataIndex: 'assetCode',
        key: 'assetCode',
        width: '50px',
      },{
        title: 'Name',
        dataIndex: 'assetName',
        key: 'assetName',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (text, record) => {
          return record.locations ? <span>{record.locations.name}</span> : null;
        }
      },
      {
        title: 'Buying Price',
        dataIndex: 'buyingPrice',
        key: 'buyingPrice',
        width: 100,
      }, {
        title: 'Bought Date',
        dataIndex: 'purchaseDate',
        key: 'purchaseDate',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
        width: 100,
      },{
        title: 'Asset Life',
        dataIndex: 'assetLife',
        key: 'assetLife',
        width: 50,
      },{
        title: 'Salvage Value',
        dataIndex: 'salvageAmount',
        key: 'salvageAmount',
        width: 100,
      }, {
        title: 'Category',
        dataIndex: 'assetCategory',
        key: 'assetCategory',
        render: (text, record) => {
          return record.assetCategory ? <span>{record.assetCategory.assetCategoryName}</span> : null;
        },
      },
      {
        title: 'Approved',
        dataIndex: 'approved',
        key: 'approved',
        render: (text, record) => {
          return record.approved ? <span>Yes</span> : <span>No</span>;
        }
      },
      {
        title: 'On Transfer',
        dataIndex: 'onTransfer',
        key: 'onTransfer',
        render: (text, record) => {
          return record.onTransfer ? <span>Yes</span> : <span>No</span>;
        },
        width: 100,
      },
      {
        title: 'under Maintainance',
        dataIndex: 'underMaintenance',
        key: 'underMaintenance',
        render: (text, record) => {
          return record.underMaintenance ? <span>Yes</span> : <span>No</span>;
        },
        width: 100,
      },
      {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: (text, record) => <Link to={`/fixed-assets-management/asset/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            size="small"
            // className={styles.table}
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
