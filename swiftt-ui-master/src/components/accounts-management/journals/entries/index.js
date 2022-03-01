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
  Divider,  
  Input,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../../components/FooterToolbar';
import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;
const disabledDate = (current) => {
  if (allowPast) {
    return current && current.valueOf() > Date.now();
  } else if (!allowPast && allowFuture) {
    return current && current.valueOf() < Date.now();
  }
};
const fieldLabels = {
  reference: 'Reference',
  date: 'Date',
  description: 'Description',
  journalDetails: ' Journal Details',
};

const journalDetails = [];

class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
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
    const transactionLines = this.props.form.getFieldValue('transactionLines');
    const errors = [];
    if (transactionLines && transactionLines.length < 2) {
      errors.push(
        new Error('You need to enter at least more than one Journal Entry')
      );
    }
    if (aggregateDebitCredit.creditTotals - aggregateDebitCredit.debitTotals !== 0) {
      errors.push(
        new Error('Your journal details are not balanced')
      );
    }
    this.props.form.setFields({
      transactionLines: {
        value: transactionLines,
        errors: (errors.length > 0 ? errors : null),
      },
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue,
      getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          const formData = getFieldsValue();
          const { transactionReference, transactionLines, description, transactionDate } = formData;
          const journals = transactionLines.map((transaction) => {
            const { account, creditAmount, debitAmount } = transaction;
            if (creditAmount === 0 || creditAmount === null || creditAmount === '') {
              return {
                creditAccount: null,
                debitAccount: account,
                description: transaction.description,
                totalAmount: debitAmount,
                quantity: 1,
              };
            } else if (debitAmount === 0 || debitAmount === null || debitAmount === '') {
              return {
                debitAccount: null,
                creditAccount: account,
                description,
                quantity: 1,
                totalAmount: creditAmount,
              };
            }
            return {};
          });

          const data = {
            transactionType: 'MANUAL',
            sourceReferenceType: 'SYSTEM_USER',
            transactionLines: journals,
            transactionReference,
            description,
            transactionDate,
          };
          dispatch({ type: 'journals/create', payload: data });
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
    return (
      <PageHeaderLayout
        title="Journals"
        content="Enter your journal values, and record a description and details.
      Any line details entered show on activity grids.
      Journals should not be included on your VAT Return unless you
    specifically require an adjustment to your
    return without creating a VAT document such as an invoice."
        wrapperClassName={styles.advancedForm}
      >
        <Card className={styles.card} bordered={false} bodyStyle={{ padding: '5px 20px 0px 20px' }}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
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
                xl={{ span: 6, offset: 2 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={24}
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
                xl={{ span: 8, offset: 2 }}
                lg={{ span: 10 }}
                md={{ span: 24 }}
                sm={24}
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
        {/* <Card title="Journal Entries" bordered={false} bodyStyle={{ padding: '5px 20px 0px 20px' }}> */}
        {getFieldDecorator('transactionLines', {
            initialValue: journalDetails,
          })(<TableForm validateDebitCreditTotals={this.validateTransactionItems} />)}
        {/* </Card> */}

        {/* <FooterToolbar style={{ width: this.state.width }}> */}
        <Divider />
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
}))(Form.create()(AdvancedForm));
