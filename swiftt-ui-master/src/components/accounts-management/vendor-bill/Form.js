import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  LocaleProvider,
  Form,
  Input,
  Button,
  Icon,
  Collapse,
  Modal,
  DatePicker,
  Tooltip,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import ContactCard from '../../common/ContactCard';
import ContactSelect from '../../common/ContactSelect';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import TotalAmountCard from '../../common/TotalAmountCard';
import VendorBillItemsTableForm from './VendorBillItemsTableForm';

import { query, queryOne } from '../../../services/procurement/purchaseOrders';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Panel } = Collapse;
const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 9,
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

let vendorBillSubTotal = 0;
let vendorBillTotal = 0;
let vendorBillDiscountTotal = 0;
let vendorBillTaxTotal = 0;

const calculateVendorBillTotal = (items) => {
  vendorBillSubTotal = 0;
  vendorBillTotal = 0;
  vendorBillDiscountTotal = 0;
  vendorBillTaxTotal = 0;

  items.forEach((vendorBillItem) => {
    let lineTotal = (vendorBillItem.quantity * vendorBillItem.cost);

    vendorBillSubTotal += lineTotal;

    // less Discount
    if (vendorBillItem.discount && lineTotal > 0) {
      lineTotal -= vendorBillItem.discount;
      vendorBillDiscountTotal += vendorBillItem.discount;
    }

    // add tax
    if (vendorBillItem.taxCode && vendorBillItem.taxCode.formula !== 'EXEMPT') {
      vendorBillTaxTotal += (lineTotal * vendorBillItem.taxCode.percentage) / 100;
      lineTotal += (lineTotal * vendorBillItem.taxCode.percentage) / 100;
    }

    vendorBillTotal += lineTotal;
  });
};

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculateVendorBillTotal(changedValues.items);
    }
  },
})
class VendorBillForm extends PureComponent {
  static defaultProps = {
    vendorBill: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    vendorBill: PropTypes.object,
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
    vendorBillSubTotal = 0;
    vendorBillTotal = 0;
    vendorBillDiscountTotal = 0;
    vendorBillTaxTotal = 0;
  }

  state = {
    transactionLine: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('vendorBill' in nextProps) {
      if (nextProps.vendorBill.id) {
        calculateVendorBillTotal(nextProps.vendorBill.items);
      }
    }
  }

  contactSelectHandler = (value) => {
    this.props.form.setFieldsValue({ vendor: value });
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
      vendorBill,
      loading,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      validateFields,
    } = form;

    const {
      transactionLine,
    } = this.state;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const detailedTotalAmountCardProps = {
      discountAmount: vendorBillDiscountTotal,
      subtotalAmount: vendorBillSubTotal,
      taxableAmount: vendorBillSubTotal - vendorBillDiscountTotal,
      taxAmount: vendorBillTaxTotal,
      total: vendorBillTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: vendorBillTotal,
    };

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); } else if (!allowPast && allowFuture) {
        return current && current.valueOf() > Date.now();
      }
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onCreate(values); } else {}
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this vendor bill?',
              onOk() {
                onCreateAndSubmit(values);
              },
            });
          } else {}
        }
      });
    }

    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onSave(values); } else {}
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to submit this vendor bill?',
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
          confirm({
            title: 'Are you sure you want to approve this vendor bill?',
            onOk() {
              onApprove(values.items);
            },
          });
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this vendor bill?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('vendorBillTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row gutter={24}>
            <Col span={18}>
              <FormItem label="Vendor:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('vendor', {
                initialValue: vendorBill.vendor ? vendorBill.vendor : null,
                rules: [
                  {
                    required: true,
                    message: 'Vendor must be specified',
                  },
                ],
              })(<ContactSelect
                editValue={vendorBill.vendor ? vendorBill.vendor.name : null}
                onContactSelect={this.contactSelectHandler}
                {...contactSelectProps}
              />)}
              </FormItem>
              <Row gutter={24}>
                <Col span={12}>
                  <ContactCard contact={getFieldValue('vendor') && getFieldValue('vendor')} intent="Bill From" />
                </Col>
                <Col span={12}>
                  <FormItem {...headerFormItemLayout} label="Bill Date" hasFeedback>
                    {getFieldDecorator('billingDate', {
                      initialValue: vendorBill.billingDate ? moment(vendorBill.billingDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                      rules: [
                        {
                            type: 'object',
                            required: true,
                            message: 'Billing Date must be specified',
                        },
                      ],
                    })(<DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
                      disabledDate={disabledDate}
                    />)}
                  </FormItem>
                  <FormItem
                    label={(
                      <span>
                        Invoice:&nbsp;
                        <Tooltip title="Purchase Invoice number or Sales Receipt number ">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    )}
                    hasFeedback
                    {...headerFormItemLayout}
                  >
                    {getFieldDecorator('purchaseInvoiceReference', {
                    initialValue: vendorBill.purchaseInvoiceReference ? vendorBill.purchaseInvoiceReference : null,
                    rules: [
                      {
                        required: true,
                        message: 'Purchase Invoice reference must be specified',
                      },
                    ],
                  })(<Input placeholder="Purchase Invoice or Sale Receipt reference" />)}
                  </FormItem>

                  <FormItem label="Description:" hasFeedback {...headerFormItemLayout}>
                    {getFieldDecorator('description', {
                    initialValue: vendorBill.description ? vendorBill.description : null,
                    rules: [
                      {
                        required: false,
                        message: 'Description must be specified',
                      },
                    ],
                  })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Items" key="1">
              <div>
                {getFieldDecorator('items', {
                initialValue: vendorBill.id ? vendorBill.items : transactionLine,
              })(<VendorBillItemsTableForm
                rowSelectionEnabled={vendorBill.vendorBillStatus === 'IN_PROCESS'}
              />)}
              </div>
            </Panel>
          </Collapse>

          <Row gutter={24}>
            <Col span={15}>
              { vendorBill.id && (
              <FilesView
                readOnly={false}
                context={vendorBill.id}
                contextType="VENDOR_BILL"
              />
            )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                  initialValue: vendorBill.comment,
              })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col span={9}>
              <DetailedTotalAmountCard {...detailedTotalAmountCardProps} />
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { vendorBill.id ? (
                  <div>

                    { vendorBill.vendorBillStatus === 'INCOMPLETE' && (
                    <div>
                      <Button style={{ marginRight: 10 }} loading={loading} type="primary" icon="save" onClick={handleSave}>Save</Button>
                      <Button loading={loading} type="primary" icon="step-forward" onClick={handleSubmit}>Submit</Button>
                    </div>
  )}

                    { vendorBill.vendorBillStatus === 'IN_PROCESS' && (
                    <div>
                      <Button style={{ marginRight: 10 }} loading={loading} htmlType="submit" icon="like" onClick={handleApprove}>Approve</Button>
                      <Button type="danger" loading={loading} htmlType="submit" icon="dislike" onClick={handleReject}>Reject</Button>
                    </div>
  )}
                  </div>
  ) : (
    <div>
      <Button style={{ marginRight: 10 }} loading={loading} type="primary" icon="save" onClick={handleCreate}>Create</Button>
      <Button loading={loading} htmlType="submit" type="primary" icon="save" onClick={handleCreateAndSubmit}>Create &amp; Submit</Button>
    </div>
  )}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </LocaleProvider>
    );
  }
}

export default VendorBillForm;
