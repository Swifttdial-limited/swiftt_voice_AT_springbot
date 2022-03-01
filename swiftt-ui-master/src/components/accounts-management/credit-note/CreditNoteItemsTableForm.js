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

import styles from './style.less';

export default class TableForm extends PureComponent {
  state = {
    data: [],
    loading: false,
    isFormActive: false,
    selectedRows: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value ? nextProps.value.map((item) => {
          if(item.id)
            item.key = item.id;
          else {
            item.key = item.lineItemReferenceId;
          }
          return item;
        }) : [],
      });
    }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.id === key)[0];
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
    const newData = this.state.data.filter(item => item.id !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

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
      if (!target.product.id) {
        message.error('All required fields must be specified');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (!target.product.stockAccount) {
        message.error(`Product ${target.product.name} does not have stock account`);
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

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    const { data } = this.state;

    selectedRows.forEach((selectedRow) => {
      data.forEach((item) => {
        if(item.id) {
          if (selectedRow.id === item.id) {
            item.approved = true;
          }
        } else {
          if (selectedRow.key === item.key) {
            item.eligible = true;
          }
        }
      });
    });

    this.setState({
      selectedRows,
      data,
    });
  };

  calculateLineTotal = (record) => {
    const { creditQuantity, cost } = record;
    return (creditQuantity * 1) * (cost * 1);
  }

  render() {
    const { rowSelectionEnabled } = this.props;
    const { isFormActive } = this.state;

    const rowSelection = {
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: !rowSelectionEnabled, // Column configuration not to be checked
        name: record.name,
      }),
    };

    const columns = [
      {
        title: 'Item',
        dataIndex: 'product.productName',
        key: 'product.productName',
        width: '30%',
        render: (text, record) => {
          if(record.product) {
            return <span>{record.product.productName} ({record.product.productCode})</span>;
          } else if(record.description) {
            return <span>{record.product.description}</span>;
          }
        },
      }, {
        title: 'Pack Size',
        dataIndex: 'packSize.packSize',
        key: 'packSize.packSize',
        width: '15%',
        render: (text, record) => {
          if (record.packSize) {
            let packSize = record.packSize.packSize;
            if (record.packSize.unitOfMeasure) {
              packSize = packSize + ' (' + record.packSize.unitOfMeasure.abbreviation + ')';
            }
            return <span>{packSize}</span>;
          }

          if (record.product.packSize) {
            let packSize = record.product.packSize.packSize;
            if (record.product.packSize.unitOfMeasure) {
              packSize = packSize + ' (' + record.product.packSize.unitOfMeasure.abbreviation + ')';
            }
            return <span>{packSize}</span>;
          }
          return <Input disabled style={{ width: '100%' }} defaultValue={0} />;
        },
      }, {
        title: 'Quantity',
        dataIndex: 'creditQuantity',
        key: 'creditQuantity',
        align: 'right',
        width: '15%',
        render: (text, record) => {
          return <span>{record.creditQuantity}</span>;
        },
      }, {
        title: 'Cost per Pack',
        dataIndex: 'cost',
        key: 'cost',
        align: 'right',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.cost : 0}
                min={0}
                max={record.cost}
                onChange={value => this.handleFieldChange(value, 'cost', record.id)}
                onKeyPress={value => this.handleKeyPress(value, record.id)}
              />
            );
          }
          return <span>{numeral(record.cost).format('0,0.00')}</span>;
        },
      }, {
        title: 'Amount',
        dataIndex: 'creditAmount',
        key: 'creditAmount',
        width: '15%',
        align: 'right',
        render: (text, record) => {
          return <span>{record ? numeral(this.calculateLineTotal(record)).format('0,0.00'): 0.00}</span>;
        },
      }, {
        title: '',
        key: 'action',
        align: 'center',
        width: '10%',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.id)} />
                </span>
              );
            }
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.id)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.id)} />
            </span>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table
          className={styles.table}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowSelection={rowSelection}
          rowKey={record => record.id ? record.id : record.key}
        />
      </Fragment>
    );
  }
}
