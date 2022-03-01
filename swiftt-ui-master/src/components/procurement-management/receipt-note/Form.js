import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  LocaleProvider,
  List,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Icon,
  Collapse,
  Modal,
  DatePicker,
  Radio,
  Tooltip,
  message,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import ChargesItemsTableForm from '../../common/charges/ChargesItemsTableForm';
import ContactSelect from '../../common/ContactSelect';
import DepartmentSelect from '../../common/DepartmentSelect';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import GoodsReceiptNoteItemsTableForm from './GoodsReceiptNoteItemsTableForm';
import LocationSelect from '../../common/LocationSelect';
import ServicesReceiptNoteItemsTableForm from './ServicesReceiptNoteItemsTableForm';
import TotalAmountCard from '../../common/TotalAmountCard';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Panel } = Collapse;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

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

let receiptNoteSubTotal = 0;
let receiptNoteTotal = 0;
let receiptNoteDiscountTotal = 0;
let receiptNoteTaxTotal = 0;

const calculateReceiptNoteTotal = (items) => {
  receiptNoteSubTotal = 0;
  receiptNoteTotal = 0;
  receiptNoteDiscountTotal = 0;
  receiptNoteTaxTotal = 0;

  items.filter(item => item.approved).forEach((receiptNoteItem) => {
    let lineTotal = 0;
    let discount = 0;
    let tax = 0;

    lineTotal = (receiptNoteItem.receivedQuantity * receiptNoteItem.cost);

    receiptNoteSubTotal += lineTotal;

    // less Discount
    if (receiptNoteItem.discount && lineTotal > 0) {
      discount = (lineTotal * receiptNoteItem.discount) / 100;

      lineTotal -= discount;
      receiptNoteDiscountTotal += discount;
    }

    // add tax
    if (receiptNoteItem.taxCode) {
      if(receiptNoteItem.taxCode.formula === 'EXCLUSIVE') {
        tax += (lineTotal * receiptNoteItem.taxCode.percentage) / 100;
      } else if (receiptNoteItem.taxCode.formula === 'INCLUSIVE') {
        tax += (lineTotal * receiptNoteItem.taxCode.percentage) / 100;
      }

      lineTotal += tax;
      receiptNoteTaxTotal += tax;
    }

    receiptNoteTotal += lineTotal;
  });
};

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculateReceiptNoteTotal(changedValues.items);
    }
  },
})
class ReceiptNoteForm extends PureComponent {
  static defaultProps = {
    receiptNote: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    receiptNote: PropTypes.object,
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
    receiptNoteSubTotal = 0;
    receiptNoteTotal = 0;
    receiptNoteDiscountTotal = 0;
    receiptNoteTaxTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('receiptNote' in nextProps) {
      if (nextProps.receiptNote.id) {
        calculateReceiptNoteTotal(nextProps.receiptNote.items);
      }
    }
  }

  contactSelectHandler = (value) => this.props.form.setFieldsValue({ vendor: value });

  departmentSelectHandler = value => this.props.form.setFieldsValue({ costCenter: value });

  locationSelectHandler = value => this.props.form.setFieldsValue({ location: value });

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onApprove,
      onReject,
      form,
      receiptNote,
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

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const departmentSelectProps = {
      multiSelect: false,
    };

    const locationSelectProps = {
      multiSelect: false,
      isStore: true,
    };

    const detailedTotalAmountCardProps = {
      discountAmount: receiptNoteDiscountTotal,
      subtotalAmount: receiptNoteSubTotal,
      taxableAmount: receiptNoteSubTotal - receiptNoteDiscountTotal,
      taxAmount: receiptNoteTaxTotal,
      total: receiptNoteTotal + receiptNote.approvedChargesTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: receiptNoteTotal,
    };

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); } else if (!allowPast && allowFuture) {
        return current && current.valueOf() > Date.now();
      }
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            let invalidItems = [];

            if(values.receiptNoteType === 'SERVICE') {
              invalidItems = values.items.filter(item => item.debitAccount === null);
            }

            if(invalidItems.length > 0) {
              message.error('At least one item requires debit account');
            } else {
              onCreate(values);
            }

          } else {}
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this receipt note?',
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
            title: 'Are you sure you want to submit this receipt note?',
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
            const approvedCharges = values.charges.filter(item => item.approved);

            confirm({
              title: 'Are you sure you want to approve this receipt note?',
              onOk() {
                onApprove(approvedItems, approvedCharges);
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
            title: 'Are you sure you want to reject this receipt note?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    const chargesTableForm = (
      <ChargesItemsTableForm
        enableAddItem={(receiptNote.receiptNoteStatus === 'IN_PROCESS' || receiptNote.purchaseOrder != undefined) ? false : true}
        allowProcessing={receiptNote.receiptNoteStatus === 'IN_PROCESS' ? true : false}
        rowSelectionEnabled={receiptNote.receiptNoteStatus === 'IN_PROCESS' ? true : false} />
    );

    const itemsTableForm = (receiptNote.receiptNoteType === 'GOODS' || getFieldValue('receiptNoteType') === 'GOODS') ? (
      <GoodsReceiptNoteItemsTableForm
        enableAddItem={(receiptNote.receiptNoteStatus === 'IN_PROCESS' || receiptNote.purchaseOrder != undefined) ? false : true}
        allowProcessing={receiptNote.receiptNoteStatus === 'IN_PROCESS' ? true : false}
        rowSelectionEnabled={receiptNote.receiptNoteStatus === 'IN_PROCESS' ? true : false} />
    ) : (
      <ServicesReceiptNoteItemsTableForm
        enableAddItem={(receiptNote.receiptNoteStatus === 'IN_PROCESS' || receiptNote.purchaseOrder != undefined) ? false : true}
        allowProcessing={receiptNote.receiptNoteStatus === 'IN_PROCESS' ? true : false}
        rowSelectionEnabled={receiptNote.receiptNoteStatus === 'IN_PROCESS' ? true : false} />
    );

    getFieldDecorator('purchaseOrder', { initialValue: receiptNote.purchaseOrder ? receiptNote.purchaseOrder : null });
    getFieldDecorator('receiptNoteTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { receiptNote.id ? (
                  <div>
                    { receiptNote.receiptNoteStatus === 'INCOMPLETE' && (
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

                    { receiptNote.receiptNoteStatus === 'IN_PROCESS' && (
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
                initialValue: receiptNote.vendor ? receiptNote.vendor : null,
                rules: [
                  {
                    required: true,
                    message: 'Vendor must be specified',
                  },
                ],
              })(<ContactSelect
                editValue={receiptNote.vendor ? receiptNote.vendor.name : null}
                onContactSelect={this.contactSelectHandler}
                {...contactSelectProps}
              />)}
              </FormItem>
              <FormItem
                label={(
                  <span>
                  Vendor Invoice:&nbsp;
                    <Tooltip title="Purchase Invoice number or Sales Receipt number ">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
                hasFeedback
                {...headerFormItemLayout}
              >
                {getFieldDecorator('purchaseInvoiceReference', {
                  initialValue: receiptNote.purchaseInvoiceReference ? receiptNote.purchaseInvoiceReference : null,
                  rules: [
                    {
                      required: true,
                      message: 'Purchase Invoice reference must be specified',
                    },
                  ],
                })(<Input placeholder="Purchase Invoice or Sale Receipt reference" />)}
              </FormItem>
              <FormItem {...headerFormItemLayout} label="Receipt Date" hasFeedback>
                {getFieldDecorator('receiveDate', {
                  initialValue: receiptNote.receiveDate ? moment(receiptNote.receiveDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'Receipt Date must be specified',
                    },
                  ],
                })(<DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate}
                />)}
              </FormItem>
              <FormItem label="Type of Receipt" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('receiptNoteType', {
                  initialValue: receiptNote.receiptNoteType ? receiptNote.receiptNoteType : 'GOODS',
                  rules: [
                    {
                      required: true,
                      message: 'Type of Receipt note must be specified',
                    },
                  ],
                })(
                  <RadioGroup disabled={getFieldValue('items') ? getFieldValue('items').length > 0 : false}>
                    <Radio value="GOODS">Goods</Radio>
                    <Radio value="SERVICE">Services</Radio>
                  </RadioGroup>
                )}
              </FormItem>
                { getFieldValue('receiptNoteType') === 'GOODS' ? (
                  <FormItem
                    label={(
                      <span>
                      Location&nbsp;
                        <Tooltip title="Location receiving goods">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    )}
                    hasFeedback
                    {...headerFormItemLayout}
                  >
                    {getFieldDecorator('location', {
                    initialValue: receiptNote.location ? receiptNote.location : null,
                    rules: [{
                      required: true,
                      message: 'Receiving location must be specified',
                    }],
                  })(<LocationSelect
                    editValue={receiptNote.location ? receiptNote.location : null}
                    onLocationSelect={this.locationSelectHandler}
                    {...locationSelectProps}
                  />
                  )}
                </FormItem>
              ) : (
                <FormItem
                  label={(
                    <span>
                    Cost Center&nbsp;
                      <Tooltip title="Department receiving service">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                  hasFeedback
                  {...headerFormItemLayout}
                >
                  {getFieldDecorator('costCenter', {
                  initialValue: receiptNote.costCenter ? receiptNote.costCenter : null,
                  rules: [{
                    required: true,
                    message: 'Cost center must be specified',
                  }],
                })(<DepartmentSelect
                  editValue={receiptNote.costCenter ? receiptNote.costCenter : null}
                  onDepartmentSelect={this.departmentSelectHandler}
                  {...departmentSelectProps}
                />
                )}
                </FormItem>
              )}
            </Col>
            <Col span={8}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <fieldset style={{ marginBottom: 20 }}>
            <legend>Items</legend>
            <div>
              {getFieldDecorator('items', {
                initialValue: (receiptNote.id || receiptNote.purchaseOrder) ? receiptNote.items : [],
              })(itemsTableForm)}
            </div>
          </fieldset>

          <fieldset style={{ marginBottom: 20 }}>
            <legend>Charges</legend>
            <div>
              {getFieldDecorator('charges', {
                initialValue: (receiptNote.id || receiptNote.purchaseOrder) ? receiptNote.charges : [],
              })(chargesTableForm)}
            </div>
          </fieldset>

          <Row gutter={24}>
            <Col span={15}>
              { receiptNote.id && (
              <FilesView
                readOnly={false}
                context={receiptNote.id}
                contextType="RECEIPT_NOTE"
              />
            )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                  initialValue: receiptNote.comment,
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

export default ReceiptNoteForm;
