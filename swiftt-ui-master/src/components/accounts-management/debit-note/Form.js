import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Row, Col, LocaleProvider, Card, Form, Input, Button, List, Collapse, Modal } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import numeral from 'numeral';
import ContactSelect from '../../common/ContactSelect';
import CreditNoteItemsTableForm from './CreditNoteItemsTableForm';
import TotalAmountCard from '../../common/TotalAmountCard';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import { queryCustomerInvoices, queryCustomerInvoiceLines } from '../../../services/accounting/journals';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Panel = Collapse.Panel;


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

let creditNoteSubTotal = 0;
let creditNoteTotal = 0;
let creditNoteDiscountTotal = 0;
let creditNoteTaxTotal = 0;

const calculatePurchaseOrderTotal = (items) => {
  creditNoteSubTotal = 0;
  creditNoteTotal = 0;
  creditNoteDiscountTotal = 0;
  creditNoteTaxTotal = 0;

  items.forEach((creditNoteItem) => {
    const lineTotal = (creditNoteItem.creditNoteAmount);

    creditNoteSubTotal += lineTotal;
    creditNoteTotal += lineTotal;
  });
};

@Form.create({
  onFieldsChange(_) {
    // console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculatePurchaseOrderTotal(changedValues.items);
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
    creditNoteSubTotal = 0;
    creditNoteTotal = 0;
    creditNoteDiscountTotal = 0;
    creditNoteTaxTotal = 0;
    this.state = {
      loadingGoodsReceiptNotes: false,
      goodsReceiptNotes: [],
      transactionLine: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('creditNote' in nextProps) {
      if (nextProps.creditNote.id) {
        calculatePurchaseOrderTotal(nextProps.creditNote.items);
      }
    }
  }

  contactSelectHandler = (value) => {
    this.props.form.setFieldsValue({ customer: value });

    queryCustomerInvoices({
      addressTo: value.publicId,
    }).then((response) => {
      this.setState({
        loadingCustomerInvoices: false,
        customerInvoices: response.content,
        transactionLine: [],
      });
    }).catch(() => {
        this.setState({
          loadingCustomerInvoices: false,
          customerInvoices: [],
          transactionLine: [],
        });
      });
  }

  locationSelectHandler = value => this.props.form.setFieldsValue({ location: value });

  customerInvoiceSelectHandler = (selectedInvoice) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ invoice: selectedInvoice });

    this.setState((currentState) => {
      return {
        selectedInvoice,
        customerInvoices: currentState.customerInvoices.filter(customerInvoice => customerInvoice.id !== selectedInvoice.id),
      };
    }, () => {
      queryCustomerInvoiceLines({
        id: selectedInvoice.id,
      }).then((response) => {
        this.setState({
          transactionLine: response.content,
        });
      }).catch(() => {
          this.setState({
            loadingGoodsReceiptNotes: false,
            goodsReceiptNotes: [],
          });
        });
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
      creditNote,
      loading,
    } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { loadingGoodsReceiptNotes, customerInvoices, transactionLine } = this.state;
    const contactSelectProps = {
      multiSelect: false,
      contactType: 'CUSTOMER',
    };


    const detailedTotalAmountCardProps = {
      discountAmount: creditNoteDiscountTotal,
      subtotalAmount: creditNoteSubTotal,
      taxableAmount: creditNoteSubTotal - creditNoteDiscountTotal,
      taxAmount: creditNoteTaxTotal,
      total: creditNoteTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: creditNoteTotal,
    };



    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          console.log('handleCreate', values);
          if (values.items.length > 0) { onCreate({ ...values }); }
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this debit note?',
              onOk() {
                onCreateAndSubmit({ ...values });
              },
            });
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
              title: 'Are you sure you want to submit this debit note?',
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
            title: 'Are you sure you want to approve this debit note?',
            onOk() {
              onApprove(values.items);
            },
          });
        }
      });
    }

    function handleReject() {
      validateFields((err) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this debit note?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }
    getFieldDecorator('invoice');



    return (
      <LocaleProvider locale={enUS}>
        <Row gutter={24}>
          <Col span={16}>
            <Form>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem label="Customer:" hasFeedback {...headerFormItemLayout}>
                    {getFieldDecorator('customer', {
                      initialValue: creditNote.customer ? creditNote.customer : null,
                      rules: [
                        {
                          required: true,
                          message: 'Customer must be specified',
                        },
                      ],
                    })(<ContactSelect
                      editValue={creditNote.customer ? creditNote.customer.name : null}
                      onContactSelect={this.contactSelectHandler}
                      {...contactSelectProps}
                    />)}
                  </FormItem>
                  <FormItem label="Debit Note No:" hasFeedback {...headerFormItemLayout}>
                    {getFieldDecorator('creditNoteReference', {
                      initialValue: creditNote.creditNoteReference ? creditNote.creditNoteReference : null,
                      rules: [
                        {
                          required: true,
                          message: 'Debit Note number must be specified',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <TotalAmountCard {...totalAmountCardProps} />
                </Col>
              </Row>

              <hr />

              <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
                <Panel header="Items" key="1">
                  <div>
                    {getFieldDecorator('items', {
                      initialValue: creditNote.id ? creditNote.items : transactionLine,
                    })(<CreditNoteItemsTableForm
                      rowSelectionEnabled={creditNote.creditNoteStatus === 'IN_PROCESS'}
                    />)}
                  </div>
                </Panel>
              </Collapse>

              <Row gutter={24}>
                <DetailedTotalAmountCard {...detailedTotalAmountCardProps} />
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                  <FormItem {...tailFormItemLayout}>
                    {creditNote.id ? (
                    <div>

                        {creditNote.creditNoteStatus === 'INCOMPLETE' && (
                          <div>
                            <Button style={{ marginRight: 10 }} loading={loading} type="primary" icon="save" onClick={handleSave}>Save</Button>
                            <Button loading={loading} type="primary" icon="step-forward" onClick={handleSubmit}>Submit</Button>
                          </div>
                        )}

                        {creditNote.creditNoteStatus === 'IN_PROCESS' && (
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
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
              <p>Select customer invoice</p>
              <List
                rowKey="id"
                style={{ marginTop: 24 }}
                grid={{ gutter: 24, column: 1, size: 'small' }}
                loading={loadingGoodsReceiptNotes}
                dataSource={customerInvoices}
                renderItem={item => (
                  <List.Item>
                    <Card>
                      <p>Invoice No: {item.transactionNumber}</p>
                      <p>Patient: {item.secondaryAddressTo.name}({item.secondaryAddressTo.code})</p>
                      <p>Total: {numeral(item.totalAmount).format('0,0.00')}</p>
                      <Button onClick={() => this.customerInvoiceSelectHandler(item)}>Add</Button>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </LocaleProvider>
    );
  }
}

export default CreditNoteForm;
