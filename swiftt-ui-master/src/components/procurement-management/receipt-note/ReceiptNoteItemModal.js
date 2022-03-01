import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  LocaleProvider,
  Row,
  Col,
  DatePicker,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../common/AccountSelect';
import ProductSelect from '../../common/ProductSelect';
import TaxCodeSelect from '../../common/accounting/TaxCodeSelect';

const FormItem = Form.Item;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class ReceiptNoteItemModal extends PureComponent {
  static defaultProps = {
    showExpectedQuantity: true,
    receiptNoteType: 'GOODS',
  };

  static propTypes = {
    showExpectedQuantity: PropTypes.bool,
    type: PropTypes.string,
    receiptNoteType: PropTypes.string,
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  render() {
    const {
      showExpectedQuantity,
      visible,
      type,
      item = {},
      receiptNoteType,
      onOk,
      onCancel,
      form
    } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue,
    } = form;

    function disabledDate(current) {
      if (allowPast) {
        return (current && current.valueOf()) > Date.now();
      } else if (!allowPast && allowFuture) {
        return (current && current.valueOf()) + 10000 <= Date.now();
      }
    };

    function handleOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = {
          key: item.key,
          ...getFieldsValue(),
        };
        onOk(data);
      });
    }

    let discountAmount = 0;
    let taxAmount = 0
    let totalUnits = 0;
    let unitCost = 0;

    const modalOpts = {
      title: `${type === 'create' ? 'New Receipt Note Line' : 'Edit Receipt Note Line'}`,
      visible,
      width: 640,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
      okText: 'Save',
      cancelText: 'Close',
    };

    const accountSelectProps = {
      multiSelect: false,
      onAccountSelect(value) {
        setFieldsValue({ debitAccount: value });
      }
    };

    const productSelectProps = {
      activated: true,
      autoLoad: false,
      multiSelect: false,
      productTypes: receiptNoteType === 'GOODS' ? ['MEDICATION', 'SUPPLIES'] : ['SERVICE'],
      onProductSelect(value) {
        setFieldsValue({ product: value });

        if(value != undefined && value.packSize) {
          setFieldsValue({ packSize: value.packSize });
        } else {
          setFieldsValue({ packSize: null });
        }
      },
    };

    const taxCodeSelectProps = {
      multiSelect: false,
      onTaxCodeSelect(value) {
        setFieldsValue({ taxCode: value });
      },
    };

    const renderDiscountValue = () => {
      const cost = getFieldValue('cost');
      const discount = getFieldValue('discount');
      const expectedQuantity = getFieldValue('expectedQuantity');

      if (cost && discount && expectedQuantity) {
        discountAmount = (expectedQuantity * cost * discount) / 100;
        return <span>{numeral(discountAmount).format('0,0.00')}</span>
      }
      return <span>{numeral(0).format('0,0.00')}</span>
    }

    const renderPackSize = () => {
      const packSizeField = getFieldValue('packSize');

      if (packSizeField) {
        let packSize = packSizeField.packSize ? packSizeField.packSize : 1;

        if (packSizeField.unitOfMeasure) {
          packSize = `${packSize} (${packSizeField.unitOfMeasure.abbreviation})`;
        }

        return <span>{packSize}</span>;
      }
      return <span>1</span>;
    };

    const renderTaxValue = () => {
      const cost = getFieldValue('cost');
      const expectedQuantity = getFieldValue('expectedQuantity');
      const taxField = getFieldValue('taxCode');

      if (cost && taxField) {
        const lineTotal = totalUnits * cost;
        if(taxField.formula === 'EXCLUSIVE') {
          taxAmount = (((expectedQuantity * cost) - discountAmount) * taxField.percentage) / 100;
        } else if (taxField.formula === 'INCLUSIVE') {
          taxAmount = ((expectedQuantity * cost) * taxField.percentage) / 100;
        }
        return <span>{numeral(taxAmount).format('0,0.00')}</span>
      }
      return <span>{numeral(0).format('0,0.00')}</span>
    }

    const renderTotalUnits = () => {
      const packSizeField = getFieldValue('packSize');
      const expectedQuantityField = getFieldValue('expectedQuantity');

      if (packSizeField && expectedQuantityField) {
        totalUnits = packSizeField.packSize * expectedQuantityField;
        return <span>{totalUnits}</span>;
      } else {
        return <span>0</span>;
      }
    };

    const renderUnitCost = () => {
      const cost = getFieldValue('cost');
      const expectedQuantity = getFieldValue('expectedQuantity');

      if(cost && expectedQuantity) {
        unitCost = (expectedQuantity * cost) / totalUnits;

        return <span>{numeral(unitCost).format('0,0.00')}</span>
      } else {
        return <span>{numeral(0).format('0,0.00')}</span>
      }
    }

    getFieldDecorator('packSize', {initialValue: item.packSize ? item.packSize : null});

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            { receiptNoteType === 'GOODS' ? (
              <FormItem
                label="Item"
                hasFeedback {...formItemLayout}>
                {getFieldDecorator('product', {
                   initialValue: item.product,
                   rules: [
                     {
                       required: true,
                       message: 'Receipt note item must be specified',
                    },
                   ],
                })(<ProductSelect
                  editValue={item.product ? item.product.productName : null}
                  {...productSelectProps}
                />)}
              </FormItem>
            ) : (
              <FormItem
                label="Service"
                hasFeedback {...formItemLayout}>
                {getFieldDecorator('description', {
                   initialValue: item.description,
                   rules: [
                     {
                       required: true,
                       message: 'Service must be specified',
                    },
                   ],
                })(<Input />)}
              </FormItem>
            )}

            {receiptNoteType === 'SERVICE' && (
              <FormItem
                label="Debit Account"
                hasFeedback {...formItemLayout}>
                {getFieldDecorator('debitAccount', {
                   initialValue: item.debitAccount,
                   rules: [
                     {
                       required: true,
                       message: 'Debit account must be specified',
                    },
                   ],
                })(<AccountSelect
                  editValue={item.debitAccount ? item.debitAccount.name : null}
                  {...accountSelectProps}
                />)}
              </FormItem>
            )}

            {showExpectedQuantity ? (
              <FormItem label="Quantity" hasFeedback {...formItemLayout}>
                <Row gutter={8}>
                  <Col span={8}>
                    {getFieldDecorator('expectedQuantity', {
                      initialValue: item.expectedQuantity ? item.expectedQuantity : 0,
                      rules: [
                        {
                          required: true,
                          message: 'Expected quantity must be specified',
                       },
                      ],
                    })(<InputNumber
                      style={{ width: '100%' }}
                      min={1}
                    />)}
                  </Col>
                  { receiptNoteType === 'GOODS' && (
                    <Fragment>
                      <Col span={8}>
                        <span>Pack Size: {renderPackSize()}</span>
                      </Col>
                      <Col span={8}>
                        <span>Total Units: {renderTotalUnits()}</span>
                      </Col>
                    </Fragment>
                  )}
                </Row>
              </FormItem>
            ) : (
              <FormItem label="Quantity" hasFeedback {...formItemLayout}>
                <Row gutter={8}>
                  <Col span={8}>
                    {getFieldDecorator('receivedQuantity', {
                      initialValue: item.receivedQuantity ? item.receivedQuantity : 0,
                      rules: [
                        {
                          required: true,
                          message: 'Received quantity must be specified',
                       },
                      ],
                    })(<InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      max={item.expectedQuantity}
                    />)}
                  </Col>
                  { receiptNoteType === 'GOODS' && (
                    <Fragment>
                      <Col span={8}>
                        <span>Pack Size: {renderPackSize()}</span>
                      </Col>
                      <Col span={8}>
                        <span>Total Units: {renderTotalUnits()}</span>
                      </Col>
                    </Fragment>
                  )}
                </Row>
              </FormItem>
            )}


            <FormItem
              label={(receiptNoteType === "GOODS" ? "Cost per Pack" : "Cost")}
              hasFeedback {...formItemLayout}>
              <Row gutter={8}>
                <Col span={8}>
                  {getFieldDecorator('cost', {
                    initialValue: item.cost,
                    rules: [
                      {
                        required: true,
                        message: 'Cost must be specified',
                     },
                    ],
                  })(<InputNumber min={1} style={{ width: '100%' }} />)}
                </Col>
                { receiptNoteType === 'GOODS' && (
                  <Col span={12}>
                    <span>Unit Cost: {renderUnitCost()}</span>
                  </Col>
                )}
              </Row>
            </FormItem>

            <FormItem label="Discount (%)" hasFeedback {...formItemLayout}>
              <Row gutter={8}>
                <Col span={8}>
                  {getFieldDecorator('discount', {
                    initialValue: item.discount ? item.discount : 0,
                  })(<InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    min={0}
                    max={100}
                  />)}
                </Col>
                <Col span={12}>
                  <span>Discount (value): {renderDiscountValue()}</span>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="Tax Code" hasFeedback {...formItemLayout}>
              <Row gutter={8}>
                <Col span={8}>
                  {getFieldDecorator('taxCode', {
                    initialValue: item.taxCode,
                  })(<TaxCodeSelect
                    {...taxCodeSelectProps}
                    editValue={item.taxCode ? item.taxCode.name : null}
                  />)}
                </Col>
                <Col span={12}>
                  <span>Tax (value): {renderTaxValue()}</span>
                </Col>
              </Row>
            </FormItem>

            { receiptNoteType === 'GOODS' && (
              <Fragment>
                <FormItem label="Batch Number" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('serialNumber', {
                    initialValue: item.serialNumber,
                  })(<Input />)}
                </FormItem>

                <FormItem label="Expiry Date" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('bestBeforeDate', {
                    initialValue: item.bestBeforeDate ? moment(item.bestBeforeDate, dateFormat) : null,
                  })(<DatePicker
                    format={dateFormat}
                    disabledDate={disabledDate}
                  />)}
                </FormItem>
              </Fragment>
            )}
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default ReceiptNoteItemModal;
