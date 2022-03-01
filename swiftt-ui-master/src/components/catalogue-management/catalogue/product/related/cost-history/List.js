import React, { PureComponent } from 'react';
import {
  Table,
  LocaleProvider
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const dateFormat = 'YYYY-MM-DD';

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
    } = this.props;

    const columns = [
      {
        title: 'Date',
        dataIndex: 'stockDate',
        key: 'stockDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : null}</span>,
      }, {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: 'Vendor',
        dataIndex: 'vendor.name',
        key: 'vendor.name',
        render: text => <span>{text || 'Not Specified'}</span>,
      },{
        title: 'Purchase Invoice',
        dataIndex: 'purchaseInvoiceReference',
        key: 'purchaseInvoiceReference',
        render: text => <span>{text || 'Not Specified'}</span>,
      },  {
        title: 'Batch Number',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        render: text => <span>{text || 'Not Specified'}</span>,
      }, {
        title: 'Expiry Date',
        dataIndex: 'bestBeforeDate',
        key: 'bestBeforeDate',
        align: 'center',
        render: text => <span>{text ? moment(text).local().format(dateFormat) : null}</span>,
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
