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
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import InventoryAdjustmentReasonSelect from '../../common/InventoryAdjustmentReasonSelect';
import InventorySelect from '../../common/inventory/InventorySelect';

import { queryOne as queryProduct } from '../../../services/catalogue/products';
import { queryDetailed as queryInventory } from '../../../services/inventory/inventoryBalances';

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
class InventoryAdjustmentItemModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    type: PropTypes.string,
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  adjustmentQuantityHandler = (value) => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    setFieldsValue({
      newQuantity: getFieldValue('oldQuantity') + value,
    });
  }

  inventorySelectHandler = (value) => {
    const { form, location } = this.props;
    const { setFieldsValue } = form;

    if (value) {
      setFieldsValue({
        oldQuantity: value.balance,
        newQuantity: value.balance,
      });
      this.fetchProduct(value.productId);
      this.fetchProductCost(location.publicId, value.productId);
    } else {}
  }

  fetchProduct = (product) => {
    const { setFieldsValue } = this.props.form;

    queryProduct({
      id: product,
    }).then((response) => {
      setFieldsValue({
        product: response,
      });
    }).catch((e) => {
      return null;
    });
  }

  fetchProductCost = (location, product) => {
    const { setFieldsValue } = this.props.form;

    if(location && product) {
      queryInventory({
        location,
        product,
        activeOnly: true,
      }).then((response) => {
        setFieldsValue({
          inventoryMetadata: response.content.length > 0 ? {
            publicId: response.content[0].stockMetadataPublicId,
            cost: response.content[0].cost,
            stockTrackingNumber: response.content[0].stockTrackingNumber,
          } : {},
        });
      }).catch((e) => {
        console.log(e);
      });
    }
  }

  render() {
    const {
      location,
      visible,
      type,
      item = {},
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

    const modalOpts = {
      title: `${type === 'create' ? 'New Inventory Adjustment Line' : 'Edit Inventory Adjustment Line'}`,
      visible,
      width: 680,
      onOk: handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
      okText: 'Save',
      cancelText: 'Close',
    };

    const inventoryAdjustmentReasonSelectProps = {
      multiSelect: true,
      onInventoryAdjustmentReasonSelect(value) {
        setFieldsValue({ adjustmentReasons: value });
      }
    };

    const inventorySelectProps = {
      multiSelect: false,
      location: location ? location.publicId : null,
    };

    getFieldDecorator('inventoryMetadata', { initialValue: null });
    getFieldDecorator('newQuantity', { initialValue: 0 });
    getFieldDecorator('oldQuantity', { initialValue: 0 });

    return(
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Item" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product', {
                 initialValue: item.product,
                 rules: [
                   {
                     required: true,
                     message: 'Inventory adjustment item must be specified',
                  },
                 ],
              })(<InventorySelect
                editValue={item.product ? item.product.productName : null}
                {...inventorySelectProps}
                onInventorySelect={this.inventorySelectHandler}
              />)}
            </FormItem>

            <FormItem label="Quantity on-hand" hasFeedback {...formItemLayout}>
              <Row gutter={8}>
                <Col span={8}>
                  {getFieldDecorator('oldQuantity', {
                    initialValue: item.oldQuantity ? item.oldQuantity : 0,
                    rules: [
                      {
                        required: true,
                        message: 'Adjustment quantity must be specified',
                     },
                    ],
                  })(
                    <InputNumber
                      disabled
                      style={{ width: '100%' }}
                    />
                  )}
                </Col>
                <Col>
                  ~ Unit Cost: {numeral(getFieldValue('inventoryMetadata') ? getFieldValue('inventoryMetadata').cost : 0).format('0,0.00')}
                </Col>
              </Row>
            </FormItem>

            <FormItem label="Adjustment Quantity" hasFeedback {...formItemLayout}>
              {getFieldDecorator('adjustmentQuantity', {
                initialValue: item.adjustmentQuantity ? item.adjustmentQuantity : 0,
                rules: [
                  {
                    required: true,
                    message: 'Adjustment quantity must be specified',
                 },
                ],
              })(
                <InputNumber
                  disabled={getFieldValue('product') ? false : true}
                  style={{ width: '30%' }}
                  min={(0 - getFieldValue('oldQuantity'))}
                  onChange={this.adjustmentQuantityHandler}
                />
              )}
            </FormItem>

            <FormItem label="Quantity after Adjustment" hasFeedback {...formItemLayout}>
              {getFieldDecorator('newQuantity', {
                initialValue: item.newQuantity ? item.newQuantity : 0,
                rules: [
                  {
                    required: true,
                    message: 'Adjustment quantity must be specified',
                 },
                ],
              })(
                <InputNumber
                  disabled
                  style={{ width: '30%' }}
                  min={0}
                />
              )}
            </FormItem>

            <FormItem label="Adjustment Reason" hasFeedback {...formItemLayout}>
              {getFieldDecorator('adjustmentReasons', {
                initialValue: item.adjustmentReasons ? item.adjustmentReasons : null,
                rules: [{
                  required: true,
                  message: 'At least one adjustment reason must be specified',
                }],
              })(<InventoryAdjustmentReasonSelect
                editValue={item.adjustmentReasons ? item.adjustmentReasons : null}
                {...inventoryAdjustmentReasonSelectProps}
              />
              )}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default InventoryAdjustmentItemModal;
