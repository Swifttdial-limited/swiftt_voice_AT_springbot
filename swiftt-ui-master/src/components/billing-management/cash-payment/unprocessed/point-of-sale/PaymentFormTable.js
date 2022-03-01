import propTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { Form, Input,InputNumber, Table, Popconfirm, Divider, Button, message } from 'antd';
import PaymentModeSelect from '../../../../common/accounting/PaymentModeSelect';

class PaymentFormTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
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
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // Save the original data when entering edit mode
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      paymentMode: '',
      paymentReference: '',
      receivedAmount: null,
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
      this.setState({ data: newData });
    }
  }

  handleFieldNumberChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    
    if (target) {
      target[fieldName] = e;
      this.setState({ data: newData });
    }
  }
  paymentModeSelectHandler = (value, fieldName, key) => {
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
      if (!target.paymentMode || !target.receivedAmount) {
        message.error('Please fill in the full billing information。');
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
  render() {
    const { formItemLayout, billableTotal, form } = this.props;
    const { getFieldDecorator } = form;
    const changeAmount = 0;

    const payments = [];
    const columns = [
      {
        title: 'Channel',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
        width: '30%',
        render: (paymentMode, record) => {
          if (record.editable) {
            return (
              <PaymentModeSelect
                bank={false}
                onPaymentModeSelect={e => this.paymentModeSelectHandler(e, 'paymentMode', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return <span>
            {paymentMode.name} {paymentMode.currency && '(Currency : ' + paymentMode.currency.name + ' - ' + paymentMode.currency.code + ')'}</span>;
        },
      },
      {
        title: ' Reference',
        dataIndex: 'paymentReference',
        key: 'paymentReference',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'paymentReference', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="paymentReference"
              />
            );
          }
          return text;
        },
      },
      {
        title: ' Total',
        dataIndex: 'receivedAmount',
        key: 'receivedAmount',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={e => this.handleFieldNumberChange(e, 'receivedAmount', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="receivedAmount"
              />
            );
          }
          return text;
        },
      }, {
        title: 'operating',
        key: 'action',
        width: '15%',
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
                <a onClick={e => this.saveRow(e, record.key)}>save</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>cancel</a>
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
{/*               
              <a onClick={e => this.toggleEditable(e, record.key)}>edit</a>
              <Divider type="vertical" />
              <Popconfirm title="Do you want to delete this entry？" onConfirm={() => this.remove(record.key)}>
                <a>delete</a>
              </Popconfirm> */}
            </span>
          );
        },
      }];
    return (
      <div>
        {getFieldDecorator('payments', {
          initialValue: payments,
        })(
          <Fragment>
            <Table
              // loading={this.state.loading}
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
            //           rowClassName={(record) => {
            //   return record.editable ? styles.editable : '';
            // }}
            />
            <Button
              style={{ marginTop: 5, marginBottom: 8 }}
              type="dashed"
              onClick={this.newMember}
              icon="plus"
            >
              Add Mode of Payment
              </Button>
          </Fragment>)}
      </div>
    );
  }
}
export default Form.create()(PaymentFormTable);
