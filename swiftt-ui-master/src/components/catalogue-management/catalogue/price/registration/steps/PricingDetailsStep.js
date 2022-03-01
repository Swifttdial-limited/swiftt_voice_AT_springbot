import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, InputNumber, Radio, LocaleProvider, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PriceListSelect from '../../../../../common/PriceListSelect';
import ProductSelect from '../../../../../common/ProductSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const inlineFormItemLayout = {
  labelCol: {
    span: 15,
  },
  wrapperCol: {
    span: 9,
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
class PricingForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
  };

  state = {
    minSellingPrice: 0,
    minMaxSellingPrice: 0,
    priceDetailFormItemsDisabled: true,
    sellingPriceInputDisabled: true,
    showMarkupPricingItem: false,
    showPricingStrategyItem: true,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'catalogue_prices/create', payload: values });
      }
    });
  }

  minimumSellingPriceChangeHandler = value => this.setState({ minMaxSellingPrice: value });

  priceListSelectHandler = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ priceList: value });
  }

  pricingStrategyChangeHandler = (e) => {
    if (e.target.value === 'FIXED') { this.setState({ sellingPriceInputDisabled: false, showMarkupPricingItem: false }); }
    if (e.target.value === 'MARKUP') {
      this.setState({ sellingPriceInputDisabled: true, showMarkupPricingItem: true });
      // get base price of product
    }
  }

  productSelectHandler = (value) => {
    this.props.form.setFieldsValue({ product: value });
    this.setState({ priceDetailFormItemsDisabled: false });

    if(value.productType === 'SERVICE') {
      this.setState({ showPricingStrategyItem: false });
    } else {
      this.setState({ showPricingStrategyItem: true });
    }
  }

  resetState = () => this.setState({});

  sellingPriceChangeHandler = value => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    if(value > 0) {
      setFieldsValue({ minimumSellingPrice: value });
      setFieldsValue({ maximumSellingPrice: value });
    }
  }

  sellingPriceMarkupChangeHandler = (value) => {
    const newSellingPrice = (this.props.form.getFieldValue('buyingPrice') * value / 100) + this.props.form.getFieldValue('buyingPrice');
    this.props.form.setFieldsValue({ sellingPrice: newSellingPrice });

    this.sellingPriceChangeHandler(newSellingPrice);
    this.minimumSellingPriceChangeHandler(newSellingPrice);
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const {
      minSellingPrice,
      minMaxSellingPrice,
      sellingPrice,
      sellingPriceInputDisabled,
      priceDetailFormItemsDisabled,
      showMarkupPricingItem,
      showPricingStrategyItem,
    } = this.state;

    const priceListSelectProps = {
      multiSelect: false,
    };

    const productSelectProps = {
      activated: true,
      multiSelect: false,
    };

    return (
      <div id="advanced-form">
        <Row gutter={10}>
          <LocaleProvider locale={enUS}>
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
              <FormItem label="Product:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('product', {
                  rules: [
                    {
                      required: true,
                      message: 'Product must be specified',
                   },
                  ],
               })(<ProductSelect {...productSelectProps} onProductSelect={this.productSelectHandler} />)}
              </FormItem>

              <FormItem label="Price List:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('priceList', {
                    rules: [
                      {
                        required: true,
                        message: 'Price list must be specified',
                     },
                    ],
                 })(<PriceListSelect
                   disabled={priceDetailFormItemsDisabled}
                   {...priceListSelectProps}
                   onPriceListSelect={this.priceListSelectHandler}
                 />)}
              </FormItem>

              {showPricingStrategyItem && (
                <FormItem label="Pricing Strategy:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('pricingStrategy', {
                      rules: [
                        {
                          required: true,
                          message: 'Markup type must be specified',
                       },
                      ],
                   })(
                     <RadioGroup
                       disabled={priceDetailFormItemsDisabled}
                       onChange={this.pricingStrategyChangeHandler}
                     >
                       <Radio value="FIXED">Fixed</Radio>
                       <Radio value="MARKUP">Markup</Radio>
                     </RadioGroup>
                    )}
                </FormItem>
              )}

              {showMarkupPricingItem ? (
                <fieldset>
                  <legend>Markup details</legend>
                    <FormItem label="Markup By:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('markupBy', {
                          rules: [
                            {
                              required: true,
                              message: 'Markup by must be specified',
                           },
                          ],
                       })(
                         <RadioGroup
                           disabled={priceDetailFormItemsDisabled}
                           onChange={this.pricingStrategyChangeHandler}
                         >
                           <Radio value="PERCENTAGE">Percentage</Radio>
                           <Radio value="VALUE">Value</Radio>
                         </RadioGroup>
                        )}
                    </FormItem>
                  <FormItem label="Markup:" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('markupValue', {
                          initialValue: 0,
                          rules: [
                            {
                              required: true,
                              message: 'Selling price markup value must be specified',
                           },
                          ],
                       })(<InputNumber precision={2} min={0} onChange={this.sellingPriceMarkupChangeHandler} />)}
                  </FormItem>
                </fieldset>
              ) : (
                <Row gutter={24} style={{ marginBottom: 0 }}>
                  <Col span={10}>
                    <FormItem label="Selling price:" hasFeedback {...inlineFormItemLayout}>
                      {getFieldDecorator('sellingPrice', {
                          initialValue: 0,
                          rules: [
                            {
                              required: true,
                              message: 'Selling price must be specified',
                           },
                          ],
                       })(<InputNumber disabled={sellingPriceInputDisabled} precision={2} min={minSellingPrice} onChange={this.sellingPriceChangeHandler} />)}
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem label="Min:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('minimumSellingPrice', {
                          rules: [
                            {
                              required: true,
                              message: 'Minimum price must be specified',
                           },
                          ],
                       })(<InputNumber
                         disabled={priceDetailFormItemsDisabled}
                         precision={2}
                         min={minSellingPrice}
                         onChange={this.minimumSellingPriceChangeHandler}
                       />)}
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem label="Max:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('maximumSellingPrice', {
                          rules: [
                            {
                              required: true,
                              message: 'Maximum selling price must be specified',
                           },
                          ],
                       })(<InputNumber
                         disabled={priceDetailFormItemsDisabled}
                         precision={2}
                         min={minMaxSellingPrice}
                       />)}
                    </FormItem>
                  </Col>
                </Row>
              )}


              {/*
                <FormItem label="Discount:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('discount', {
                 })(<InputNumber
                      min={0}
                      max={100}
                      precision={2}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')} />)}
                </FormItem>
              */}

              <FormItem {...noLabelTailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                >Save &amp; Proceed
                </Button>
              </FormItem>
            </Form>
          </LocaleProvider>
        </Row>
      </div>
    );
  }
}

export default PricingForm;
