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
import Ellipsis from '../../Ellipsis';
import numeral from 'numeral';
import moment from 'moment';

import AccountSelect from '../../common/AccountSelect';

import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';

export default class TableForm extends PureComponent {
  static defaultProps = {
    allowProcessing: false,
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    allowProcessing: PropTypes.bool,
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
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

      if (!target.id || !target.paymentAmount) {
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
    console.log(selectedRows);
    const { allowProcessing } = this.props;
    const { data } = this.state;

    if(selected) {
      data.forEach(item => {
        if(record.id === item.id) {
          item.approved = true;

          if(!allowProcessing) {
            if(item.approvedAmount == 0) {
              item.approvedAmount = item.invoiceAmount;
            } else {
              item.approvedAmount = 0;
            }
          }
        }
      });
    } else {
      data.forEach(item => {
        if(record.id === item.id) {
          item.approved = false;

          if(!allowProcessing) {
            item.approvedAmount = 0;
          }
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
    const { readOnly ,rowSelectionEnabled } = this.props;

    const { isFormActive } = this.state;

    const creditAccountSelectProps = {
      disabled: true,
      onAccountSelect: () => {},
    };

    const columns = [
      {
        title: 'Invoice No.',
        dataIndex: 'customerInvoice.invoiceNumber',
        key: 'customerInvoice.invoiceNumber',
        align: 'center',
        width: '10%',
        render: (text) => {
          return <span>{text}</span>;
        },
      }, {
        title: 'Patient',
        dataIndex: 'customerInvoice.patient.user.fullName',
        key: 'customerInvoice.patient.user.fullName',
        width: '15%',
        render: text => <span lines={1}>{text}</span>,
      }, {
        title: 'Date',
        dataIndex: 'customerInvoice.transactionDate',
        key: 'customerInvoice.transactionDate',
        align: 'center',
        width: '10%',
        render: text => <span>{moment(text).local().format(dateFormat)}</span>,
      }, {
        title: 'Invoice Amount',
        dataIndex: 'customerInvoice.invoiceAmount',
        key: 'customerInvoice.InvoiceAmount',
        align: 'right',
        width: '10%',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: 'Paid Amount',
        dataIndex: 'approvedAmount',
        key: 'approvedAmount',
        align: 'right',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record.customerInvoice.approved ? record.approvedAmount : 0}
                precision={2}
                min={0}
                max={record.customerInvoice.invoiceAmount}
                onChange={value => this.handleFieldChange(value, 'approvedAmount', record.customerInvoice.id)}
                onKeyPress={e => this.handleKeyPress(value, record.customerInvoice.id)}
              />
            );
          }
          return <span>{numeral(record.customerInvoice.approved || record.approvedAmount ? record.approvedAmount : 0).format('0,0.00')}</span>;
        },
      }, {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        width: '10%',
        render: (text, record) => <span>{numeral(record.customerInvoice.InvoiceAmount - record.approvedAmount).format('0,0.00')}</span>,
      }, {
        title: 'Amount to Receive',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: '10%',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: 'Debit Note Amount',
        dataIndex: 'creditAmount',
        key: 'creditAmount',
        align: 'right',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                disabled
                style={{ width: '100%' }}
                defaultValue={0}
                min={0}
                max={record.customerInvoice.amount}
                onChange={value => this.handleFieldChange(value, 'creditAmount', record.customerInvoice.id)}
              />
            );
          }
          return <span>{numeral(record.creditAmount ? record.creditAmount : 0).format('0,0.00')}</span>;
        },
      }, {
        title: 'Debit Note Account',
        dataIndex: 'creditAccount',
        key: 'creditAccount',
        width: '30%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <AccountSelect {...creditAccountSelectProps} />
            );
          }
          return <span>{record.customerInvoice.creditAccount ? record.customerInvoice.creditAccount.name : null}</span>;
        },
      }, {
        title: '',
        key: 'action',
        align: 'center',
        width: '5%',
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
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.customerInvoice.id)} />
                <Divider type="vertical" />
                <Button type="dashed" shape="circle" icon="delete" onClick={e => this.cancel(e, record.customerInvoice.id)} />
              </span>
            );
          }
          return (
            <span>
              <Button
                disabled={!record.customerInvoice.approved}
                type="dashed"
                shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.customerInvoice.id)} />
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
        name: record.customerInvoice.name,
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
          rowKey={record => record.customerInvoice.id}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
        />
      </Fragment>
    );
  }
}
