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
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import AccountSelect from '../../../../components/common/AccountSelect';
import AdministrationRouteSelect from '../../../../components/common/AdministrationRouteSelect';
import BrandSelect from '../../../../components/common/BrandSelect';
import DiagnosisSelect from '../../../../components/common/diagnosis/DiagnosisSelect';
import FormulationSelect from '../../../../components/common/FormulationSelect';
import GroupSelect from '../../../../components/common/GroupSelect';
import ProductUnitInput from '../../../../components/common/ProductUnitInput';
import ProductSelect from '../../../../components/common/ProductSelect';
import RoleSelect from '../../../../components/common/RoleSelect';
import StrengthSelect from '../../../../components/common/StrengthSelect';
import TaxCodeSelect from '../../../../components/common/accounting/TaxCodeSelect';

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
class ProductForm extends PureComponent {

  state = {
    showStrengthFormItem: false,
    showFormulationItem: false,
    showAdministrationRouteFormItem: false,
    showBrandFormItem: false,
    showIncomeAccountFormItem: false,
    showStockAccountFormItem: false,
    showCostAccountFormItem: false,
    showBarcodeFormItem: false,
    showSupplyFormItem: false,
    showServiceFormItem: false,
    showGroupFormItem: false,
    showDispensingUnitFormItem: false,
    showTrackableFormItem: false,
    showDiagnosisFormItems: false,
    showAssignToFormItems: false,
    showPackageFormItem: false,
  };

  administrationRouteSelectHandler = value => this.props.form.setFieldsValue({ administrationRoute: value })

  brandSelectHandler = value => this.props.form.setFieldsValue({ brand: value })

  formulationSelectHandler = value => this.props.form.setFieldsValue({ formulation: value })

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
        dispatch(routerRedux.push('/catalogue/products'));
      } else {}
    });
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'catalogue_products/create', payload: values });
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  incomeAccountsSelectHandler = value => this.props.form.setFieldsValue({ incomeAccounts: value })

  stockAccountSelectHandler = value => this.props.form.setFieldsValue({ stockAccount: value })

  packSizeChangeHandler = value => this.props.form.setFieldsValue({ packSize: value });

   productTypeChangeHandler = (e) => {
     this.resetState();

     if (e.target.value === 'MEDICATION') {
       this.setState({
         showGroupFormItem: true,
         showStrengthFormItem: true,
         showFormulationItem: true,
         showAdministrationRouteFormItem: true,
         showBrandFormItem: true,
         showIncomeAccountFormItem: true,
         showStockAccountFormItem: true,
         showCostAccountFormItem: true,
         showBarcodeFormItem: true,
         showDispensingUnitFormItem: true,
         showTrackableFormItem: true,
         showDiagnosisFormItems: true,
         showAssignToFormItems: true,
       });
     } else if (e.target.value === 'SUPPLIES') {
       this.setState({
         showBarcodeFormItem: true,
         showGroupFormItem: true,
         showSupplyFormItem: true,
         showDispensingUnitFormItem: true,
         showTrackableFormItem: true,
         showIncomeAccountFormItem: true,
         showStockAccountFormItem: true,
         showCostAccountFormItem: true,
       });
     } else if (e.target.value === 'SERVICE') {
       this.setState({ showGroupFormItem: true, showServiceFormItem: true, showAssignToFormItems: true, showIncomeAccountFormItem: true });
     } else if (e.target.value === 'PACKAGE') {
       this.setState({
         showGroupFormItem: true,
         showDiagnosisFormItems: true,
         showAssignToFormItems: true,
         showPackageFormItem: true,
         showIncomeAccountFormItem: true,
       });
     }
   }

  resetState = () => {
    this.setState({
      showStrengthFormItem: false,
      showFormulationItem: false,
      showAdministrationRouteFormItem: false,
      showBrandFormItem: false,
      showStockAccountFormItem: false,
      showCostAccountFormItem: false,
      showBarcodeFormItem: false,
      showSupplyFormItem: false,
      showServiceFormItem: false,
      showGroupFormItem: false,
      showDispensingUnitFormItem: false,
      showTrackableFormItem: false,
      showDiagnosisFormItems: false,
      showAssignToFormItems: false,
      showPackageFormItem: false,
    });
  }

  roleSelectHandler = value => this.props.form.setFieldsValue({ assignableRoles: value });

  costAccountSelectHandler = value => this.props.form.setFieldsValue({ costAccount: value })

  strengthSelectHandler = value => this.props.form.setFieldsValue({ strength: value })

  taxCodeSelectHandler = value => this.props.form.setFieldsValue({ taxCode: value });

  trackableToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ trackable: e.target.value });
  }

  render() {
    const { form } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue,
      getFieldsError,
    } = form;

    const {
      showStrengthFormItem,
      showFormulationItem,
      showAdministrationRouteFormItem,
      showBrandFormItem,
      showIncomeAccountFormItem,
      showCostAccountFormItem,
      showStockAccountFormItem,
      showBarcodeFormItem,
      showServiceFormItem,
      showSupplyFormItem,
      showGroupFormItem,
      showDispensingUnitFormItem,
      showTrackableFormItem,
      showDiagnosisFormItems,
      showAssignToFormItems,
      showPackageFormItem,
    } = this.state;

    const accountSelectProps = {
      multiSelect: false,
    };

    const administrationRouteSelectProps = {
      multiSelect: false,
    };

    const brandSelectProps = {
      multiSelect: false,
    };

    const diagnosisSelectProps = {
      multiSelect: true,
      onDiagnosisSelect(value) {
        setFieldsValue({ diagnoses: value });
      },
    };

    const formulationSelectProps = {
      multiSelect: false,
    };

    const groupSelectProps = {
      multiSelect: false,
      groupType: (getFieldValue('productType') === 'SERVICE' || getFieldValue('productType') === 'PACKAGE') ? 'SERVICE' : 'DRUG',
      onGroupSelect(value) {
        setFieldsValue({ group: value });
      },
    };

    const incomeAccountsSelectProps = {
      multiSelect: true,
    };

    const packSizeSelectProps = {
      multiSelect: false,
    };

    const roleSelectProps = {
      multiSelect: true,
    };

    const strengthSelectProps = {
      multiSelect: false,
    };

    return (
      <PageHeaderLayout
        title="New Product definition"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div id="advanced-form" style={{ padding: 20 }}>
          <Card>
            <Row gutter={10}>
              <LocaleProvider locale={enUS}>
                <Form layout="horizontal">
                  <FormItem
                    label="Type:"
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('productType', {
                        rules: [
                          {
                            required: true,
                            message: 'Product type must be specified',
                         },
                        ],
                     })(
                       <RadioGroup onChange={this.productTypeChangeHandler}>
                         <Radio value="MEDICATION">Medication</Radio>
                         <Radio value="SERVICE">Service</Radio>
                         <Radio value="SUPPLIES">Supplies</Radio>
                         <Radio value="PACKAGE">Package</Radio>
                       </RadioGroup>
                      )}
                  </FormItem>
                  {showGroupFormItem && (
                    <FormItem label="Group：" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('group', {
                          rules: [
                            {
                              required: true,
                              message: 'Product group must be specified',
                           },
                          ],
                       })(<GroupSelect {...groupSelectProps} />)}
                    </FormItem>
    )}
                  {showServiceFormItem && (
                    <FormItem label="Service Name：" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('productName', {
                          rules: [
                            {
                              required: true,
                              message: 'Service name must be specified',
                           },
                          ],
                       })(<Input placeholder="Service name" />)}
                    </FormItem>
    )}

                {showSupplyFormItem && (
                  <FormItem label="Supply Item Name：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('productName', {
                        rules: [
                          {
                            required: true,
                            message: 'Supply item name must be specified',
                         },
                        ],
                     })(<Input placeholder="Supply item name" />)}
                  </FormItem>
                )}

                {showPackageFormItem && (
                  <FormItem label="Package Name：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('productName', {
                        rules: [
                          {
                            required: true,
                            message: 'Package name must be specified',
                         },
                        ],
                     })(<Input placeholder="Package name" />)}
                  </FormItem>
                )}
                  {showBrandFormItem && (
                    <FormItem label="Brand：" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('brand', {
                          rules: [
                            {
                              required: true,
                              message: 'Product brand must be specified',
                           },
                          ],
                       })(<BrandSelect onBrandSelect={this.brandSelectHandler} {...brandSelectProps} />)}
                    </FormItem>
    )}
                  {showFormulationItem && (
                    <FormItem label="Formulation：" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('formulation', {
                          rules: [
                            {
                              required: true,
                              message: 'Product formulation must be specified',
                           },
                          ],
                       })(<FormulationSelect onFormulationSelect={this.formulationSelectHandler} {...formulationSelectProps} />)}
                    </FormItem>
    )}
                  {showStrengthFormItem && (
                    <FormItem label="Strength:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('strength', {
                          rules: [
                            {
                              required: true,
                              message: 'Product strenght must be specified',
                           },
                          ],
                       })(<StrengthSelect onStrengthSelect={this.strengthSelectHandler} {...strengthSelectProps} />)}
                    </FormItem>
    )}

                  {showDispensingUnitFormItem && (
                    <FormItem label="Pack Size:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('packSize', {
                          rules: [
                            {
                              required: true,
                              type: 'object',
                              fields: {
                                packSize: { type: 'integer', required: true, message: 'Pack size must be specified' },
                                unitOfMeasure: { type: 'object', required: true, message: 'Unit of measure must be specified' },
                              },
                              message: 'Pack size and unit of measure must be specified',
                           },
                          ],
                       })(<ProductUnitInput {...packSizeSelectProps} onProductUnitInput={this.packSizeChangeHandler} />)}
                    </FormItem>
    )}

                  {showAdministrationRouteFormItem && (
                    <FormItem label="Administration Route：" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('administrationRoute', {
                          rules: [
                            {
                              required: false,
                              message: 'Product administration route must be specified',
                           },
                          ],
                       })(<AdministrationRouteSelect onAdministrationRouteSelect={this.administrationRouteSelectHandler} {...administrationRouteSelectProps} />)}
                    </FormItem>
    )}
                  <FormItem label="Custom code：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('customProductCode', {})(<Input />)}
                  </FormItem>
                  {showBarcodeFormItem && (
                    <FormItem label="Barcode:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('barCode', {
                       })(<Input />)}
                    </FormItem>
    )}

                  {showBarcodeFormItem && (
                    <FormItem label="Alternative Bar Code:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('alternativeBarcode', {
                       })(<Input />)}
                    </FormItem>
              )}

                { showTrackableFormItem && (
                  <FormItem {...noLabelTailFormItemLayout}>
                    {getFieldDecorator('trackable', {
                      initialValue: true,
                    })(
                      <Checkbox
                        defaultChecked={true}
                        onChange={this.trackableToggleHandler}
                      >
                        <span>Track quantities of stock?&nbsp;
                          <Tooltip title="Do you want the item's stock quantities tracked?">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      </Checkbox>)}
                  </FormItem>
                )}

                  { showDiagnosisFormItems && (
                    <FormItem label="Diagnoses:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('diagnoses', {
                       })(<DiagnosisSelect {...diagnosisSelectProps} />)}
                    </FormItem>
                  )}

                  {(showIncomeAccountFormItem || showStockAccountFormItem || showCostAccountFormItem) && (
                    <fieldset>
                      <legend>Accounts</legend>
                      {showIncomeAccountFormItem && (
                        <FormItem label="Income Accounts:" hasFeedback {...formItemLayout}>
                          {getFieldDecorator('incomeAccounts', {
                                rules: [
                                  {
                                    required: (getFieldValue('productType') === 'SUPPLIES' ) ? false : true,
                                    message: 'Income account(s) must be specified',
                                 },
                                ],
                             })(<AccountSelect {...incomeAccountsSelectProps}
                                  onAccountSelect={this.incomeAccountsSelectHandler} />)}
                        </FormItem>
                      )}

                      {showStockAccountFormItem && (
                        <FormItem label="Stock Account:" hasFeedback {...formItemLayout}>
                          {getFieldDecorator('stockAccount', {
                                rules: [
                                  {
                                    required: (getFieldValue('productType') === 'MEDICATION' || getFieldValue('productType') === 'SUPPLIES') ? true : false,
                                    message: 'Stock account must be specified',
                                 },
                                ],
                             })(<AccountSelect {...accountSelectProps}
                                  onAccountSelect={this.stockAccountSelectHandler} />)}
                        </FormItem>
      )}

                      {showCostAccountFormItem && (
                        <FormItem label="Cost Account:" hasFeedback {...formItemLayout}>
                          {getFieldDecorator('costAccount', {
                                rules: [
                                  {
                                    required: getFieldValue('productType') === 'MEDICATION' || getFieldValue('productType') === 'SUPPLIES' ? true : false,
                                    message: 'Stock cost account must be specified',
                                 },
                                ],
                             })(<AccountSelect {...accountSelectProps}
                                  onAccountSelect={this.costAccountSelectHandler} />)}
                        </FormItem>
      )}
                    </fieldset>
                  )}


                  <fieldset>
                    <legend>Tax</legend>
                    <FormItem label="Tax Code:" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('taxCode', {
                          rules: [
                            {
                              required: false,
                              message: 'Tax Code must be specified',
                           },
                          ],
                       })(<TaxCodeSelect onTaxCodeSelect={this.taxCodeSelectHandler} />)}
                    </FormItem>
                  </fieldset>

                  { showAssignToFormItems && (
                    <fieldset>
                      <legend>Assign To</legend>
                      <FormItem label="Roles:" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('assignableRoles', {
                            rules: [
                              {
                                required: false },
                            ],
                         })(<RoleSelect {...roleSelectProps} onRoleSelect={this.roleSelectHandler} />)}
                      </FormItem>
                    </fieldset>
                  )}

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

export default ProductForm;
