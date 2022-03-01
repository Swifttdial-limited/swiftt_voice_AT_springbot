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
import moment from 'moment';
import numeral from 'numeral';
import { forEach } from 'lodash';

import ReceiptNoteItemModal from './ReceiptNoteItemModal';
import TaxCodeSelect from '../../common/accounting/TaxCodeSelect';

import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';

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

  index = 0;
  cacheOriginData = {};

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

  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(this.props.allowProcessing) {
        if (!target.editable) {
          this.cacheOriginData[key] = { ...target };
        }
        target.editable = !target.editable;
        this.setState({ data: newData, isFormActive: true });
      } else {
        this.setState({ currentItem: target, modalType: 'update', modalVisible: true });
      }
    }
  };

  newReceiptNoteItem = () => {
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
      description: data.description,
      debitAccount: data.debitAccount,
      cost: data.cost ? data.cost : 0,
      expectedQuantity: data.expectedQuantity,
      receivedQuantity: data.receivedQuantity ? data.receivedQuantity : data.expectedQuantity,
      discount: data.discount ? data.discount : 0,
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

  handleFieldChange(value, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  }

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    const { data } = this.state;

    selectedRows.forEach((selectedRow) => {
      data.forEach((item) => {
        if (selectedRow.id === item.id) {
          item.approved = true;
        }
      });
    });

    this.setState({
      selectedRows,
      data,
    });
  };

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};

      if (!target.description || !target.expectedQuantity || !target.receivedQuantity ) {
        message.error('All required fields must be specified');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (!target.debitAccount) {
        message.error('Item stock account must be specified');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
        isFormActive: false,
      });
    }, 500);
  }

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

    const receiptNoteItemModalProps = {
      showExpectedQuantity: enableAddItem,
      item: currentItem,
      receiptNoteType: 'SERVICE',
      type: modalType,
      visible: modalVisible,
      onOk: this.handleModalOk,
      onCancel: this.handleModalCancel,
    };

    const ReceiptNoteItemModalGen = () => <ReceiptNoteItemModal {...receiptNoteItemModalProps} />

    const columns = [
      {
        title: 'Service',
        dataIndex: 'description',
        key: 'description',
        width: '25%',
        render: (text, record) => {
          return <span>{record.description}</span>;
        },
      }, {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost',
        align: 'right',
        width: '8%',
        render: (text, record) => {
          return <span>{numeral(record.cost).format('0,0.00')}</span>;
        },
      }, {
        title: 'Qty Ord',
        dataIndex: 'expectedQuantity',
        key: 'expectedQuantity',
        align: 'right',
        width: '6%',
        render: (text, record) => {
          return text;
        },
      }, {
        title: 'Qty Rcvd',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'right',
        width: '6%',
        render: (text, record) => {
          if (record.editable && allowProcessing) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.receivedQuantity : 0}
                min={1}
                max={record.expectedQuantity}
                onChange={value => this.handleFieldChange(value, 'receivedQuantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text;
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
        dataIndex: 'receivedDiscountTotal',
        key: 'receivedDiscountTotal',
        align: 'right',
        width: '8%',
        render: (text) => {
          return <span>{numeral(text ? text : 0).format('0,0.00')}</span>;
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
        dataIndex: 'receivedTaxTotal',
        key: 'receivedTaxTotal',
        align: 'right',
        width: '12%',
        render: (text, record) => {
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
            const { discount, cost, taxCode, receivedQuantity } = record;

            if (cost && receivedQuantity) {
              lineTotal = (receivedQuantity * record.cost);

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
        //width: '7%',
        render: (text, record) => {
          if(readOnly) {
            return null;
          }
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable && allowProcessing) {
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
              {!allowProcessing && (
                <Fragment>
                  <Divider type="vertical" />
                  <Popconfirm title="Delete line？" onConfirm={() => this.remove(record.key)}>
                    <Button type="dashed" icon="delete" />
                  </Popconfirm>
                </Fragment>
              )}
            </span>
          );
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
          rowKey={record => record.key}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
        />
        {enableAddItem && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newReceiptNoteItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}
        <ReceiptNoteItemModalGen />
      </Fragment>
    );
  }
}
