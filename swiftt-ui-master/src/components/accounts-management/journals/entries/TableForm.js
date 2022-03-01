import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import styles from './style.less';
import AccountSelect from '../../../common/AccountSelect';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      isFormActive: false,
      debitAmountTotal: 0,
      creditAmountTotal: 0,
    };
  }
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
      this.setState({ data: newData, isFormActive: false });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    const aggregateDebitCredit = this.calculateTotals(newData);
    this.setState({
      data: newData,
      isFormActive: false,
      debitAmountTotal: aggregateDebitCredit.debitTotals,
      creditAmountTotal: aggregateDebitCredit.creditTotals,
    });
    this.props.onChange(newData);
    this.props.validateDebitCreditTotals(aggregateDebitCredit);
  }
  newDetail = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      account: '',
      description: '',
      debitAmount: 0,
      creditAmount: 0,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
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
        isFormActive: true 
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
      const aggregateDebitCredit = this.calculateTotals(this.state.data);
      this.props.onChange(this.state.data);
      this.props.validateDebitCreditTotals(aggregateDebitCredit);
      this.setState({
        loading: false,
        isFormActive: false,
        debitAmountTotal: aggregateDebitCredit.debitTotals,
        creditAmountTotal: aggregateDebitCredit.creditTotals,
      });
    }, 500);
  }

  calculateTotals = (data) => {
    const aggregateDebitCredit = data.reduce((aggregate, transactionLine) => {
      const { debitAmount, creditAmount } = transactionLine;
      return {
        debitTotals: (parseFloat(aggregate.debitTotals) + parseFloat(debitAmount)),
        creditTotals: (parseFloat(aggregate.creditTotals) + parseFloat(creditAmount)),
      };
    }, { debitTotals: 0, creditTotals: 0 });
    return aggregateDebitCredit;
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
    const aggregateDebitCredit = this.calculateTotals(newData);
    this.setState({
      data: newData,
      debitAmountTotal: aggregateDebitCredit.debitTotals,
      creditAmountTotal: aggregateDebitCredit.creditTotals,
    });
    this.clickedCancel = false;
  }
  renderFooter = () => {
    return (
      <Fragment>
        <table>
          <tbody>
            <tr className="ant-table-row  ant-table-row-level-0" >
              <td style={{ width: '30%' }}>
                <Button
                  disabled={this.state.isFormActive}
                  style={{ width: '50%' }}
                  type="dashed"
                  onClick={this.newDetail}
                  icon="plus"
                >
                  Add Journal Entry
                </Button>
              </td>
              <td style={{ width: '20%', textAlign: 'right' }}>
                <span className={styles.footerText}> Total </span>
              </td>
              <td style={{ width: '10%' }}>
                <Input disabled value={this.state.debitAmountTotal} />
              </td>
              <td style={{ width: '10%' }}>
                <Input disabled value={this.state.creditAmountTotal} />
              </td>
              <td style={{ width: '10%' }} />
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
  render() {
    const columns = [
      {
        title: 'Account',
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
          return record.account.name;
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
        title: 'Debit',
        dataIndex: 'debitAmount',
        key: 'debitAmount',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'debitAmount', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="Debit"
              />
            );
          }
          return text;
        },
      },
      {
        title: 'Credit',
        dataIndex: 'creditAmount',
        key: 'creditAmount',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'creditAmount', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="Credit"
              />
            );
          }
          return text;
        },
      }, {
        title: 'Action',
        key: 'action',
        width: '10%',
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
