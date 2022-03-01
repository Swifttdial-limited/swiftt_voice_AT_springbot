import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, LocaleProvider, Button, Input, InputNumber, Checkbox, Radio, Select, Row, Col, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DepartmentSelect from '../../../../components/common/DepartmentSelect';
import GroupSelect from '../../../../components/common/GroupSelect';
import PriceListSelect from '../../../../components/common/PriceListSelect';
import ProductSelect from '../../../../components/common/ProductSelect';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 4,
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
    span: 16,
    offset: 4,
  },
};

let uuid = 0;

@Form.create()
@connect(({ catalogue_products, loading }) => ({
  catalogue_products,
  loading: loading.effects['catalogue_products/query']
}))
class PricesDefinitionView extends PureComponent {

  state = {
    existingStrategy: 'IGNORE'
  };

  constructor(props) {
    super(props);
    this.props.form.getFieldDecorator('priceItemKeys', { initialValue: [] });
  }

  componentDidMount() {
    this.removeAllPrices();
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.catalogue_products.list.length > 0 && nextProps.catalogue_products.list.length != this.props.catalogue_products.list.length ) {
      let uuid = 0;;
      const priceItemsIndices = [];
      nextProps.catalogue_products.list.forEach((item, index) => {
        this.props.form.getFieldDecorator(`priceItems[${index}].product`, { initialValue: item });
        priceItemsIndices.push(index);
        uuid++;
      });
      this.props.form.getFieldDecorator('priceItemKeys', { initialValue: priceItemsIndices });
      //this.props.form.setFieldsValue({ priceItems: this.props.form.getFieldValue('priceItems') });
    }
  }

  removeAllPrices() {
    const { dispatch, form } = this.props;
    dispatch({ type: 'catalogue_products/purge' });

    uuid = 0;
    form.getFieldDecorator('priceItemKeys', { initialValue: [] });
    //form.getFieldDecorator('priceItems', { initialValue: [] });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const priceItemKeys = form.getFieldValue('priceItemKeys');
    const nextKeys = priceItemKeys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      priceItemKeys: nextKeys,
    });
    uuid++;
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const priceItemKeys = form.getFieldValue('priceItemKeys');
    // We need at least one passenger
    if (priceItemKeys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      priceItemKeys: priceItemKeys.filter(priceItemKey => priceItemKey !== k),
    });
  }

  changeExistingStrategy = value => {
    this.setState({ existingStrategy: value });
  }

  departmentSelectHandler = value => {
    this.removeAllPrices();
    this.props.form.setFieldsValue({ department: value });

    if (value) {
      this.props.dispatch({ type: 'catalogue_groups/query', payload: {  size: 10000, department: value.publicId } });
      this.props.dispatch({ type: 'catalogue_products/query', payload: { size: 10000, department: value.publicId } });
    } else {
      this.props.form.setFieldsValue({ group: null });
    }
  }

  groupSelectHandler = value => {
    this.removeAllPrices();
    this.props.form.setFieldsValue({ group: value });

    if (value) {
      this.props.dispatch({ type: 'catalogue_products/query', payload: { size: 10000, group: value.id } });
    } else {

    }
  }

  handleSubmitAndNew = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmit();
        form.resetFields();
      } else {}
    });
  }

  handleSubmitAndClose = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmit();
        dispatch(routerRedux.push('/catalogue/price-lists'));
      } else {}
    });
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {};
        payload.existingPriceListStrategy = this.state.existingStrategy;
        payload.priceListId = values.priceList.id;
        payload.actionType = 'BULK_CREATE_OR_UPDATE';
        payload.priceListItems = values.priceItems.filter(priceListItem => priceListItem.selected);

        if(payload.priceListItems.length > 0)
          this.props.dispatch({ type: 'catalogue_price_lists/doBulkAddOrUpdate', payload: payload });
      }
    });
  }

  render() {
    const { form, catalogue_products } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue,
    } = form;
    const { loading } = catalogue_products;

    const { existingStrategy } = this.state;

    function selectedPriceListItemHandler(e, key) {
      if(!e.target.checked) {
        //getFieldDecorator(`priceItems[${key}].sellingPrice`, { initialValue: null });
        getFieldDecorator(`priceItems[${key}].minimumSellingPrice`, { initialValue: null });
        getFieldDecorator(`priceItems[${key}].maximumSellingPrice`, { initialValue: null });
      }
    }

    function sellingPriceChangeHandler(value, key) {
      if(value > 0) {
        getFieldDecorator(`priceItems[${key}].selected`, { initialValue: true });
        //getFieldDecorator(`priceItems[${key}].sellingPrice`, { initialValue: value });
        getFieldDecorator(`priceItems[${key}].minimumSellingPrice`, { initialValue: value });
        getFieldDecorator(`priceItems[${key}].maximumSellingPrice`, { initialValue: value });
        //setFieldsValue({ priceItems: getFieldValue('priceItems') });
      }
    }

    const departmentSelectProps = {
      isBillingAllowed: true,
      multiSelect: false,
    };

    const groupSelectProps = {
      autoLoad: false,
      multiSelect: false,
    };

    const priceListSelectProps = {
      multiSelect: false,
      onPriceListSelect(value) {
        setFieldsValue({ priceList: value })
      },
    };

    const productSelectProps = {
      autoLoad: false,
      disabled: true,
    };

    const priceItemKeys = getFieldValue('priceItemKeys');
    const priceItemEntryFormItems = priceItemKeys.map((priceItemKey, index) => {
      const priceItem = getFieldValue(`priceItems[${priceItemKey}]`);
      return (
        <Row gutter={2} key={priceItemKey} style={{ marginBottom: 5 }}>
          <Col span={1}>
            <FormItem>
              {getFieldDecorator(`priceItems[${priceItemKey}].selected`, {
                valuePropName: 'checked',
              })(<Checkbox
                  disabled={!getFieldValue(`priceItems[${priceItemKey}].selected`)}
                  onChange={e => selectedPriceListItemHandler(e, priceItemKey)} />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem hasFeedback>
              {getFieldDecorator(`priceItems[${priceItemKey}].product`, {
                initialValue: priceItem.product,
                rules: [
                  {
                    required: true,
                    message: 'Product must be specified',
                 },
                ],
             })(<ProductSelect
                editValue={priceItem.product.productName}
                {...productSelectProps}
                onProductSelect={() => {}} />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem hasFeedback>
              {getFieldDecorator(`priceItems[${priceItemKey}].pricingStrategy`, {
                initialValue: "FIXED",
                  rules: [
                    {
                      required: true,
                      message: 'Pricing strategy must be specified',
                   },
                  ],
               })(
                 <Select>
                   <Option value="FIXED">Fixed</Option>
                   <Option value="MARKUP">Markup</Option>
                 </Select>
               )}
            </FormItem>

          </Col>
          <Col span={3}>
            <FormItem hasFeedback>
              {getFieldDecorator(`priceItems[${priceItemKey}].sellingPrice`, {
                rules: [
                  {
                    required: getFieldValue(`priceItems[${priceItemKey}].selected`),
                    message: 'Selling price must be specified',
                 },
                ],
               })(<InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    min={0}
                    onChange={value => sellingPriceChangeHandler(value, priceItemKey)}
                  />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem hasFeedback>
              {getFieldDecorator(`priceItems[${priceItemKey}].minimumSellingPrice`, {
                rules: [
                  {
                    required: getFieldValue(`priceItems[${priceItemKey}].selected`),
                    message: 'Minimum price must be specified',
                 },
                ],
               })(<InputNumber style={{ width: '100%' }} precision={2} min={0} />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem hasFeedback>
              {getFieldDecorator(`priceItems[${priceItemKey}].maximumSellingPrice`, {
                rules: [
                  {
                    required: getFieldValue(`priceItems[${priceItemKey}].selected`),
                    message: 'Maximum price must be specified',
                 },
                ],
               })(<InputNumber style={{ width: '100%' }} precision={2} min={0} />)}
            </FormItem>
          </Col>
        </Row>
      );
    });

    return(
      <PageHeaderLayout
        title="Prices definition"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <LocaleProvider locale={enUS}>
            <Form layout="horizontal">
              <FormItem label="Department：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('department', {
                    rules: [
                      {
                        required: true,
                        message: 'Department must be specified',
                     },
                    ],
                 })(<DepartmentSelect onDepartmentSelect={this.departmentSelectHandler} {...departmentSelectProps} />)}
              </FormItem>
              <FormItem label="Group：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('group', {})(<GroupSelect onGroupSelect={this.groupSelectHandler} {...groupSelectProps} />)}
              </FormItem>
              <FormItem label="Price List：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('priceList', {
                    rules: [
                      {
                        required: true,
                        message: 'Price list must be specified',
                     },
                    ],
                 })(<PriceListSelect {...priceListSelectProps} />)}
              </FormItem>

              <Row style={{ marginTop: 10 }}>
                <fieldset>
                  <legend>Items</legend>
                    <Row>
                      <Col span={6} offset={12} style={{ textAlign: 'right' }}>
                        <Select defaultValue={existingStrategy} onChange={this.changeExistingStrategy}>
                          <Option value="IGNORE">Add new and ignore existing prices</Option>
                          <Option value="UPDATE">Add new and update existing prices</Option>
                        </Select>
                      </Col>
                      <Col span={6} style={{ marginBottom: 16, textAlign: 'right' }}>
                        <RadioGroup
                          defaultValue="FIXED"
                          style={{ float: 'right' }}
                        >
                          <RadioButton value="FIXED">Mark as Fixed</RadioButton>
                          <RadioButton value="MARKUP">Mark as Markup</RadioButton>
                        </RadioGroup>
                      </Col>
                    </Row>
                    <Row gutter={2}>
                      <Col span={1}></Col>
                      <Col span={10}>Product / Service</Col>
                      <Col span={4}>Strategy</Col>
                      <Col span={3}>Selling Price</Col>
                      <Col span={3}>Min Selling Price</Col>
                      <Col span={3}>Max Selling Price</Col>
                    </Row>
                    <hr />
                    {loading ? <Card loading /> : priceItemEntryFormItems}
                </fieldset>
              </Row>

              <div style={{ marginTop: 10 }}>
                <FormItem {...noLabelTailFormItemLayout}>
                  <Button
                    type="primary"
                    onClick={this.handleSubmitAndClose}
                    style={{ marginRight: 10 }}
                  >Save &amp; Close
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleSubmitAndNew}
                  >Save &amp; New
                  </Button>
                </FormItem>
              </div>
            </Form>
          </LocaleProvider>
        </div>
      </PageHeaderLayout>
    );
  }

}

export default PricesDefinitionView;
