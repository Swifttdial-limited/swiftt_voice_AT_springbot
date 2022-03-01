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
} from 'antd';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import ProductSelect from '../../common/ProductSelect';
import TaxCodeSelect from '../../common/accounting/TaxCodeSelect';

const FormItem = Form.Item;

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
class PurchaseOrderItemModal extends PureComponent {
  static defaultProps = {
    orderType: 'GOODS',
  };

  static propTypes = {
    type: PropTypes.string,
    orderType: PropTypes.string,
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  render() {
    const {
      visible,
      type,
      item = {},
      orderType, // GOODS or Services
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
      title: `${type === 'create' ? 'New Purchase Order Line' : 'Edit Purchase Order Line'}`,
      visible,
      width: 640,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
      okText: 'Save',
      cancelText: 'Close',
    };

    const productSelectProps = {
      activated: true,
      autoLoad: false,
      multiSelect: false,
      productTypes: orderType === 'GOODS' ? ['MEDICATION', 'SUPPLIES'] : ['SERVICE'],
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
      const quantity = getFieldValue('quantity');

      if (cost && discount && quantity) {
        discountAmount = (quantity * cost * discount) / 100;
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
      const quantity = getFieldValue('quantity');
      const taxField = getFieldValue('taxCode');

      if (cost && taxField) {
        const lineTotal = totalUnits * cost;
        if(taxField.formula === 'EXCLUSIVE') {
          taxAmount = (((quantity * cost) - discountAmount) * taxField.percentage) / 100;
        } else if (taxField.formula === 'INCLUSIVE') {
          taxAmount = ((quantity * cost) * taxField.percentage) / 100;
        }
        return <span>{numeral(taxAmount).format('0,0.00')}</span>
      }
      return <span>{numeral(0).format('0,0.00')}</span>
    }

    const renderTotalUnits = () => {
      const packSizeField = getFieldValue('packSize');
      const quantityField = getFieldValue('quantity');

      if (packSizeField && quantityField) {
        totalUnits = packSizeField.packSize * quantityField;
        return <span>{totalUnits}</span>;
      } else {
        return <span>0</span>;
      }
    };

    const renderUnitCost = () => {
      const cost = getFieldValue('cost');
      const quantity = getFieldValue('quantity');

      if(cost && quantity) {
        unitCost = (quantity * cost) / totalUnits;

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
            { orderType === 'GOODS' ? (
              <FormItem
                label="Item"
                hasFeedback {...formItemLayout}>
                {getFieldDecorator('product', {
                   initialValue: item.product,
                   rules: [
                     {
                       required: true,
                       message: 'Purchase order item must be specified',
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

            <FormItem label="Quantity" hasFeedback {...formItemLayout}>
              <Row gutter={8}>
                <Col span={8}>
                  {getFieldDecorator('quantity', {
                    initialValue: item.quantity ? item.quantity : 1,
                    rules: [
                      {
                        required: true,
                        message: 'Quantity must be specified',
                     },
                    ],
                  })(<InputNumber style={{ width: '100%' }} min={1}/>)}
                </Col>
                { orderType === 'GOODS' && (
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

            <FormItem
              label={orderType === "GOODS" ? "Cost per Pack" : "Cost"}
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
                { orderType === 'GOODS' && (
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
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default PurchaseOrderItemModal;
