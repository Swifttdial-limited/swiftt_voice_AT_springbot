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
  Icon
} from 'antd';
import numeral from 'numeral';
import { forEach } from 'lodash';

import InventoryAdjustmentItemModal from './InventoryAdjustmentItemModal';

import styles from './style.less';

export default class TableForm extends PureComponent {
  static defaultProps = {
    allowProcessing: false,
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    allowProcessing: PropTypes.bool,
    location: PropTypes.object,
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    data: [],
    loading: false,
    isFormActive: false,
    modalType: 'create',
    modalVisible: false,
    selectedRows: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value ? nextProps.value.map((item) => {
          if(item.id)
            item.key = item.id;
          return item;
        }) : [],
      });
    }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  index = 0;
  cacheOriginData = {};

  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData, isFormActive: true });
    }
  };

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  newInventoryAdjustmentItem = () => {
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
      inventoryMetadata: data.inventoryMetadata ? data.inventoryMetadata : null,
      newQuantity: data.newQuantity,
      oldQuantity: data.oldQuantity,
      adjustmentQuantity: data.adjustmentQuantity,
      adjustmentReasons: data.adjustmentReasons,
      comment: '',
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

      if (!target.product.id || !target.expectedQuantity || !target.receivedQuantity ) {
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
      location,
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

    const inventoryAdjustmentItemModalProps = {
      location: location,
      item: currentItem,
      type: modalType,
      visible: modalVisible,
      onOk: this.handleModalOk,
      onCancel: this.handleModalCancel,
    };

    const InventoryAdjustmentItemModalGen = () => <InventoryAdjustmentItemModal {...inventoryAdjustmentItemModalProps} />;

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
        title: 'Unit Cost',
        dataIndex: 'inventoryMetadata.cost',
        key: 'inventoryMetadata.cost',
        align: 'right',
        width: '10%',
        render: (text, record) => {
          return <span>{numeral(record.inventoryMetadata ? record.inventoryMetadata.cost : 0).format('0,0.00')}</span>;
        },
      }, {
        title: 'Quantity Before',
        dataIndex: 'oldQuantity',
        key: 'oldQuantity',
        align: 'right',
        width: '10%',
        render: (text) => {
          return text;
        },
      }, {
        title: 'Adjustment Quantity',
        dataIndex: 'adjustmentQuantity',
        key: 'adjustmentQuantity',
        align: 'right',
        width: '15%',
        render: (text, record) => {
          if (record.editable && allowProcessing) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.quantity : 0}
                max={record.oldQuantity}
                onChange={value => this.handleFieldChange(value, 'adjustmentQuantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text;
        },
      }, {
        title: 'Quantity After',
        dataIndex: 'newQuantity',
        key: 'newQuantity',
        align: 'right',
        width: '15%',
        render: (text) => {
          return text;
        },
      }, {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'right',
        width: '10%',
        render: (text, record) => {
          let total = 0;
          if(record) {
            total = record.inventoryMetadata.cost * record.adjustmentQuantity;
          }

          return <span>{numeral(total).format('0,0.00')}</span>;
        },
      }, {
        title: '',
        key: 'action',
        align: 'center',
        width: '15%',
        render: (text, record) => {
          if(readOnly) {
            return null;
          }
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <Popconfirm title="Delete line?" onConfirm={() => this.remove(record.key)}>
                    <Button type="dashed" icon="delete" />
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
                <Divider type="vertical" />
                <Button type="dashed" shape="circle" icon="delete" onClick={e => this.cancel(e, record.key)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
              <Divider type="vertical" />
              <Popconfirm title="Delete line？" onConfirm={() => this.remove(record.key)}>
                <Button type="dashed" icon="delete" />
              </Popconfirm>
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
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
        />
        {enableAddItem && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newInventoryAdjustmentItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}
        <InventoryAdjustmentItemModalGen />
      </Fragment>
    );
  }
}
