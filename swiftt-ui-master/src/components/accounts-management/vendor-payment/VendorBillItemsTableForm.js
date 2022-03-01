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
  Popover,
} from 'antd';
import Ellipsis from '../../Ellipsis';
import numeral from 'numeral';
import moment from 'moment';

import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';

export default class TableForm extends PureComponent {
  static defaultProps = {
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
    status: PropTypes.string,
  };

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
    return (newData || this.state.data).filter(item => item.vendorBill.id === key)[0];
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

      if (!target.vendorBill.id || !target.approvedAmount) {
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

  handleSelectAllRow = (selected, selectedRows, changeRows) => {
    if(selected) {
      selectedRows.forEach(row => this.handleSelectRow(row, selected, selectedRows));
    } else {
      changeRows.forEach(row => this.handleSelectRow(row, selected, changeRows));
    }
  }

  handleSelectRow = (record, selected, selectedRows) => {
    const { data } = this.state;

    if(selected) {
      data.forEach(item => {
        if(record.vendorBill.id === item.vendorBill.id) {
          item.approved = true;

          if(item.approvedAmount === undefined || item.approvedAmount == 0) {
            item.approvedAmount = item.vendorBill.vendorBillAmount - (item.vendorBill.creditNote ? item.vendorBill.creditNote.approvedTotal : 0);
          } else {
            // NOT VERY SURE ABOUT THIS
            //item.approvedAmount = record.approvedAmount;
          }
        }
      });
    } else {
      data.forEach(item => {
        if(record.vendorBill.id === item.vendorBill.id) {
          item.approved = false;
          item.approvedAmount = 0;
        }
      });
    }

    this.setState({
      selectedRows: selectedRows,
      data
    }, () => {
      this.props.onChange(this.state.data);
    });
  }

  render() {
    const { readOnly ,rowSelectionEnabled, status } = this.props;

    const { isFormActive } = this.state;

    const renderCreditNoteHoverContent = (creditNote) => (
      <div style={{ fontSize: '11px' }}>
        <p style={{ marginBottom: 0 }}>
          <span style={{ fontWeight: 700 }}>Credit Note No. :</span> {creditNote.creditNoteNumber}
        </p>
        <p style={{ marginBottom: 0 }}>
          <span style={{ fontWeight: 700 }}>Credit Note Ref:</span> {creditNote.creditNoteReference}
        </p>
        <p style={{ marginBottom: 0 }}>
          <span style={{ fontWeight: 700 }}>Created By:</span> {creditNote.createdBy.fullName}
        </p>
      </div>
    );

    const columns = [
      {
        title: 'Invoice No.',
        dataIndex: 'vendorBill.purchaseInvoiceReference',
        key: 'vendorBill.purchaseInvoiceReference',
        width: '15%',
        render: (text) => {
          return <span>{text}</span>;
        },
      }, {
        title: 'Invoice Date',
        dataIndex: 'vendorBill.purchaseInvoiceDate',
        key: 'vendorBill.purchaseInvoiceDate',
        align: 'center',
        width: '10%',
        render: (text) => <span>{moment(text).local().format(dateFormat)}</span>,
      }, {
        title: 'Invoice Amount',
        dataIndex: 'vendorBill.vendorBillAmount',
        key: 'vendorBill.vendorBillAmount',
        align: 'right',
        width: '10%',
        render: (text) => <span>{`${numeral(text).format('0,0.00')}`}</span>,
      }, {
        title: 'Credit Note',
        dataIndex: 'vendorBill.creditNote',
        key: 'vendorBill.creditNote',
        align: 'right',
        width: '15%',
        render: (text, record) => {
          if(record.vendorBill.creditNote) {
            return (
              <Popover placement="topLeft" content={renderCreditNoteHoverContent(record.vendorBill.creditNote)} title="Credit Note Details">
                <span>{`${numeral(record.vendorBill.creditNote.approvedTotal).format('0,0.00')}`}</span>
              </Popover>
            );
          }
        }
      }, {
        title: 'Paid Amount',
        dataIndex: 'paidAmount',
        key: 'paidAmount',
        align: 'right',
        width: '15%',
        render: (text, record) => <span>{`${numeral(text ? text : record.vendorBill.paidAmount).format('0,0.00')}`}</span>,
      }, {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        width: '10%',
        render: (text, record) => <span>{`${numeral(record.vendorBill.vendorBillAmount - record.vendorBill.paidAmount).format('0,0.00')}`}</span>,
      }, {
        title: 'Amount to Pay',
        dataIndex: 'toPay',
        key: 'toPay',
        align: 'right',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record.approved ? record.approvedAmount : record.vendorBill.vendorBillAmount - record.vendorBill.paidAmount}
                precision={2}
                min={0}
                max={record.vendorBill.vendorBillAmount}
                onChange={value => this.handleFieldChange(value, 'approvedAmount', record.vendorBill.id)}
                onKeyPress={e => this.handleKeyPress(value, record.vendorBill.id)}
              />
            );
          }
          return <span>{numeral(status !== 'APPROVED' && (record.approved || record.approvedAmount) ? record.approvedAmount : 0).format('0,0.00')}</span>;
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
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.vendorBill.id)} />
                <Divider type="vertical" />
                <Button type="dashed" shape="circle" icon="delete" onClick={e => this.cancel(e, record.vendorBill.id)} />
              </span>
            );
          }
          return (
            <span>
              <Button
                disabled={!record.approved}
                type="dashed"
                shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.vendorBill.id)} />
            </span>
          );
        },
      },
    ];

    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow,
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
          rowKey={record => record.vendorBill.id}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
        />
      </Fragment>
    );
  }
}
