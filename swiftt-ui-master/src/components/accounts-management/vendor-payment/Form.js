import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
import moment from 'moment';
import numeral from 'numeral';
import compact from 'lodash/compact';
import enUS from 'antd/lib/locale-provider/en_US';

import ContactSelect from '../../common/ContactSelect';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import PaymentModeSelect from '../../common/accounting/PaymentModeSelect';
import TotalAmountCard from '../../common/TotalAmountCard';
import VendorBillItemsTableForm from './VendorBillItemsTableForm';

import { query as queryVendorBills } from '../../../services/accounting/vendorBills';
import { queryCreditNoteEntries } from '../../../services/accounting/journals';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { TextArea } = Input;
const Panel = Collapse.Panel;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

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

let vendorPaymentTotal = 0;

const calculateVendorPaymentTotal = (items) => {
  vendorPaymentTotal = 0;

  items
    .filter(item => item.approved || item.approvedAmount)
    .forEach((item) => {
    vendorPaymentTotal += item.approvedAmount;
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    //console.log('onFieldsChange: ', changedFields, allFields);
    if ('bills' in changedFields) {
      calculateVendorPaymentTotal(changedFields.bills.value);
    }
  },
  onValuesChange(_, changedValues, allValues) {
    //console.log('onValuesChange: ', changedValues, allValues);
    if ('bills' in changedValues) {
      calculateVendorPaymentTotal(changedValues.bills);
    }
  },
})
class VendorPaymentForm extends PureComponent {
  static defaultProps = {
    vendorPayment: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    vendorPayment: PropTypes.object,
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

  state = {
    loadingVendorBills: false,
  };

  constructor(props) {
    super(props);
    vendorPaymentTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('vendorPayment' in nextProps) {
      if (nextProps.vendorPayment.id) {
        calculateVendorPaymentTotal(nextProps.vendorPayment.bills);
      }
    }
  }

  contactSelectHandler = value => {
    this.props.form.setFieldsValue({ vendor: value });

    if (value) {
      queryVendorBills({
        status: ['FULLY_PAID', 'NOT_PAID'],
        vendor: value.publicId,
      }).then((response) => {
        response.content.forEach(vendorBill => this.vendorBillToVendorPaymentItemConverter(vendorBill));
      }).catch((e) => {
        this.props.form.setFieldsValue({ bills: [] });
      });
    }
  }

  vendorBillToVendorPaymentItemConverter = (vendorBill) => {
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;

    const paymentItems = getFieldValue('bills') ? getFieldValue('bills') : [];
    paymentItems.push({
      vendorBill: vendorBill,
      approved: false,
      approvedAmount: 0,
    });
    setFieldsValue({ bills: paymentItems });
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
      vendorPayment,
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

    const {
      loadingVendorBills
    } = this.state;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const detailedTotalAmountCardProps = {
      total: vendorPaymentTotal,
    };

    const disabledDate = (current) => {
      if (allowPast) {
        return (current && current.valueOf()) > Date.now();
      } else if (!allowPast && allowFuture) {
        return (current && current.valueOf()) + 10000 <= Date.now();
      }
    };

    const paymentModeSelectProps = {
      multiSelect: false,
      onPaymentModeSelect(paymentMode) {
        setFieldsValue({ paymentMode: paymentMode });
      }
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: vendorPaymentTotal,
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          if (values.bills.length > 0) {
            const payload = values;
            payload.bills = values.bills.filter(vendorBill => vendorBill.approved);

            onCreate(payload);
          } else {}
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.bills.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this vendor payment?',
              onOk() {
                const payload = values;
                payload.bills = values.bills.filter(vendorBill => vendorBill.approved);

                onCreateAndSubmit(payload)
              },
            });
          } else {}
        }
      });
    }

    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.bills.length > 0) { onSave(values) } else {}
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to submit this vendor payment?',
            onOk() {
              onSubmit();
            },
          });
        }
      });
    }

    function handleApprove() {
      validateFields((err, values) => {
        if (!err) {
          const approvedBills = values.bills.filter(item => item.approved);

          if (approvedBills.length > 0) {
            confirm({
              title: 'Are you sure you want to approve this vendor payment?',
              onOk() {
                onApprove(values.bills.filter(vendorBill => vendorBill.approved));
              },
            });
          } else {
            message.warning('Atleast one item must be selected for approval.');
          }
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this vendor payment?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('vendorPaymentTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { vendorPayment.id ? (
                  <div>
                    { vendorPayment.vendorPaymentStatus === 'INCOMPLETE' && (
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
                          icon="save"
                          onClick={handleSave}>Save Draft</Button>
                      </div>
                    )}

                    { vendorPayment.vendorPaymentStatus === 'IN_PROCESS' && (
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
            <Col span={18}>
              <FormItem label="Vendor:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('vendor', {
                  initialValue: vendorPayment.vendor ? vendorPayment.vendor : null,
                  rules: [
                    {
                      required: true,
                      message: 'Vendor must be specified',
                    },
                  ],
                })(<ContactSelect
                  disabled={vendorPayment.vendor ? true : false}
                  editValue={vendorPayment.vendor ? vendorPayment.vendor.name : null}
                  onContactSelect={this.contactSelectHandler}
                  {...contactSelectProps}
                />)}
              </FormItem>
              <FormItem label="Payment Mode:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('paymentMode', {
                  initialValue: vendorPayment.paymentMode ? vendorPayment.paymentMode : null,
                  rules: [
                    {
                      required: true,
                      message: 'Payment mode must be specified',
                    },
                  ],
                })(<PaymentModeSelect
                  editValue={vendorPayment.paymentMode ? vendorPayment.paymentMode.name : null}
                  {...paymentModeSelectProps}
                />)}
              </FormItem>
              <FormItem label="Reference:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('reference', {
                  initialValue: vendorPayment.reference ? vendorPayment.reference : null,
                  rules: [
                    {
                      required: true,
                      message: 'Reference must be specified',
                    },
                  ],
                 })(<Input />)}
              </FormItem>
              <FormItem label="Payment Date:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('paymentDate', {
                  initialValue: vendorPayment.paymentDate ? moment(vendorPayment.paymentDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                  rules: [
                    {
                      required: true,
                      message: 'Payment date must be specified',
                    },
                  ],
                })(
                  <DatePicker
                    format={dateFormat}
                    disabledDate={disabledDate}
                  />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Purchase Invoices" key="1">
              <div>
                {getFieldDecorator('bills', {
                  initialValue: vendorPayment.id ? vendorPayment.bills : [],
                })(<VendorBillItemsTableForm rowSelectionEnabled={true} />)}
              </div>
            </Panel>
          </Collapse>

          {/*
            <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
              <Panel header="Bills" key="1">
                <div>
                  {getFieldDecorator('vendorBills', {
                    initialValue: vendorPayment.id ? vendorPayment.bills : [],
                  })(<VendorPaymentItemsTableForm
                      rowSelectionEnabled={vendorPayment.vendorPaymentStatus === 'IN_PROCESS' ? true : false} />)}
                </div>
              </Panel>
            </Collapse>
          */}

          {/*
            <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
              <Panel header="Credit Notes" key="1">
                <div>
                  {getFieldDecorator('creditNotes', {
                    initialValue: vendorPayment.id ? vendorPayment.creditNotes : [],
                  })(<VendorPaymentItemsTableForm
                      rowSelectionEnabled={vendorPayment.vendorPaymentStatus === 'IN_PROCESS' ? true : false} />)}
                </div>
              </Panel>
            </Collapse>
          */}

          <Row gutter={24}>
            <Col span={15}>
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                    initialValue: vendorPayment.comment,
                 })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col span={9}>
              <DetailedTotalAmountCard {...detailedTotalAmountCardProps} />
            </Col>
          </Row>
        </Form>
      </LocaleProvider>
    );
  }
}

export default VendorPaymentForm;
