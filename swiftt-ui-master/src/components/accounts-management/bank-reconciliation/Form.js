import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  LocaleProvider,
  Card,
  Form,
  Input,
  Button,
  Icon,
  Collapse,
  message,
  Modal,
  DatePicker,
  Divider,
} from 'antd';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import BankReconciliationItemsTableForm from './BankReconciliationItemsTableForm';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 14,
  },
};

const headerFormItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

let totalDeposits = 0;
let totalPayments = 0;

const calculateTotalsAndBalances = (items) => {
  totalDeposits = 0;
  totalPayments = 0;

  items
    .filter(item => item.reconciled)
    .forEach((item) => {
    if(item.deposit) {
      totalDeposits += item.transactionAmount;
    } else {
      totalPayments += item.transactionAmount;
    }
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    //console.log('onFieldsChange: ', changedFields, allFields);
    if ('items' in changedFields) {
      calculateTotalsAndBalances(changedFields.items.value);
    }
  },
})
class BankReconciliationForm extends PureComponent {
  static defaultProps = {
    bankReconciliation: {},
    loading: false,
  };

  static propTypes = {
    bankReconciliation: PropTypes.object,
    currency: PropTypes.string,
    loading: PropTypes.bool,
    success: PropTypes.bool,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
  };

  // componentWillReceiveProps(nextProps) {
  //   if ('bankReconciliation' in nextProps) {
  //     if (nextProps.bankReconciliation.id) {
  //       calculateTotalsAndBalances(nextProps.bankReconciliation.items);
  //     }
  //   }
  // }

  render() {
    const {
      onSave,
      onSubmit,
      form,
      bankReconciliation,
      currency,
      loading,
      success,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldValue,
      validateFields,
      getFieldsValue,
      setFieldsValue
    } = form;

    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onSave(values) } else {}
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          const difference = ((bankReconciliation.statementEndingBalance + bankReconciliation.beginningBalance + totalPayments) - totalDeposits);
          if( difference == 0) {
            if (values.items.length > 0) {
              confirm({
                title: 'Are you sure you want to submit this bank reconciliation?',
                onOk() {
                  onSubmit(values);
                },
              });
            }
          } else {
            message.error('Bank reconciliation still have a difference.');
          }
        }
      });
    }

    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { bankReconciliation.id && (
                  <div>
                    { bankReconciliation.status === 'INCOMPLETE' && (
                      <div>
                        <Button
                          style={{ marginRight: 10 }}
                          loading={loading}
                          type="primary"
                          icon="step-forward"
                          onClick={handleSubmit}>Submit</Button>
                        <Button
                          loading={loading}
                          type="primary"
                          icon="save" onClick={handleSave}>Save Draft</Button>
                      </div>
                    )}
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Card style={{ marginBottom: 10 }}>
            <Row gutter={24}>
              <Col span={18}>
                <Row>
                  <Col span={7}>
                    <h4>Statement Ending Balance</h4>
                    <h3>{currency} {numeral(bankReconciliation.statementEndingBalance).format('0,0.00')}</h3>
                  </Col>
                  <Col span={1}>
                    <h1>-</h1>
                  </Col>
                  <Col span={16}>
                    <h4>Cleared Balance</h4>
                    <h3>{currency} {numeral(bankReconciliation.beginningBalance - totalPayments + totalDeposits).format('0,0.00')}</h3>
                    <Divider dashed style={{ margin: 12 }}/>
                    <Row>
                      <Col span={8}>
                        <h4>Beginning Balance</h4>
                        <h3>{currency} {numeral(bankReconciliation.beginningBalance).format('0,0.00')}</h3>
                      </Col>
                      <Col span={8}>
                        <h4>Payments / Withdrawals</h4>
                        <h3>{currency} {numeral(totalPayments).format('0,0.00')}</h3>
                      </Col>
                      <Col span={8}>
                        <h4>Deposits</h4>
                        <h3>{currency} {numeral(totalDeposits).format('0,0.00')}</h3>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <h1>Difference</h1>
                <h1>
                  <Icon type="info-circle" />
                  &nbsp; {currency} {numeral((bankReconciliation.statementEndingBalance + bankReconciliation.beginningBalance + totalPayments) - totalDeposits).format('0,0.00')}
                </h1>
              </Col>
            </Row>
          </Card>
          <Card>
            <Form>
              <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
                <Panel header="Items" key="1">
                  {getFieldDecorator('items', {
                    initialValue: bankReconciliation.id ? bankReconciliation.items : [],
                  })(<BankReconciliationItemsTableForm
                      account={bankReconciliation.id ? bankReconciliation.paymentMode.assetAccount.publicId : null}
                      endDate={bankReconciliation.id ? moment(bankReconciliation.statementEndingDate).format(dateFormat) : null}
                      rowSelectionEnabled={
                        bankReconciliation.status === 'INCOMPLETE'
                        ? true : false} />)}
                </Panel>
              </Collapse>

              {/*
                <Row gutter={24}>
                  <Col span={15}>
                    <p>Other charges and interest earned here</p>
                  </Col>
                  <Col span={9}>
                    <p>Final Total hapa</p>
                  </Col>
                </Row>
              */}

            </Form>
          </Card>
        </div>
      </LocaleProvider>
    );
  }
}

export default BankReconciliationForm;
