import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  LocaleProvider,
  Tooltip,
  Icon,
  Card,
  Button,
  Checkbox,
  DatePicker,
  Collapse,
  Modal,
  message, Spin, Select
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from "moment";


// import AccountSelect from '../../../components/common/AccountSelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import LocationSelect from "../../../components/common/LocationSelect";
import AssetCategoriesSelect from '../../../components/common/AssetCategoriesSelect';
import ContactSelect from '../../../components/common/ContactSelect';

const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
@connect()
class AssetForm extends PureComponent {

  state = {

  }

  resetState = () => {
    this.setState({})
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
        dispatch(routerRedux.push('/fixed-assets-management/asset-listing'));
      } else {}
    });
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'fixed_assets/create', payload: values });
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  locationSelectHandler = value => this.props.form.setFieldsValue({ locations: value });
  //bankAccountsSelectHandler = value => this.props.form.setFieldsValue({ bankAccount: value });
  //assetCategorySelectHandler = value => this.props.form.setFieldsValue({ assetCategory: value });
  //assetAccountsSelectHandler = value => this.props.form.setFieldsValue({ assetAccount: value });
  //depreciationExpenseAccountSelectHandler = value => this.props.form.setFieldsValue({ depreciationExpenseAccount: value });
  //accumulatedDepreciationAccountSelectHandler = value => this.props.form.setFieldsValue({ accumulatedDepreciationAccount: value });
  //revenueAccountSelectHandler = value => this.props.form.setFieldsValue({ revenueAccount: value });
  //lossAccountSelectHandler = value => this.props.form.setFieldsValue({ lossAccount: value });
  contactChangeHandler = value => this.props.form.setFieldsValue({ boughtFrom: value });
  // depreciationMethodSelectHandler = value => this.props.form.setFieldsValue({ DepreciationCalcMethod: value });



  render() {
    const {form} = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue,
      getFieldsError,
    } = form;

    // const bankAccountsSelectProps = {
    //   multiSelect: false,
    // };
    //
    // const assetAccountsSelectProps = {
    //   multiSelect: false,
    // };
    //
    // const depreciationExpenseAccountSelectProps = {
    //   multiSelect: false,
    // };
    //
    // const accumulatedDepreciationAccountSelectProps = {
    //   multiSelect: false,
    // };
    //
    // const revenueAccountSelectProps = {
    //   multiSelect: false,
    // };
    //
    // const lossAccountSelectProps = {
    //   multiSelect: false,
    // };

    const locationSelectProps = {
      multiSelect: false,
    };

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    // const VendorSelect = (
    //
    // );

    const assetCategorySelectProps = {
      multiSelect: false,
      onGroupSelect(value) {
        setFieldsValue({ assetCategory: value });
      },
    };

    return (
      <PageHeaderLayout
        title="New Asset definition"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >

        <div id="advanced-form" style={{padding: 20}}>

          <Card>
            <Row gutter={10}>
              <LocaleProvider locale={enUS}>
                  <Form layout="horizontal">

                  <FormItem label="Asset Name：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('assetName', {
                      rules: [
                        {
                          required: true,
                          message: 'Asset name must be specified',
                        },
                      ],
                    })(<Input placeholder="Asset name" />)}
                  </FormItem>

                  <FormItem label="Brand：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('brand', {
                      rules: [
                        {
                          //required: true,
                          message: 'brand must be specified',
                        },
                      ],
                    })(<Input placeholder="Brand name" />)}
                  </FormItem>

                  <FormItem label="Model：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('model', {
                      rules: [
                        {
                          //required: true,
                          message: 'model must be specified',
                        },
                      ],
                    })(<Input placeholder="Model name" />)}
                  </FormItem>

                  <FormItem label="Category：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('assetCategory', {
                      rules: [
                        {
                          required: true,
                          message: 'Asset category must be specified',
                        },
                      ],
                    })(<AssetCategoriesSelect {...assetCategorySelectProps} />)}
                  </FormItem>

                  <FormItem label="Barcode:" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('barcode', {
                      rules: [
                        {
                          required: true,
                          message: 'barcode must be specified',
                        },
                      ],
                    })(<Input  placeholder="Barcode name" />)}
                  </FormItem>

                  <FormItem label="Supplier:" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('boughtFrom', {
                      rules: [
                        {
                          required: true,
                          message: 'supplier must be specified',
                        },
                      ],
                    })(<ContactSelect
                      onContactSelect={this.contactChangeHandler}
                      {...contactSelectProps}
                    />)}
                    {/*<Input  placeholder="supplier name" />*/}
                  </FormItem>


                  <fieldset>
                    <legend>Depreciation</legend>
                    <FormItem label="Purchase Amount:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('buyingPrice', {
                        rules: [
                          {
                            required: true,
                            message: 'buying price must be specified',
                          },
                        ],
                    })(<Input />)}
                    </FormItem>

                    <FormItem label="Purchase Date:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('purchaseDate', {
                        rules: [
                          {
                            required: true,
                            message: 'purchase date must be specified',
                          },
                        ],})(
                        <DatePicker
                          format={dateFormat}
                          //disabledDate={disabledDate}
                        />)}
                    </FormItem>

                    <FormItem label="Asset life:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('assetLife', {
                        rules: [
                          {
                            required: true,
                            message: 'asset life in years must be specified',
                          },
                        ],
                    })(<InputNumber step={1} min={1} defaultValue={1} />)}
                    </FormItem>

                    <FormItem label="salvage Value:" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('salvageAmount', {
                      rules: [
                        {
                          required: true,
                          message: 'salvage value must be specified',
                        },
                      ],
                    })(<Input />)}
                    </FormItem>

                    <FormItem label="Depreciation method:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('depreciationCalcMethod', {
                        rules: [
                          {
                            required: true,
                            message: 'depreciation calculation method must be specified',
                          },
                        ],
                      })
                      (<Select name="depreciationCalcMethod"
                        >
                        <Option  value="STRAIGHT_LINE">STRAIGHT_LINE</Option>
                        <Option  value="DOUBLE_DECLINING"> DOUBLE_DECLINING</Option>
                        <Option  value="SUM_OF_THE_YEARS_DIGITS"> SUM_OF_THE_YEARS_DIGITS</Option>
                        </Select>) }
                    </FormItem>

                  </fieldset>

                  <fieldset>
                    <legend>Location</legend>
                    <FormItem label="Location:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('locations', {
                        rules: [
                          {
                            required: false },
                        ],
                      })(<LocationSelect {...locationSelectProps} onLocationSelect={this.locationSelectHandler} />)}
                    </FormItem>
                  </fieldset>

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
            </Row>
          </Card>

        </div>

      </PageHeaderLayout>
    );
  }
}
export default AssetForm;



