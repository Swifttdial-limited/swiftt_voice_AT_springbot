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
  List,
  Collapse,
  Modal,
  message,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import ContactSelect from '../../common/ContactSelect';
import CreditNoteItemsTableForm from './CreditNoteItemsTableForm';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import LocationSelect from '../../common/LocationSelect';
import PurchaseInvoiceSelect from '../../common/procurement/PurchaseInvoiceSelect';
import TotalAmountCard from '../../common/TotalAmountCard';

import { query, queryOne } from '../../../services/procurement/receiptNotes';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;

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

let creditNoteTotal = 0;

const calculateCreditNoteTotal = (items) => {
  creditNoteTotal = 0;

  items.forEach((creditNoteItem) => {
    //if((!creditNoteItem.id && creditNoteItem.eligible) || item.approved) {
      creditNoteTotal += (creditNoteItem.creditQuantity * creditNoteItem.cost);
    //}
  });
};

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculateCreditNoteTotal(changedValues.items);
    }
  },
})
class CreditNoteForm extends PureComponent {
  static defaultProps = {
    creditNote: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    creditNote: PropTypes.object,
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
    creditNoteTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('creditNote' in nextProps) {
      if (nextProps.creditNote.id) {
        calculateCreditNoteTotal(nextProps.creditNote.items);
      }
    }
  }

  contactSelectHandler = (value) => {
    this.props.form.setFieldsValue({ vendor: value });
  }

  receiptNoteSelectHandler = (selectedReceiptNote) => {
    const { form } = this.props;

    if(selectedReceiptNote) {
      const { getFieldValue, setFieldsValue } = form;
      setFieldsValue({ receiptNote: selectedReceiptNote });

      queryOne({
        id: selectedReceiptNote.id,
      }).then((response) => {
        const creditNoteItems = response.items
          .filter(receiptNoteItem => receiptNoteItem.approved)
          .map(receiptNoteItem =>
            this.mapReceiptNoteItemToCreditNoteItem(
              getFieldValue('vendor').creditorsAccount,
              receiptNoteItem));

        setFieldsValue({ items: creditNoteItems });
      }).catch((e) => {
        setFieldsValue({ items: [] });
      });
    } else {
      setFieldsValue({ receiptNote: null, items: [] });
    }
  }

  mapReceiptNoteItemToCreditNoteItem = (debitAccount, receiptNoteItem) => {
    return {
      lineItemReferenceId: receiptNoteItem.id,
      product: receiptNoteItem.product,
      description: receiptNoteItem.description,
      packSize: receiptNoteItem.packSize,
      receivedQuantity: receiptNoteItem.receivedQuantity,
      cost: receiptNoteItem.cost,
      creditQuantity: receiptNoteItem.receivedQuantity,
      creditAmount: receiptNoteItem.receivedLineTotal,
      eligible: false,
      approved: false,
      debitAccount: debitAccount,
      creditAccount: receiptNoteItem.debitAccount,
    };
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
      creditNote,
      loading,
      success,
    } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldValue, validateFields, getFieldsValue, setFieldsValue } = form;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const detailedTotalAmountCardProps = {
      total: creditNoteTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: creditNoteTotal,
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          const payload = values;
          payload.items = values.items.filter(item => item.eligible);

          if(payload.items.length > 0) {
            onCreate({ ...payload });
          } else {
            message.warning('At least one item must be selected.');
          }
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          const payload = values;
          payload.items = values.items.filter(item => item.eligible);

          if(payload.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this credit note?',
              onOk() {
                onCreateAndSubmit({ ...values });
              },
            });
          } else {
            message.warning('At least one item must be selected.');
          }
        }
      });
    }


    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onSave({ ...values }); } else { }
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to submit this credit note?',
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
        console.log(values);
        if (!err) {
          confirm({
            title: 'Are you sure you want to approve this credit note?',
            onOk() {
              onApprove(values.item);
            },
          });
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this credit note?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('receiptNote');

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
              {creditNote.id ? (
                  <div>
                    {creditNote.creditNoteStatus === 'INCOMPLETE' && (
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

                    {creditNote.creditNoteStatus === 'IN_PROCESS' && (
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
                  initialValue: creditNote.vendor ? creditNote.vendor.name : null,
                })(<Input disabled/>)}
              </FormItem>
              <FormItem label="Purchase Invoice Ref:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('receiptNote', {
                  initialValue: creditNote.receiptNote ? creditNote.receiptNote.purchaseInvoiceReference : null,
                })(<Input disabled/>)}
              </FormItem>
              <FormItem label="Credit Note No:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('creditNoteReference', {
                  initialValue: creditNote.creditNoteReference ? creditNote.creditNoteReference : null,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Items" key="1">
              <div>
                {getFieldDecorator('items',
                {
                  initialValue: creditNote.id ? creditNote.items : [],
                })(<CreditNoteItemsTableForm
                  rowSelectionEnabled={creditNote.creditNoteStatus === 'IN_PROCESS' || !creditNote.id}
                />)}
              </div>
            </Panel>
          </Collapse>

          <Row gutter={24}>
            <Col span={9} offset={15}>
              <DetailedTotalAmountCard {...detailedTotalAmountCardProps} />
            </Col>
          </Row>
        </Form>
      </LocaleProvider>
    );
  }
}

export default CreditNoteForm;
