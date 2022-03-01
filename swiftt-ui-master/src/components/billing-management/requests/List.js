import React, { PureComponent } from 'react';
import {
  Table,
  Badge,
  Divider, Tag,
  Modal, LocaleProvider
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';
import styles from './List.less';

const confirm = Modal.confirm;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const { Column, ColumnGroup } = Table;

class Requestlist extends PureComponent {

  state = {
    width: 800,
    billableTotal: 0,
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  // handleMenuClick = (record, e) => {
  //   const { onDeleteItem, onEditItem } = this.props;
  //   if (e.key === '1') {
  //     onEditItem(record);
  //   } else if (e.key === '2') {
  //     confirm({
  //       title: 'Are you sure you want to delete this record?',
  //       onOk() {
  //         onDeleteItem(record.publicId);
  //       },
  //     });
  //   }
  // }

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



  handleBillableItems = (billableItems) => {
    const selectedRequestItems = billableItems.map((requestItem) => {
      const { id, version, amountPayable } = requestItem;
      return { id, version, amountPayable };
    });
    const billableTotal = this.calculateBillItemsAggregate(selectedRequestItems)
    this.props.handleBillableItems({
      selectedRequestItems,
      billableTotal,
    });

    this.setState({
      billableItems: selectedRequestItems,
      billableTotal: (billableTotal),
    });
  };

  calculateBillItemsAggregate = (billItems) => {
    let cumulativeTotal = 0;
    cumulativeTotal = billItems.reduce((tot, arr) => {
      return tot + cumulativeTotal + arr.amountPayable;
    }, 0);
    return cumulativeTotal;
  };


  render() {

    const { loading, dataSource, pagination } = this.props;

    const requestItemsSelection = {
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.handleBillableItems(selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        this.handleBillableItems(selectedRows);
      },
      onSelectInvert(selectedRows) {
        this.handleBillableItems(selectedRows);
      },
    };

    const columns = [
      {
        title: 'Date',
        dataIndex: 'requestItem.creationDate',
        key: 'requestItem.creationDate',
        // width: '10%',
        align: 'left',
        render: text => <span>{moment(text).local().format(dateTimeFormat)} </span>,
      },
      {
        title: 'Department',
        dataIndex: 'department.name',
        key: 'department.name',
        // width: '30%',
        align: 'left',
      },
      {
        title: 'Product',
        dataIndex: 'requestItem.priceListItem.product.productName',
        key: 'requestItem.priceListItem.product.productName',
        // width: '30%',
        align: 'left',
      },
      {
        title: 'Quantity',
        dataIndex: 'requestItem.quantity',
        key: 'requestItem.quantity',
        align: 'right',
        // width: '20%',
      },
      {
        title: 'Price',
        dataIndex: 'requestItem.priceListItem.sellingPrice',
        key: 'requestItem.priceListItem.sellingPrice',
        align: 'right',
        // width: '20%',
        render: text => <span>{numeral(text).format('0,0.00')}</span>
      },
      {
        title: 'Total',
        dataIndex: 'amountPayable',
        key: 'amountPayable',
        width: '15%',
        align: 'right',
        render: text => <span>{numeral(text).format('0,0.00')}</span>
      },
    ];


    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            className={styles.table}
            columns={columns}
            // scroll={{ y: 240 }}
            size="middle"
            bordered
            loading={loading}
            rowKey={record => record.id}
            rowSelection={requestItemsSelection}
            dataSource={dataSource}
            pagination={false}
            footer={() => {
              return (
                <table style={{ marginTop: 0 }} className="">
                  <tbody className="ant-table-tbody">
                    <tr className="ant-table-row">
                      <td align="right" style={{ fontWeight: 800, fontSize: 15, color: "#fff" }} colSpan={6} width="85%">
                        Total
                        </td>
                      <td align="right" style={{ fontWeight: 800, fontSize: 15, color: "#fff"  }} width="15%">
                        <span>{numeral(this.state.billableTotal).format('0,0.00')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

              );
            }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default Requestlist;
