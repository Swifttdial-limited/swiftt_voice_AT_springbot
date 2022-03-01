import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Divider,
  Icon,
} from 'antd';
import numeral from 'numeral';
import { forEach } from 'lodash';

import ProductSelect from '../../common/ProductSelect';
import PurchaseOrderItemModal from './PurchaseOrderItemModal';
import TaxCodeSelect from '../../common/accounting/TaxCodeSelect';

import styles from './style.less';

export default class TableForm extends PureComponent {
  static defaultProps = {
    allowProcessing: false,
    enableAddItem: true,
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    allowProcessing: PropTypes.bool,
    enableAddItem: PropTypes.bool,
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    currentItem: {},
    data: [],
    loading: false,
    isFormActive: false,
    modalType: 'create',
    modalVisible: false,
    selectedRows: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value && prevState.data.length == 0) {
      return {
        data: nextProps.value ? nextProps.value.map((x) => {
          if(x.id)
            x.key = x.id;

          return x;
        }) : [],
      }
    }
    return null;
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  index = 0;

  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      this.setState({ currentItem: target, modalType: 'update', modalVisible: true });
    }
  };

  newPurchaseOrderItem = () => {
    this.setState({
      modalVisible: true,
      modalType: 'create'
    });
  };

  handleModalOk = (data) => {
    const { modalType } = this.state;
    let newData = [];

    if(modalType === 'create') {
      newData = this.add(data);
    } else if(modalType === 'update') {
      newData = this.update(data);
    }

    this.setState({
      currentItem: {},
      modalType: 'create',
      data: newData,
      isFormActive: false
    }, () => {
      this.props.onChange(this.state.data);
    });
  }

  add = (data) => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      product: data.product,
      description: data.description,
      quantity: data.quantity,
      packSize: data.packSize,
      cost: data.cost,
      discount: data.discount,
      taxCode: data.taxCode,
      editable: true,
      isNew: true,
    });
    this.index += 1;

    return newData;
  }

  remove = (key) => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  update = (data) => {
    return this.state.data.map(item => {
      if(item.key === data.key) {
        return Object.assign({}, item, data);
      }
      return item;
    });
  }

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  }

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    const { data } = this.state;

    selectedRows.forEach((selectedRow) => {
      data.forEach((item) => {
        if (selectedRow.key === item.key) {
          item.approved = true;
        }
      });
    });

    this.setState({
      selectedRows,
      data,
    });
  };

  // handleRowSelectChange = (selectedRowKeys, selectedRows) => {
  //   let { needTotalList } = this.state;
  //   needTotalList = needTotalList.map(item => ({
  //     ...item,
  //     total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
  //   }));
  //   const { onSelectRow } = this.props;
  //   if (onSelectRow) {
  //     onSelectRow(selectedRows);
  //   }
  //
  //   this.setState({ selectedRowKeys, needTotalList });
  // };

  render() {
    const {
      allowProcessing,
      enableAddItem,
      readOnly,
      rowSelectionEnabled
    } = this.props;

    const {
      currentItem,
      isFormActive,
      modalType,
      modalVisible,
      selectedRows
    } = this.state;

    const purchaseOrderItemModalProps = {
      item: currentItem,
      orderType: 'GOODS',
      type: modalType,
      visible: modalVisible,
      onOk: this.handleModalOk,
      onCancel: this.handleModalCancel,
    };

    const PurchaseOrderItemModalGen = () => <PurchaseOrderItemModal {...purchaseOrderItemModalProps} />;

    const columns = [
      {
        title: 'Item',
        dataIndex: 'product.productName',
        key: 'product.productName',
        width: '25%',
        render: (text, record) => {
          return <span>{record.product.productName} ({record.product.productCode})</span>;
        },
      }, {
        title: 'Pack Size',
        dataIndex: 'packSize.packSize',
        key: 'packSize.packSize',
        width: '9%',
        render: (text, record) => {
          if (record.packSize) {
            let packSize = record.packSize.packSize;

            if (record.packSize.unitOfMeasure) {
              packSize = `${packSize} (${record.packSize.unitOfMeasure.abbreviation})`;
            }
            return <span>{packSize}</span>;
          }
          return <Input disabled style={{ width: '100%' }} defaultValue={0} />;
        },
      }, {
        title: 'Cost per Pack',
        dataIndex: 'cost',
        key: 'cost',
        align: 'right',
        width: '9%',
        render: (text, record) => {
          return <span>{numeral(record.cost).format('0,0.00')}</span>;
        },
      }, {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '6%',
        render: (text, record) => {
          return text;
        },
      }, {
        title: 'Total Units',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        align: 'right',
        width: '10%',
        render: (text, record) => {
          let totalUnits = 0;
          if(record) {
            let packSize = 1;
            if(record.packSize && record.packSize.packSize) {
              packSize = record.packSize.packSize;
            }
            totalUnits = record.quantity * packSize;
          }

          return <span>{totalUnits}</span>;
        },
      }, {
        title: 'Discount %',
        dataIndex: 'discount',
        key: 'discount',
        align: 'right',
        width: '8%',
        render: (text, record) => {
          return <span>{numeral(record.discount).format('0,0.00')}</span>;
        },
      }, {
        title: 'Discount Value',
        dataIndex: 'discountTotal',
        key: 'discountTotal',
        align: 'right',
        width: '8%',
        render: (text) => {
          return <span>{numeral(text).format('0,0.00')}</span>;
        },
      }, {
        title: 'Tax',
        dataIndex: 'taxCode.name',
        key: 'taxCode.name',
        align: 'right',
        width: '12%',
        render: (text, record) => {
          return <span>{record.taxCode ? record.taxCode.name : null}</span>;
        },
      }, {
        title: 'Tax Value',
        dataIndex: 'taxTotal',
        key: 'taxTotal',
        align: 'right',
        width: '8%',
        render: (text) => {
          return <span>{numeral(text ? text : 0).format('0,0.00')}</span>;
        },
      }, {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'right',
        width: '8%',
        render: (text, record) => {
          let grossTotal = 0;
          let lineTotalTax = 0;
          let lineTotal = 0;
          let discountAmount = 0;

          if (record) {
            const { discount, cost, taxCode, quantity } = record;

            if (cost && quantity) {
              lineTotal = (record.quantity * record.cost);

              if(discount) {
                discountAmount = (lineTotal * discount) / 100;
              }

              if (taxCode) {
                if(taxCode.formula === 'EXCLUSIVE') {
                  lineTotalTax = ((lineTotal - discountAmount) * taxCode.percentage) / 100;
                } else if (taxCode.formula === 'INCLUSIVE') {
                  lineTotalTax = (lineTotal * taxCode.percentage) / 100;
                }
              }
            }
            grossTotal = (lineTotal - discountAmount + lineTotalTax);
          }
          return <span>{numeral(grossTotal).format('0,0.00')}</span>;
        },
      }, {
        title: '',
        key: 'action',
        align: 'center',
        width: '9%',
        render: (text, record) => {
          if(readOnly) {
            return null;
          }
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if(!allowProcessing) {
            return (
              <span>
                <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
                <Divider type="vertical" />
                <Popconfirm title="Delete line？" onConfirm={() => this.remove(record.key)}>
                  <Button type="dashed" icon="delete" />
                </Popconfirm>
              </span>
            );
          }
        },
      },
    ];

    const rowSelection = {
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: !rowSelectionEnabled, // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <Fragment>
        <Table
          className={styles.table}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          rowKey={record => record.key}
          rowSelection={!readOnly && rowSelection}
        />
        {enableAddItem && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newPurchaseOrderItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}
        <PurchaseOrderItemModalGen />
      </Fragment>
    );
  }
}
