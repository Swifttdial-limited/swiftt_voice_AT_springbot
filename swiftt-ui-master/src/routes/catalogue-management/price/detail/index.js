import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message, Row, Col, Alert, Button, Tabs, Form, InputNumber, LocaleProvider, Tooltip } from 'antd';
import pathToRegexp from 'path-to-regexp';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/DescriptionList';
import PriceDeductionsView from '../../../../components/catalogue-management/catalogue/price/deductions';
import PriceListSelect from '../../../../components/common/PriceListSelect';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

@Form.create()
@connect(({ catalogue_prices, loading }) => ({
  prices: catalogue_prices,
  loading: loading.effects['catalogue_prices/query'],
}))
class PricingPageView extends PureComponent {

  static propTypes = {
    catalogue_prices: PropTypes.object,
  };

  state = {
    isEditActive: false,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/catalogue/price/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'catalogue_prices/queryOne', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_prices/purgeCurrentItem' });
  }

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  handleFormUpdateSubmit = (e) => {
    const { dispatch, prices } = this.props;
    const { currentItem } = prices;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = Object.assign({}, currentItem, values);
        dispatch({ type: 'catalogue_prices/update' , payload: data });
      }
    });
  }

  priceListSelectHandler = (value) => this.props.form.setFieldsValue({ priceList: value });

  sellingPriceChangeHandler = value => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    if(value > 0) {
      setFieldsValue({ minimumSellingPrice: value });
      setFieldsValue({ maximumSellingPrice: value });
    }
  }

  render() {

    const { dispatch, form, prices } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;
    const {
      loading,
      success,
      currentItem
    } = prices;

    const { isEditActive } = this.state;

    const priceListSelectProps = {
      multiSelect: false,
    };

    const priceDeductionsProp = {
      loadData: true,
      priceProfile: currentItem,
    };

    const formItems = (
      <div>
        <FormItem label="Price List:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('priceList', {
              initialValue: currentItem.priceList,
              rules: [
                {
                  required: true,
                  message: 'Price list must be specified',
               },
              ],
           })(<PriceListSelect
             editValue={currentItem.priceList ? currentItem.priceList.name : ''}
             {...priceListSelectProps}
             onPriceListSelect={this.priceListSelectHandler}
           />)}
        </FormItem>
        <FormItem label="Selling price:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sellingPrice', {
              initialValue: currentItem.sellingPrice,
              rules: [
                {
                  required: true,
                  message: 'Selling price must be specified',
               },
              ],
           })(<InputNumber precision={2} onChange={this.sellingPriceChangeHandler} />)}
        </FormItem>
        <FormItem label="Minimum Selling Price:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('minimumSellingPrice', {
              initialValue: currentItem.minimumSellingPrice,
              rules: [
                {
                  required: true,
                  message: 'Minimum price must be specified',
               },
              ],
           })(<InputNumber
             precision={2}
             onChange={this.minimumSellingPriceChangeHandler}
           />)}
        </FormItem>
        <FormItem label="Maximum Selling Price:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('maximumSellingPrice', {
              initialValue: currentItem.maximumSellingPrice,
              rules: [
                {
                  required: true,
                  message: 'Maximum selling price must be specified',
               },
              ],
           })(<InputNumber
             precision={2}
           />)}
        </FormItem>
        <FormItem label="Discount:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount', {
         })(<InputNumber
              min={0}
              max={100}
              precision={2}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')} />)}
        </FormItem>
      </div>
    );

    return (
      <PageHeaderLayout
        title={currentItem.id ? `Pricing: ${currentItem.product.productName} (${currentItem.priceList.name})` : 'Pricing'}
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col xs={24} md={24} lg={24}>
              {currentItem.id ? (
                <div>
                  <Row style={{ marginBottom: 10 }}>
                    { currentItem.product.locked &&
                      <Alert
                        message="Warning"
                        description="This is a deactivated product."
                        type="warning"
                        showIcon
                      />
                    }
                  </Row>
                  <Row gutter={24}>
                    { isEditActive ? (
                      <LocaleProvider locale={enUS}>
                        <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit} style={{ marginBottom: 20 }} >
                          {formItems}
                          <FormItem {...tailFormItemLayout}>
                            <Row>
                              <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                >Save
                                </Button>
                                <Button
                                  style={{ marginLeft: 8 }}
                                  onClick={this.onEditDetailsButtonClickHandler}
                                >Cancel
                                </Button>
                              </Col>
                            </Row>
                          </FormItem>
                        </Form>
                      </LocaleProvider>
                    ) : (
                      <div>
                        <Row gutter={24}>
                          <Col style={{ textAlign: 'right' }}>
                            <Tooltip title="Edit details">
                              <Button icon="edit" onClick={this.onEditDetailsButtonClickHandler}>Edit</Button>
                            </Tooltip>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col>
                            <DescriptionList size="small" col="2">
                              <Description term="Product">{currentItem.product.productName}</Description>
                              <Description term="Price List">{currentItem.priceList.name}</Description>
                              <Description term="Pricing Strategy">{currentItem.pricingStrategy}</Description>
                              <Description term="Markup Percentage">{`${numeral(currentItem.markupValue ? currentItem.markupValue : 0).format('0,0.00')}`} %</Description>
                              <Description term="Selling Price">{`${numeral(currentItem.sellingPrice).format('0,0.00')}`}</Description>
                              <Description term="Min. Selling Price">{`${numeral(currentItem.minimumSellingPrice).format('0,0.00')}`}</Description>
                              <Description term="Max. Selling Price">{`${numeral(currentItem.maximumSellingPrice).format('0,0.00')}`}</Description>
                            </DescriptionList>
                          </Col>
                        </Row>
                      </div>
                    ) }
                  </Row>
                  <Row>
                    <Col>
                      <Tabs defaultActiveKey="1" type="card" style={{ marginTop: 10 }}>
                        <TabPane tab="Deductions" key="1">
                          <PriceDeductionsView {...priceDeductionsProp} />
                        </TabPane>
                      </Tabs>
                    </Col>
                  </Row>
                </div>
              ) : <Alert message="Loading data" type="info" showIcon /> }
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PricingPageView;
