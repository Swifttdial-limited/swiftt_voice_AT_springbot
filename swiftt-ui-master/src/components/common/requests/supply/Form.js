import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Checkbox,
  Tooltip,
  Input,
  InputNumber,
  Card,
  LocaleProvider,
  Icon,
  Button,
  Row,
  Col,
  Alert,
  message,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import numeral from 'numeral';
import { debounce }  from 'lodash';

import LocationSelect from '../../../common/LocationSelect';
import PriceListItemSelect from '../../../common/PriceListItemSelect';

import { applyAction } from '../../../../services/inventory/inventoryMetadata';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};

@Form.create()
@connect()
class MedicalSupplyForm extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    item: PropTypes.object,
    encounter: PropTypes.object.isRequired,
  };

  state = {
    checkedList: [],
    inventoryBalance: 0,
    medicalSupplyTotal: 0,
  };

  constructor(props) {
    super(props);
    this.quantityChangeHandler = debounce(this.quantityChangeHandler, 2000);
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  handleSubmit = () => {
    const { form, onOk } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };

      onOk(data);
    });
  }

  locationSelectHandler = (value) => {
    const { dispatch, form, encounter } = this.props;
    const { setFieldsValue } = form;

    if(value.stockAccount != null) {
      if (value.department) {
        setFieldsValue({ location: value, destinationDepartment: value.department });
        dispatch({
          type: 'catalogue_prices/query',
          payload: {
            activated: true,
            billingDepartment: value.department.publicId,
            priceList: encounter.defaultPaymentWallet.walletType.priceList.id,
            productType: ['SUPPLIES'],
            size: 1000,
          },
        });
      }
    } else {
      message.warning('Stock / Expense account must be specified.');
    }
  }

  selectedPriceListItemHandler = (value) => {
    const { form, dispatch } = this.props;
    const { setFieldsValue } = form;

    if (value) {
      setFieldsValue({ priceListItem: value });

      if(value.pricingStrategy === 'FIXED') {
        setFieldsValue({ price: value.sellingPrice });
      }

    } else { }
  }

  handleViewOptionsChange = (checkedList) => {
    this.setState({
      checkedList,
    }, () => console.log(this.state));
  }

  generateRequestToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ requested: e.target.value });
  }

  quantityChangeHandler = (value) => {
    const { getFieldValue } = this.props.form;
    const location = getFieldValue('location');
    const priceListItem = getFieldValue('priceListItem');
    const product = getFieldValue('priceListItem').product;

    if(product.trackable) {
      applyAction({
        location: location.publicId,
        product: product.id,
        quantity: value,
        actionType: 'GET_BALANCES_AND_COSTS',
      }).then((response) => {
        let balance = 0;
        let total = 0;

        response.content.forEach((data) => {
          balance += data.balance;
        });

        if(priceListItem.pricingStrategy === 'MARKUP') {
          // while
          let i = value;
          let currentIndex = 0;
          let balances = response.content;
          while (i > 0) {
            let activeBalance = balances[currentIndex]
            let activeQuantity = 0;

            if(i <= activeBalance.balance) {
              activeQuantity = i;
              i = 0;
            } else {
              activeQuantity = activeBalance.balance;
              i = i - activeBalance.balance;
            }

            total = total + (activeBalance.cost + (activeBalance.cost * priceListItem.markupValue) / 100) * activeQuantity;

            currentIndex++;
          }
        } else {
          total = priceListItem.sellingPrice * value;
        }

        this.setState({
          inventoryBalance: balance,
          medicalSupplyTotal: total,
        });

      }).catch((error) => {
        this.setState({
          inventoryBalance: 0,
          medicalSupplyTotal: 0,
        });
      });
    } else {
      let total = 0;
      if(priceListItem.pricingStrategy === 'MARKUP') {

      } else {
        total = priceListItem.sellingPrice * value;
      }

      this.setState({
        medicalSupplyTotal: total,
      });
    }
  }

  render() {
    const {
      form,
      item,
      encounter,
      medicalSupplyType,
      onCancel,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      validateFields,
      getFieldsValue,
      setFieldsValue,
    } = form;

    const { inventoryBalance, medicalSupplyTotal } = this.state;

    const priceListItem = getFieldValue('priceListItem');

    const locationSelectProps = {
      isStore: true,
      multiSelect: false,
    };

    getFieldDecorator('destinationDepartment', {
      rules: [{ required: true, message: 'Destination department must be specified' }],
    });

    return (
      <Card>
        <LocaleProvider locale={enUS}>
          {encounter.defaultPaymentWallet.walletType.priceList
            ? (
              <Form layout="horizontal">
                <FormItem
                  {...formItemLayout}
                  label="Location"
                  hasFeedback>
                  {getFieldDecorator('location', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      message: 'Dispensing location must be specified.',
                    }],
                  })(<LocationSelect
                    onLocationSelect={this.locationSelectHandler}
                  />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Item" hasFeedback>
                  {getFieldDecorator('priceListItem', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      message: 'Product must be specified.',
                    }],
                  })(<PriceListItemSelect
                    onPriceListItemSelect={this.selectedPriceListItemHandler} />)}
                </FormItem>

                <fieldset>
                  <legend>Details</legend>
                  <FormItem
                    label="Quantity"
                    {...formItemLayout}
                  >
                    <Col span={6}>
                      <FormItem {...formItemLayout} hasFeedback>
                        {getFieldDecorator('quantity', {
                          initialValue: 0,
                          validateTrigger: ['onChange', 'onBlur'],
                          rules: [{
                            required: true,
                            message: 'Quantity must be specified',
                          }],
                        })(<InputNumber onChange={this.quantityChangeHandler} width="100%" min={1} />)}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        -
                      </span>
                    </Col>
                    {/*
                      <Col span={8}>
                        <span style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}>
                          Inventory available : {numeral(inventoryBalance).format('0,0')}
                        </span>
                      </Col>
                    */}
                    <Col span={8}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}>
                        Total : {numeral(medicalSupplyTotal).format('0,0.00')}
                      </span>
                    </Col>
                  </FormItem>

                  <FormItem {...formItemLayout} label="Instruction">
                    {getFieldDecorator('instruction', {
                      validateTrigger: ['onChange', 'onBlur'],
                    })(<TextArea rows={2} />)}
                  </FormItem>

                </fieldset>

                <div style={{ marginTop: 10 }}>
                  <FormItem {...noLabelTailFormItemLayout}>
                    <Button
                      type="danger"
                      icon="close"
                      onClick={this.handleCancel}
                      style={{ marginRight: 10 }}
                    >Cancel
                      </Button>
                    {item.publicId
                      ? null
                      : (<Button
                        type="primary"
                        icon="save"
                        onClick={this.handleSubmit}
                      >Save Medical Supply
                        </Button>)
                    }
                  </FormItem>
                </div>

              </Form>
            ) : (
              <Alert
                message="Error"
                description="Sorry. Payment wallet for this visit has not been tagged to a price list."
                type="error"
                showIcon
              />
            )}
        </LocaleProvider>
      </Card>
    );
  }
}

export default MedicalSupplyForm;
