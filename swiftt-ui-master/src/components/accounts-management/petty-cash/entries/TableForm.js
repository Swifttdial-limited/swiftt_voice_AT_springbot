import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Tooltip } from 'antd';
import styles from './style.less';
import AccountSelect from '../../../common/AccountSelect';
import numeral from 'numeral';
import { isNull } from 'util';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      isFormActive: false,
      amount: 0.00,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange({ value: value.slice(0, -1) });
    }
    if (onBlur) {
      onBlur();
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  toggleEditable=(e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // Save the original data when entering edit mode
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData, isFormActive: true });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    const aggregateTotal = this.calculateTotals(newData);
    this.setState({
      data: newData,
      isFormActive: false,
      amount: aggregateTotal,
    });
    this.props.onChange({ newData });
    this.props.validateDebitCreditTotals(aggregateTotal);
  }
  newDetail = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      account: '',
      creditAccount: {},
      debitAccount: {},
      description: '',
      amount: 0,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData, isFormActive: true });
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({
        data: newData,
      });
    }
  }

  selectedAccountHandler = (value, fieldName, key) => {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
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
      if (!target.account) {
        message.error('Please fill in the journal details information。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const aggregateTotal = this.calculateTotals(this.state.data);
      this.props.onChange(this.state.data);
      this.props.validateDebitCreditTotals(aggregateTotal);
      this.setState({
        loading: false,
        isFormActive: false,
        amount: aggregateTotal,
      });
    }, 500);
  }

  calculateTotals = (data) => {
    const aggregateTotal = data.reduce((aggregate, transactionLine) => {
      const { amount } = transactionLine;
      return (parseFloat(aggregate) + parseFloat(amount));
    }, 0);
    return aggregateTotal;
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
    const aggregateTotal = this.calculateTotals(newData);
    this.setState({
      data: newData,
      amount: aggregateTotal,
    });
    this.clickedCancel = false;
  }
  renderFooter = () => {
    const { payeeAccount } = this.props;
    return (
      <Fragment>
        <table>
          <tbody>
            <tr className="ant-table-row  ant-table-row-level-0" >
              <td style={{ width: '30%' }}>
                <Button
                  disabled={this.state.isFormActive}
                  style={{ width: '55%' }}
                  type="dashed"
                  onClick={this.newDetail}
                  icon="plus"
                >
                  Add Petty Cash Entry
                </Button>
              </td>
              <td style={{ width: '25%', textAlign: 'right' }}>
                <span className={styles.footerText}> Total </span>
              </td>
              <td style={{ width: '12%' }}>
                <Input
                  disabled
                  value={numeral(this.state.amount).format('0,0.00')}
                  addonAfter={payeeAccount && payeeAccount.tradingCurrency && payeeAccount.tradingCurrency.currency.code ? payeeAccount.tradingCurrency.currency.code : ''}
                />
              </td>
              <td style={{ width: '8%' }} />
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }

  render() {
    const { payeeAccount } = this.props;
    const columns = [
      {
        title: 'Expense Account',
        dataIndex: 'account',
        key: 'account',
        width: '30%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <AccountSelect
                style={{ minWidth: '100%' }}
                onAccountSelect={e => this.selectedAccountHandler(e, 'account', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return `${text.name} (${text.accountNumber})`;
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'description', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="Description"
              />
            );
          }
          return text;
        },
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Tooltip
                trigger={['focus']}
                title={`${text || 1} ${!isNull(payeeAccount.tradingCurrency) && payeeAccount.tradingCurrency.currency.code ? payeeAccount.tradingCurrency.currency.code : ''} = ${!isNull(payeeAccount.tradingCurrency) && payeeAccount.tradingCurrency.rate ? (payeeAccount.tradingCurrency.rate * (text * 1)) : 1}`}
                placement="topLeft"
                overlayClassName="numeric-input"
              >
                <Input
                  value={text}
                  onChange={e => this.handleFieldChange(e, 'amount', record.key)}
                  onKeyPress={e => this.handleKeyPress(e, record.key)}
                  placeholder="Amount"
                  addonAfter={payeeAccount && payeeAccount.tradingCurrency && payeeAccount.tradingCurrency.currency.code ? payeeAccount.tradingCurrency.currency.code : ''}
                />
              </Tooltip>
            );
          }
          return (
            <Input
              value={numeral(text).format('0,0.00')}
              disabled
              addonAfter={payeeAccount && payeeAccount.tradingCurrency && payeeAccount.tradingCurrency.currency.code ? payeeAccount.tradingCurrency.currency.code : ''}
            />
          );
        },
      }, {
        title: 'Action',
        key: 'action',
        width: '8%',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>Save</a>
                  <Divider type="vertical" />
                  <Popconfirm title="Do you want to delete this entry？" onConfirm={() => this.remove(record.key)}>
                    <a>Delete</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>Save</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>Cancel</a>
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
              <Divider type="vertical" />
              <Popconfirm title="Do you want to delete this entry？" onConfirm={() => this.remove(record.key)}>
                <Button type="dashed" icon="delete" />
              </Popconfirm>
            </span>
          );
        },
      }];


    return (
      <Fragment>
        <Table
          className="striped"
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          size="medium"
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          footer={this.renderFooter}
        />
      </Fragment>
    );
  }
}
