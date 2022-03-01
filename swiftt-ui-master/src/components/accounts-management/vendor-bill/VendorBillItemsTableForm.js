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
import { forEach } from 'lodash';

import AccountSelect from '../../common/AccountSelect';
import TaxCodeSelect from '../../common/accounting/TaxCodeSelect';

import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

export default class TableForm extends PureComponent {

  static defaultProps = {
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    data: [],
    loading: false,
    isFormActive: false,
    selectedRows: [],
  };
  index = 0;
  cacheOriginData = {};

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      // if(nextProps.value.length > 0) {
      //   forEach(nextProps.value, function(item, key) {
      //     if(item.key === undefined) {
      //       item.key = `NEW_TEMP_ID_${key}`;
      //     }
      //   });
      //   this.index = nextProps.value.length - 1;
      // }
      this.setState({
        data: nextProps.value ? nextProps.value.map((x) => {
          x.key = x.id;
          return x;
        }) : [],
      });
    }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

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

  newGoodsReceiptNoteItem = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      description: '',
      cost: 0,
      quantity: 1,
      account: null,
      discount: 0,
      taxCode: null,
      comment: '',
      editable: true,
      isNew: true,
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

      if (!target.description.length > 0 || !target.quantity || !target.account) {
        message.error('All required fields must be specified');
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
    const { readOnly, rowSelectionEnabled } = this.props;

    const { isFormActive } = this.state;

    const disabledDate = (current) => {
      if (allowPast) {
        return (current && current.valueOf()) > Date.now();
      } else if (!allowPast && allowFuture) {
        return (current && current.valueOf()) + 10000 <= Date.now();
      }
    };

    const accountSelectProps = {
      multiSelect: false,
    };

    const taxCodeSelectProps = {
      multiSelect: false,
    };

    const columns = [
      {
        title: 'Item',
        dataIndex: 'description',
        key: 'description',
        width: '25%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                style={{ width: '100%' }}
                onChange={value => this.handleFieldChange(value.target.value, 'description', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)} />
            );
          }
          return <span>{record.description}</span>;
        },
      }, {
        title: 'Qty',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '8%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.quantity : 0}
                min={1}
                onChange={value => this.handleFieldChange(value, 'quantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text;
        },
      }, {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.cost : 0.00}
                precision={2}
                min={0}
                onChange={value => this.handleFieldChange(value, 'cost', record.key)}
                onKeyPress={e => this.handleKeyPress(value, record.key)}
              />
            );
          }
          return <span>{numeral(record.cost).format('0,0.00')}</span>;
        },
      }, {
        title: 'Discount %',
        dataIndex: 'discount',
        key: 'discount',
        width: '8%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.discount : 0.00}
                precision={2}
                min={0}
                max={100}
                onChange={value => this.handleFieldChange(value, 'discount', record.key)}
                onKeyPress={e => this.handleKeyPress(value, record.key)}
              />
            );
          }
          return <span>{numeral(record.discount).format('0,0.00')}</span>;
        },
      }, {
        title: 'Tax',
        dataIndex: 'taxCode.name',
        key: 'taxCode.name',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TaxCodeSelect
                {...taxCodeSelectProps}
                editValue={record.taxCode ? record.taxCode.name : null}
                onTaxCodeSelect={value => this.handleFieldChange(value, 'taxCode', record.key)}
              />
            );
          }
          return <span>{record.taxCode ? record.taxCode.name : null}</span>;
        },
      }, {
        title: 'Account',
        dataIndex: 'account.name',
        key: 'account.name',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <AccountSelect
                {...accountSelectProps}
                editValue={record.account ? record.account : null}
                onAccountSelect={value => this.handleFieldChange(value, 'account', record.key)}
              />
            );
          }
          return <span>{record.account ? record.account.name : null}</span>;
        },
      }, {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: '10%',
        render: (text, record) => {
          let grossTotal = 0;
          let lineTotalTax = 0;
          let lineTotal = 0;
          if (record) {
            const { discount, cost, taxCode, quantity } = record;
            if (cost && quantity) {
              lineTotal = ((quantity * cost) - discount);
              if (taxCode) {
                const { percentage, formula } = taxCode;
                lineTotalTax = (percentage && formula !== 'EXEMPT' ? (lineTotal * (percentage / 100)) : 0);
              }
            }
            grossTotal = (lineTotal + lineTotalTax);
          }
          return <span>{numeral(grossTotal).format('0,0.00')}</span>;
        },
      }, {
        title: '',
        key: 'action',
        width: '8%',
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
                  <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
                  <Divider type="vertical" />
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
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
        />
        {!readOnly && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newGoodsReceiptNoteItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}
      </Fragment>
    );
  }
}
