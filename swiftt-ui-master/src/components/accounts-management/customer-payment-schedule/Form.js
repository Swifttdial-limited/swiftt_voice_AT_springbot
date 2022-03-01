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
  List,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import numeral from 'numeral';

import ContactSelect from '../../common/ContactSelect';
import CustomerPaymentItemsTableForm from './CustomerPaymentItemsTableForm';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import PaymentModeSelect from '../../common/accounting/PaymentModeSelect';
import TotalAmountCard from '../../common/TotalAmountCard';

import { queryCustomerInvoices } from '../../../services/accounting/journals';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { TextArea } = Input;
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

let customerPaymentTotal = 0;

const calculateCustomerBill = (items) => {
  customerPaymentTotal = 0;

  items.filter(item => item.approved || item.approvedAmount).forEach((item) => {
    const lineTotal = item.approvedAmount;
    customerPaymentTotal += lineTotal;
  });
};

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
    if ('items' in changedFields) {
      calculateCustomerBill(changedFields.items.value);
    }
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculateCustomerBill(changedValues.items);
    }
  },
})
class CustomerBillForm extends PureComponent {
  static defaultProps = {
    customerPayment: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    customerPayment: PropTypes.object,
    formType: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    success: PropTypes.bool,
    onCreate: PropTypes.func,
    onCreateAndSubmit: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
  };

  constructor(props) {
    super(props);
    customerPaymentTotal = 0;

    this.state = {
      loadingCustomerInvoices: false,
      customerInvoices: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('customerPayment' in nextProps) {
      if (nextProps.customerPayment.id) {
        calculateCustomerBill(nextProps.customerPayment.items);
      }
    }
  }

  contactSelectHandler = (value) => {
    this.props.form.setFieldsValue({ customer: value });

    if (value) {
      this.setState({ loadingCustomerInvoices: true });

      queryCustomerInvoices({
        customer: value.publicId,
      }).then((response) => {
        this.setState({
          loadingCustomerInvoices: false,
          customerInvoices: response.content,
          // customerInvoices: response.content.filter(customerInvoice => customerInvoice.customerPayment === null),
        }, () => {
          this.props.form.setFieldsValue({ items: [] });
          response.content.forEach(customerInvoice => this.customerInvoiceSelectHandler(customerInvoice));
        });
      }).catch((e) => {
        this.setState({
          loadingCustomerInvoices: false,
          customerInvoices: [],
        });
      });
    }
  }

  customerInvoiceSelectHandler = (selectedCustomerInvoice) => {
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;

    this.setState((currentState, previousProps) => {
      return {
        customerInvoices: currentState.customerInvoices.filter(customerInvoice => customerInvoice.id !== selectedCustomerInvoice.id),
      };
    }, () => {
      const customerPaymentItems = getFieldValue('items') ? getFieldValue('items') : [];
      customerPaymentItems.push({
        id: selectedCustomerInvoice.id,
        customer: selectedCustomerInvoice.customer,
        approved: false,
        patient: selectedCustomerInvoice.patient,
        invoiceNumber: selectedCustomerInvoice.invoiceNumber,
        invoiceAmount: selectedCustomerInvoice.invoiceAmount,
        approvedAmount: 0,
        customerInvoice: selectedCustomerInvoice,
      });
      setFieldsValue({ items: customerPaymentItems });
    });
  }

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onApprove,
      onReject,
      form,
      customerPayment,
      loading,
      success,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldValue,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const { loadingCustomerInvoices, customerInvoices } = this.state;

    const detailedTotalAmountCardProps = {
      total: customerPaymentTotal,
    };

    const disabledDate = (current) => {
      if (allowPast) {
        return (current && current.valueOf()) > Date.now();
      } else if (!allowPast && allowFuture) {
        return (current && current.valueOf()) + 10000 <= Date.now();
      }
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: customerPaymentTotal,
    };

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'CUSTOMER',
    };
    const paymentModeSelectProps = {
      multiSelect: false,
      onPaymentModeSelect(paymentMode) {
        setFieldsValue({ paymentMode });
      },
    };
    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            const payload = values;
            payload.items = values.items.filter(customerInvoice => customerInvoice.approved);

            onCreate({ ...payload, amount: customerPaymentTotal });
          } else { }
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this customer bill?',
              onOk() {
                const payload = values;
                payload.items = values.items.filter(customerInvoice => customerInvoice.approved);

                onCreateAndSubmit({ ...payload, amount: customerPaymentTotal });
              },
            });
          } else { }
        }
      });
    }

    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onSave({ ...values, amount: customerPaymentTotal }); } else { }
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to submit this customer bill?',
              onOk() {
                onSubmit();
              },
            });
          } else { }
        }
      });
    }

    function handleApprove() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to approve this customer payment?',
            onOk() {
              onApprove(values.items.filter(customerInvoice => customerInvoice.approved));
            },
          });
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this customerPayment?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('customerPaymentTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                {customerPayment.id ? (
                  <div>

                    {customerPayment.customerPaymentStatus === 'INCOMPLETE' && (
                      <div>
                        <Button
                          style={{ marginRight: 10 }}
                          loading={loading}
                          type="primary"
                          icon="step-forward"
                          onClick={() => console.log("handleSubmit")}>Submit</Button>
                        <Button
                          loading={loading}
                          type="primary"
                          icon="save"
                          onClick={() => console.log("handleSave")}>Save Draft</Button>
                      </div>
                    )}

                    {customerPayment.customerPaymentStatus === 'IN_PROCESS' && (
                      <div>
                        <Button
                          style={{ marginRight: 10 }}
                          loading={loading}
                          htmlType="submit"
                          icon="like"
                          onClick={handleApprove}>Approve</Button>
                        <Button
                          type="danger"
                          loading={loading}
                          htmlType="submit"
                          icon="dislike"
                          onClick={handleReject}>Reject</Button>
                      </div>
                    )}
                  </div>
                ) : (
                    <div>
                      <Button
                        style={{ marginRight: 10 }}
                        loading={loading}
                        htmlType="submit"
                        type="primary"
                        icon="step-forward"
                        onClick={handleCreateAndSubmit}>Submit</Button>
                      <Button
                        loading={loading}
                        type="primary"
                        icon="save"
                        onClick={handleCreate}>Save Draft</Button>
                    </div>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <FormItem label="Customer:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('customer', {
                  initialValue: customerPayment.customer ? customerPayment.customer : null,
                  rules: [
                    {
                      required: true,
                      message: 'Customer must be specified',
                    },
                  ],
                })(<ContactSelect
                  editValue={customerPayment.customer ? customerPayment.customer.name : null}
                  onContactSelect={this.contactSelectHandler}
                  {...contactSelectProps}
                />)}
              </FormItem>
              
            </Col>
            <Col span={8}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Customer Invoices" key="1">
              <div>
                {getFieldDecorator('items', {
                  initialValue: customerPayment.id ? customerPayment.items : [],
                })(<CustomerPaymentItemsTableForm
                  allowProcessing={customerPayment.customerPaymentStatus === 'IN_PROCESS' ? true : false}
                  rowSelectionEnabled={true}
                />)}
              </div>
            </Panel>
          </Collapse>

          <Row gutter={24} style={{ marginBottom: 10 }}>
            <Col span={12}>
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                  initialValue: customerPayment.comment,
                })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <DetailedTotalAmountCard {...detailedTotalAmountCardProps} />
            </Col>
          </Row>
        </Form>
      </LocaleProvider>
    );
  }
}

export default CustomerBillForm;
