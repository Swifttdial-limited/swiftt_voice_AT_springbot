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
  Modal,
  DatePicker,
  Radio,
  message,
} from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import ContactSelect from '../../common/ContactSelect';
import FilesView from '../../common/files';
import GoodsOrderItemsTableForm from './GoodsOrderItemsTableForm';
import ServicesOrderItemsTableForm from './ServicesOrderItemsTableForm';
import TotalAmountCard from '../../common/TotalAmountCard';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Panel } = Collapse;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

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

let purchaseOrderSubTotal = 0;
let purchaseOrderTotal = 0;
let purchaseOrderDiscountTotal = 0;
let purchaseOrderTaxTotal = 0;

const calculatePurchaseOrderTotal = (items) => {
  purchaseOrderSubTotal = 0;
  purchaseOrderTotal = 0;
  purchaseOrderDiscountTotal = 0;
  purchaseOrderTaxTotal = 0;

  items.forEach((purchaseOrderItem) => {
    let lineTotal = 0;
    let discount = 0;
    let tax = 0;

    lineTotal = (purchaseOrderItem.quantity * purchaseOrderItem.cost);

    purchaseOrderSubTotal += lineTotal;

    // less Discount
    if (purchaseOrderItem.discount && lineTotal > 0) {
      discount = (lineTotal * purchaseOrderItem.discount) / 100;

      lineTotal -= discount;
      purchaseOrderDiscountTotal += discount;
    }

    // add tax
    if (purchaseOrderItem.taxCode) {
      if(purchaseOrderItem.taxCode.formula === 'EXCLUSIVE') {
        tax += (lineTotal * purchaseOrderItem.taxCode.percentage) / 100;
      } else if (purchaseOrderItem.taxCode.formula === 'INCLUSIVE') {
        tax += (lineTotal * purchaseOrderItem.taxCode.percentage) / 100;
      }

      lineTotal += tax;
      purchaseOrderTaxTotal += tax;
    }

    purchaseOrderTotal += lineTotal;
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    //console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    //console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculatePurchaseOrderTotal(changedValues.items);
    }
  },
})
class PurchaseOrderForm extends PureComponent {
  static defaultProps = {
    purchaseOrder: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    purchaseOrder: PropTypes.object,
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
    purchaseOrderSubTotal = 0;
    purchaseOrderTotal = 0;
    purchaseOrderDiscountTotal = 0;
    purchaseOrderTaxTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('purchaseOrder' in nextProps) {
      if (nextProps.purchaseOrder.id) {
        calculatePurchaseOrderTotal(nextProps.purchaseOrder.items);
      }
    }
  }

  contactSelectHandler = value => this.props.form.setFieldsValue({ vendor: value });

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onApprove,
      onReject,
      form,
      purchaseOrder,
      loading,
      success,
      login,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldValue,
      validateFields,
      getFieldsValue,
      setFieldsValue
    } = form;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const detailedTotalAmountCardProps = {
      discountAmount: purchaseOrderDiscountTotal,
      subtotalAmount: purchaseOrderSubTotal,
      taxableAmount: purchaseOrderSubTotal - purchaseOrderDiscountTotal,
      taxAmount: purchaseOrderTaxTotal,
      total: purchaseOrderTotal,
    };

    const disabledDate = (current) => {
      if (allowPast) {
        return current && current.valueOf() > Date.now();
      } else if (!allowPast && allowFuture) {
        return (current && current.valueOf()) + 10000 <= Date.now();
      }
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: purchaseOrderTotal,
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onCreate(values) } else { }
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this purchase order?',
              onOk() {
                onCreateAndSubmit(values)
              },
            });
          } else { }
        }
      });
    }

    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onSave(values) } else { }
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to submit this purchase order?',
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
          const approvedItems = values.items.filter(item => item.approved);

          if(approvedItems.length > 0) {
            confirm({
              title: 'Are you sure you want to approve this purchase order?',
              onOk() {
                onApprove(approvedItems);
              },
            });
          } else {
            message.warning('At least one item must be selected for approval.');
          }
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this purchase order?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    const itemsTableForm = (getFieldValue('purchaseOrderType') === undefined || getFieldValue('purchaseOrderType') === 'GOODS') ? (
      <GoodsOrderItemsTableForm
        enableAddItem={(purchaseOrder.purchaseOrderStatus === 'IN_PROCESS') ? false : true}
        allowProcessing={purchaseOrder.purchaseOrderStatus === 'IN_PROCESS' ? true : false}
        rowSelectionEnabled={purchaseOrder.purchaseOrderStatus === 'IN_PROCESS' ? true : false} />
    ) : (
      <ServicesOrderItemsTableForm
        enableAddItem={(purchaseOrder.purchaseOrderStatus === 'IN_PROCESS') ? false : true}
        allowProcessing={purchaseOrder.purchaseOrderStatus === 'IN_PROCESS' ? true : false}
        rowSelectionEnabled={purchaseOrder.purchaseOrderStatus === 'IN_PROCESS' ? true : false} />
    );

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                {purchaseOrder.id ? (
                  <div>
                    {purchaseOrder.purchaseOrderStatus === 'INCOMPLETE' && (
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

                    {purchaseOrder.purchaseOrderStatus === 'IN_PROCESS' && (
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
              <FormItem label="Vendor:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('vendor', {
                  initialValue: purchaseOrder.vendor ? purchaseOrder.vendor : null,
                  rules: [
                    {
                      required: true,
                      message: 'Vendor must be specified',
                    },
                  ],
                })(<ContactSelect
                  editValue={purchaseOrder.vendor ? purchaseOrder.vendor.name : null}
                  onContactSelect={this.contactSelectHandler}
                  {...contactSelectProps}
                />)}
              </FormItem>
              <FormItem label="Order Date:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('raisedDate', {
                  initialValue: purchaseOrder.raisedDate ? moment(purchaseOrder.raisedDate, dateFormat) : null,
                })(
                  <DatePicker
                    format={dateFormat}
                    disabledDate={disabledDate}
                  />)}
              </FormItem>
              <FormItem label="Type of Purchase Order" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('purchaseOrderType', {
                  initialValue: purchaseOrder.purchaseOrderType ? purchaseOrder.purchaseOrderType : 'GOODS',
                  rules: [
                    {
                      required: true,
                      message: 'Type of Purchase Order must be specified',
                    },
                  ],
                })(
                  <RadioGroup disabled={getFieldValue('items') ? getFieldValue('items').length > 0 : false}>
                    <Radio value="GOODS">Goods</Radio>
                    <Radio value="SERVICE">Services</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Order Items" key="1">
              <div>
                {getFieldDecorator('items', {
                  initialValue: (purchaseOrder.id || purchaseOrder.items) ? purchaseOrder.items : [],
                })(itemsTableForm)}
              </div>
            </Panel>
          </Collapse>

          <Row gutter={24}>
            <Col span={15}>
              {purchaseOrder.id && (
                <FilesView
                  readOnly={false}
                  context={purchaseOrder.id}
                  contextType="PURCHASE_ORDER" />
              )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                  initialValue: purchaseOrder.comment,
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

export default PurchaseOrderForm;
