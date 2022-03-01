import React, { PureComponent, Fragment } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Divider,
  Popover,
  Radio,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../../components/FooterToolbar';
import PaymentModeSelect from '../../../common/accounting/PaymentModeSelect';
import TableForm from './TableForm';
import styles from './style.less';

const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const disabledDate = (current) => {
  if (allowPast) {
    return current && current.valueOf() > Date.now();
  } else if (!allowPast && allowFuture) {
    return current && current.valueOf() < Date.now();
  }
};
const fieldLabels = {
  reference: 'Cheque/Ref No',
  date: 'Date',
  description: 'Description',
  journalDetails: ' Journal Details',
};

const journalDetails = [];

class BankingForm extends PureComponent {
  state = {
    width: '100%',
    payeeAccount: {},
    bankingType: 'DEPOSIT',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  dateOfJournalChangeHandler = (date, dateString) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ transactionDate: dateString });
  };
  validateTransactionItems = (aggregateDebitCredit) => {
    // const transactionLines = this.props.form.getFieldValue('transactionLines');
    // const errors = [];
    // if (transactionLines && transactionLines.length < 2) {
    //   errors.push(
    //     new Error('You need to enter at least more than one Journal Entry')
    //   );
    // }
    // if (aggregateDebitCredit.creditTotals - aggregateDebitCredit.debitTotals !== 0) {
    //   errors.push(
    //     new Error('Your journal details are not balanced')
    //   );
    // }
    // this.props.form.setFields({
    //   transactionLines: {
    //     value: transactionLines,
    //     errors: (errors.length > 0 ? errors : null),
    //   },
    // });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }
  selectedAccountHandler = (value) => {
    this.setState({ payeeAccount: value });
  };

  render() {
    const { form, dispatch, submitting } = this.props;
    const { payeeAccount, bankingType } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue,
      getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          const formData = getFieldsValue();
          const { transactionReference, transactionLines, description, transactionDate } = formData;
          const journals = transactionLines.map((transaction) => {
            const { account, amount } = transaction;
            if (bankingType === 'DEPOSIT') {
              return {
                debitAccount: payeeAccount.assetAccount,
                creditAccount: account,
                totalAmount: amount,
                description: transaction.description,
              };
            } else if (bankingType === 'WITHDRAW') {
              return {
                debitAccount: account,
                creditAccount: payeeAccount.assetAccount,
                totalAmount: amount,
                description: transaction.description,
              };
            }
            return {};
          });

          const data = {
            transactionType: `BANKING_${bankingType}`,
            sourceReferenceType: 'SYSTEM_USER',
            transactionLines: journals,
            transactionReference,
            description,
            transactionDate,
          };
          dispatch({ type: 'banking/create', payload: data });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;

      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li
            key={key}
            className={styles.errorListItem}
            onClick={() => scrollToField(key)}
          >
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="Journal verification information"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const clearPayeeAccount = () => {
      this.setState({ payeeAccount: {} });
    };
    const handleBankingType = (e) => {
      this.setState({ bankingType: e.target.value });
    };

    return (
      <PageHeaderLayout
        title="Banking"
        content="Enter your banking values, and record a description and details.
      Any line details entered show on activity grids.
      Journals should not be included on your VAT Return unless you
    specifically require an adjustment to your
    return without creating a VAT document such as an invoice."
        wrapperClassName={styles.advancedForm}
      >
        <Card className={styles.card} bordered={false} bodyStyle={{ padding: '0px 20px 0px 20px' }}>
          <Form layout="vertical" >
            <Row gutter={8}>
              <Col
                  // xl={{ span: 8, offset: 2 }}
                  // lg={{ span: 10 }}
                md={{ span: 3 }}
                  // sm={24}
              >
                <Form.Item
                  label="Banking Type"
                >
                  {getFieldDecorator('bankingType', {
                      validateTrigger: ['onChange', 'onBlur'],
                      initialValue: 'DEPOSIT',
                      rules: [
                        {
                          required: true,
                          message: 'Select type of banking',
                        }],
                    })(
                      <RadioGroup onChange={handleBankingType} >
                        <Radio style={radioStyle} value="DEPOSIT">Deposit</Radio>
                        <Radio style={radioStyle} value="WITHDRAW">Withdraw</Radio>
                      </RadioGroup>,
                    )}
                </Form.Item>
              </Col>
              <Col
                // xl={{ span: 8, offset: 2 }}
                // lg={{ span: 10 }}
                md={{ span: 8 }}
                // sm={24}
              >
                {payeeAccount.id && (
                  <Form.Item
                    label={(bankingType === 'DEPOSIT' ? 'Deposit To ' : 'Withdraw From')}
                  >
                    <Input value={payeeAccount.name} readOnly addonAfter={<Icon type="close" onClick={clearPayeeAccount} />} />
                  </Form.Item>
                )}
                {!payeeAccount.id && (
                <Form.Item
                  label={(bankingType === 'DEPOSIT' ? 'Deposit Account' : 'Withdraw Account')}
                >
                  {getFieldDecorator('payeeAccount', {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          message: 'Please input a payee account',
                        }],
                    })(
                      <PaymentModeSelect
                        onPaymentModeSelect={value => this.selectedAccountHandler(value)}
                        bank={true}
                      />
                    )}
                </Form.Item>
                )}
              </Col>
              <Col
                // xl={{ span: 8, offset: 2 }}
                // lg={{ span: 10 }}
                md={{ span: 4 }}
                // sm={24}
              >
                <Form.Item label={fieldLabels.reference}>
                  {getFieldDecorator('transactionReference', {
                    rules: [{ required: true,
                      message: 'Reference for the' +
                      ' journal is required' }],
                  })(
                    <Input placeholder="Enter Journal Reference" />,
                  )}
                </Form.Item>
              </Col>
              <Col
                // xl={{ span: 8, offset: 2 }}
                // lg={{ span: 10 }}
                md={{ span: 4 }}
                // sm={24}
              >
                <Form.Item label={fieldLabels.date}>
                  {getFieldDecorator('transactionDate', {
                    initialValue: moment(),
                    rules: [
                      {
                        required: true,
                      message: 'Please select' +
                      ' journal date',
                      },
                     ],
                  })(
                    <DatePicker
                      format={dateFormat}
                      disabledDate={disabledDate}
                      onChange={this.dateOfJournalChangeHandler}
                      style={{ width: '100%' }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col
                // xl={{ span: 8, offset: 2 }}
                // lg={{ span: 10 }}
                md={{ span: 4 }}
                // sm={24}
              >
                <Form.Item label={fieldLabels.description}>
                  {getFieldDecorator('description', {
                    rules: [
                      {
                        required: true,
                      message: 'Please ledger description!' }],
                  })(
                    <Input placeholder="Enter reference name" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        
        {/* <Card bordered={false} bodyStyle={{ padding: '5px 20px 0px 20px' }}> */}
          {getFieldDecorator('transactionLines', {
            initialValue: journalDetails,
          })(<TableForm validateDebitCreditTotals={this.validateTransactionItems} />)}
        {/* </Card> */}
        <Divider />
        {/* <FooterToolbar style={{ width: this.state.width }}> */}
          {getErrorInfo()}
          <Button type="primary" disabled={this.hasErrors(getFieldsError())} onClick={validate} loading={submitting}>
            Save
          </Button>
        {/* </FooterToolbar> */}
      </PageHeaderLayout>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(BankingForm));
