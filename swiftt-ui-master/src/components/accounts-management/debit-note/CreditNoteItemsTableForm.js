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
  DatePicker,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';

import ProductSelect from '../../common/ProductSelect';
import TaxCodeSelect from '../../common/accounting/TaxCodeSelect';

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

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
        data: nextProps.value,
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

  newCreditNoteItem = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      product: {},
      unitPrice: 0,
      quantity: 1,
      totalAmount: 0,
      creditNoteAmount:0,
      packSize: null,
      discount: 0,
      debitAccount: {},
      creditAccount: {},
      taxCode: null,
      editable: true,
      isNew: true,
      approved: false,
    });
    this.index += 1;
    this.setState({ data: newData, isFormActive: true });
  };

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

      if (value && value.stockAccount) {
        target.creditAccount = value.stockAccount;
      }

      if (value && value.packSize) {
        target.packSize = value.packSize;
      }

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
      if (!target.creditAccount) {
        message.error(`Entry  ${target.product.name} does not have credit account`);
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
  
  render() {
    const { isFormActive } = this.state;
    const { rowSelectionEnabled } = this.props;
    const productSelectProps = {
      activated: true,
      autoLoad: false,
      multiSelect: false,
      productTypes: ['MEDICATION', 'SUPPLIES'],
    };
    const taxCodeSelectProps = {
      multiSelect: false,
    };
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
        // width: '25%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <ProductSelect
              disabled
                editValue={record ? record.product.productName : null}
                {...productSelectProps}
                onProductSelect={value => this.handleFieldChange(value, 'product', record.key)}
              />
            );
          }
          return <span>{record.product.productName} ({record.product.productCode})</span>;
        },
      }, {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                disabled
                style={{ width: '100%' }}
                defaultValue={record ? record.quantity : 0.00}
                precision={2}
                min={0}
                onChange={value => this.handleFieldChange(value, 'quantity', record.key)}
                onKeyPress={e => this.handleKeyPress(value, record.key)}
              />
            );
          }
          return <span>{numeral(record.quantity).format('0,0.00')}</span>;
        },
      },
      {
        title: 'Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                disabled
                style={{ width: '100%' }}
                defaultValue={record ? record.unitPrice : 0.00}
                precision={2}
                min={0}
                onChange={value => this.handleFieldChange(value, 'unitPrice', record.key)}
                onKeyPress={e => this.handleKeyPress(value, record.key)}
              />
            );
          }
          return <span>{numeral(record.unitPrice).format('0,0.00')}</span>;
        },
      },
      {
        title: 'Total',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                disabled
                style={{ width: '100%' }}
                defaultValue={record ? record.totalAmount : 0.00}
                precision={2}
                min={0}
                onChange={value => this.handleFieldChange(value, 'totalAmount', record.key)}
                onKeyPress={e => this.handleKeyPress(value, record.key)}
              />
            );
          }
          return <span>{numeral(record.totalAmount).format('0,0.00')}</span>;
        },
      },
      {
        title: 'Credit Note Amounts',
        dataIndex: 'creditNoteAmount',
        key: 'creditNoteAmount',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.totalAmount : 0.00}
                precision={2}
                min={0}
                onChange={value => this.handleFieldChange(value, 'creditNoteAmount', record.key)}
                onKeyPress={e => this.handleKeyPress(value, record.key)}
              />
            );
          }
          return <span>{numeral(record.creditNoteAmount).format('0,0.00')}</span>;
        },
      }, {
        title: '',
        key: 'action',
        width: '5%',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
                </span>
              );
            }
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
            </span>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowKey={record => record.id}
          rowSelection={rowSelection}
        />
      </Fragment>
    );
  }
}
