import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Tooltip,
  Icon,
  Tag,
  Form,
  Input,
  LocaleProvider,
  Row,
  Checkbox,
  Col
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AdministrationRouteSelect from '../../../common/AdministrationRouteSelect';
import BrandSelect from '../../../common/BrandSelect';
import DescriptionList from '../../../DescriptionList';
import FormulationSelect from '../../../common/FormulationSelect';
import GroupSelect from '../../../common/GroupSelect';
import ProductUnitInput from '../../../common/ProductUnitInput';
import StrengthSelect from '../../../common/StrengthSelect';

const { Description } = DescriptionList;

const FormItem = Form.Item;

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
class ProductBasicDetailsView extends PureComponent {

  static defaultProps = {
    product: {},
    onProductUpdate: () => { },
  };

  static propTypes = {
    product: PropTypes.object.isRequired,
    onProductUpdate: PropTypes.func,
  };

  state = {
    isEditActive: false,
    showBrandFormItem: false,
    showFormulationFormItem: false,
    showStrengthFormItem: false,
    showPackSizeFormItem: false,
    showAdministrationRouteFormItem: false,
    showBarcodeFormItem: false,
    showAlternativeBarcodeFormItem: false,
    showServiceNameFormItem: false,
    showSupplyNameFormItem: false,
    showPackageNameFormItem: false,
    showGroupFormItem: false,
    showTrackableFormItem: false,
  };

  resetState = () => {
    this.setState({
      showBrandFormItem: false,
      showFormulationFormItem: false,
      showStrengthFormItem: false,
      showPackSizeFormItem: false,
      showAdministrationRouteFormItem: false,
      showBarcodeFormItem: false,
      showAlternativeBarcodeFormItem: false,
      showServiceNameFormItem: false,
      showSupplyNameFormItem: false,
      showPackageNameFormItem: false,
      showGroupFormItem: false,
      showTrackableFormItem: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('product' in nextProps) {
      if ('id' in nextProps.product) {
        this.buildItemsToShow(nextProps.product.productType);
      }
    }
  }

  buildItemsToShow = (productType) => {
    this.resetState();

    if (productType === 'MEDICATION') {
      this.setState({
        showBrandFormItem: true,
        showFormulationFormItem: true,
        showStrengthFormItem: true,
        showPackSizeFormItem: true,
        showAdministrationRouteFormItem: true,
        showBarcodeFormItem: true,
        showAlternativeBarcodeFormItem: true,
        showTrackableFormItem: true,
      });
    } else if (productType === 'PACKAGE') {
      this.setState({
        showBarcodeFormItem: true,
        showAlternativeBarcodeFormItem: true,
        showPackageNameFormItem: true,
        showGroupFormItem: true,
      });
    } else if (productType === 'SERVICE') {
      this.setState({
        showBarcodeFormItem: true,
        showAlternativeBarcodeFormItem: true,
        showServiceNameFormItem: true,
        showGroupFormItem: true,
      });
    } else if (productType === 'SUPPLIES') {
      this.setState({
        showBarcodeFormItem: true,
        showPackSizeFormItem: true,
        showAlternativeBarcodeFormItem: true,
        showSuppliesNameFormItem: true,
        showGroupFormItem: true,
        showTrackableFormItem: true,
      });
    }
  }

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onProductUpdate(values);
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  administrationRouteSelectHandler = value => this.props.form.setFieldsValue({ administrationRoute: value })

  brandSelectHandler = value => this.props.form.setFieldsValue({ brand: value })

  formulationSelectHandler = value => this.props.form.setFieldsValue({ formulation: value })

  packSizeChangeHandler = value => this.props.form.setFieldsValue({ packSize: value });

  strengthSelectHandler = value => this.props.form.setFieldsValue({ strength: value });

  generateIsTrackableToggleHandler = e => this.props.form.setFieldsValue({ trackable: e.target.value });

  render() {
    const { form, product } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldValue, setFieldsValue } = form;

    const {
      isEditActive,
      showBrandFormItem,
      showFormulationFormItem,
      showStrengthFormItem,
      showPackSizeFormItem,
      showAdministrationRouteFormItem,
      showBarcodeFormItem,
      showAlternativeBarcodeFormItem,
      showServiceNameFormItem,
      showSupplyNameFormItem,
      showPackageNameFormItem,
      showSuppliesNameFormItem,
      showGroupFormItem,
      showTrackableFormItem,
    } = this.state;

    // const renderContent = (values, type) => {
    //   if (values && values.length > 0) { return values.map(item => (<Tag key={item.id}>Y</Tag>)); } else { return 'Not specified'; }
    // };

    const administrationRouteSelectProps = {
      multiSelect: false,
    };

    const brandSelectProps = {
      multiSelect: false,
    };

    const formulationSelectProps = {
      multiSelect: false,
    };
    const noLabelTailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };

    const groupSelectProps = {
      multiSelect: false,
      groupType: (product.productType === 'SERVICE' || product.productType === 'PACKAGE') ? 'SERVICE' : 'DRUG',
      onGroupSelect(value) {
        setFieldsValue({ group: value });
      },
    };

    const packSizeSelectProps = {
      multiSelect: false,
    };

    const strengthSelectProps = {
      multiSelect: false,
    };

    let medicationDescriptionList = <DescriptionList size="small" col="2" />;
    medicationDescriptionList = (
      <DescriptionList size="small" col="2">
        <Description term="Product Name">{product.productName ? product.productName : 'Not Specified'}</Description>
        <Description term="Brand">{product.brand ? `${product.brand.brandName} (${product.brand.brandType})` : 'Not Specified'}</Description>
        <Description term="Manufacturer">{product.brand ? product.brand.manufacturer.manufacturerName : 'Not Specified'}</Description>
        <Description term="Formulation">{product.formulation ? product.formulation.formulationName : 'Not Specified'}</Description>
        <Description term="Strength">{product.strength ? product.strength.strengthName : 'Not Specified'}</Description>
        {/* <Description term="Active Ingredients">{renderContent(product.brand.activeIngredients, 'activeIngredient')}</Description> */}
        <Description term="Pack Size">{product.packSize ? `${product.packSize.packSize} (${product.packSize.unitOfMeasure ? product.packSize.unitOfMeasure.name : null})` : 'Not Specified'}</Description>
        <Description term="Administration Route">{product.administrationRoute ? product.administrationRoute.routeName : 'Not Specified'}</Description>
        <Description term="">&nbsp;</Description>
        <Description term="Barcode">{product.barcode ? product.barcode : 'Not Specified'}</Description>
        <Description term="Alternative Barcode">{product.alternativeBarcode ? product.alternativeBarcode : 'Not Specified'}</Description>
        <Description term="Custom Code">{product.customProductCode ? product.customProductCode : 'Not Specified'}</Description>
        <Description term="Track Stock">{product.trackable ? 'Yes' : 'No'}</Description>
      </DescriptionList>
    );

    let packageDescriptionList = <DescriptionList size="small" col="2" />;
    packageDescriptionList = (
      <DescriptionList size="small" col="2">
        <Description term="Package Name">{product.productName ? product.productName : 'Not Specified'}</Description>
        <Description term="Group">{product.group ? product.group.groupName : 'Not Specified'}</Description>
        <Description term="Barcode">{product.barcode ? product.barcode : 'Not Specified'}</Description>
        <Description term="Alternative Barcode">{product.alternativeBarcode ? product.alternativeBarcode : 'Not Specified'}</Description>
        <Description term="Custom Code">{product.customProductCode ? product.customProductCode : 'Not Specified'}</Description>
      </DescriptionList>
    );

    let serviceDescriptionList = <DescriptionList size="small" col="2" />;
    serviceDescriptionList = (
      <DescriptionList size="small" col="2">
        <Description term="Service Name">{product.productName ? product.productName : 'Not Specified'}</Description>
        <Description term="Group">{product.group ? product.group.groupName : 'Not Specified'}</Description>
        <Description term="Barcode">{product.barcode ? product.barcode : 'Not Specified'}</Description>
        <Description term="Alternative Barcode">{product.alternativeBarcode ? product.alternativeBarcode : 'Not Specified'}</Description>
        <Description term="Custom Code">{product.customProductCode ? product.customProductCode : 'Not Specified'}</Description>
      </DescriptionList>
    );

    let suppliesDescriptionList = <DescriptionList size="small" col="2" />;
    suppliesDescriptionList = (
      <DescriptionList size="small" col="2">
        <Description term="Supplies Name">{product.productName ? product.productName : 'Not Specified'}</Description>
        <Description term="Group">{product.group ? product.group.groupName : 'Not Specified'}</Description>
        <Description term="Barcode">{product.barcode ? product.barcode : 'Not Specified'}</Description>
        <Description term="Alternative Barcode">{product.alternativeBarcode ? product.alternativeBarcode : 'Not Specified'}</Description>
        <Description term="Pack Size">{product.packSize ? `${product.packSize.packSize} (${product.packSize.unitOfMeasure ? product.packSize.unitOfMeasure.name : null})` : 'Not Specified'}</Description>
        <Description term="Custom Code">{product.customProductCode ? product.customProductCode : 'Not Specified'}</Description>
        <Description term="Track Stock">{product.trackable ? 'Yes' : 'No'}</Description>
      </DescriptionList>
    );

    const groupFormItem = (
      <FormItem label="Group：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('group', {
          initialValue: product.group ? product.group : null,
          rules: [
            {
              required: true,
              message: 'Product group must be specified',
            },
          ],
        })(<GroupSelect
          editValue={product.group ? product.group : null}
          {...groupSelectProps} />)}
      </FormItem>
    );

    const brandFormItem = (
      <FormItem label="Brand：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('brand', {
          initialValue: product.brand,
          rules: [
            {
              required: product.productType === 'MEDICATION' ? true : false,
              message: 'Product brand must be specified',
            },
          ],
        })(<BrandSelect
          editValue={product.brand ? product.brand.brandName : null}
          onBrandSelect={this.brandSelectHandler}
          {...brandSelectProps}
        />
        )}
      </FormItem>
    );

    const formulationFormItem = (
      <FormItem label="Formulation：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('formulation', {
          initialValue: product.formulation,
          rules: [
            {
              required: product.productType === 'MEDICATION' ? true : false,
              message: 'Product formulation must be specified',
            },
          ],
        })(<FormulationSelect
          editValue={product.formulation ? product.formulation.formulationName : null}
          onFormulationSelect={this.formulationSelectHandler}
          {...formulationSelectProps}
        />
        )}
      </FormItem>
    );

    const strengthFormItem = (
      <FormItem label="Strength:" hasFeedback {...formItemLayout}>
        {getFieldDecorator('strength', {
          initialValue: product.strength,
          rules: [
            {
              required: product.productType === 'MEDICATION' ? true : false,
              message: 'Product strenght must be specified',
            },
          ],
        })(
          <StrengthSelect
            editValue={product.strength ? product.strength.strengthName : null}
            onStrengthSelect={this.strengthSelectHandler}
            {...strengthSelectProps}
          />)}
      </FormItem>
    );


    const packSizeFormItem = (
      <FormItem label="Pack Size:" hasFeedback {...formItemLayout}>
        {getFieldDecorator('packSize', {
          initialValue: product.packSize,
          rules: [
            {
              required: false,
              message: 'Pack size and unit of measure must be specified',
            },
          ],
        })(
          <ProductUnitInput
            editValue={product.packSize ? product.packSize : null}
            {...packSizeSelectProps}
            onProductUnitInput={this.packSizeChangeHandler}
          />
        )}
      </FormItem>
    );

    const administrationRouteFormItem = (
      <FormItem label="Administration Route：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('administrationRoute', {
          initialValue: product.administrationRoute,
          rules: [
            {
              required: false,
              message: 'Product administration route must be specified',
            },
          ],
        })(
          <AdministrationRouteSelect
            editValue={product.administrationRoute ? product.administrationRoute.routeName : null}
            onAdministrationRouteSelect={this.administrationRouteSelectHandler}
            {...administrationRouteSelectProps}
          />
        )}
      </FormItem>
    );

    const barcodeFormItem = (
      <div>
        <FormItem label="Barcode:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('barcode', {
            initialValue: product.barcode,
          })(
            <Input placeholder="Barcode" />
          )}
        </FormItem>
        <FormItem label="Alternative Barcode:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('alternativeBarcode', {
            initialValue: product.alternativeBarcode,
          })(<Input placeholder="Alternative Barcode" />)}
        </FormItem>
      </div>
    );

    const customProductCodeFormItem = (
      <FormItem label="Custom Code:" hasFeedback {...formItemLayout}>
        {getFieldDecorator('customProductCode', {
          initialValue: product.customProductCode,
        })(
          <Input placeholder="Custom Code" />
        )}
      </FormItem>
    );
    const isTrackableFormItem = (
      <FormItem {...noLabelTailFormItemLayout}>
        {getFieldDecorator('trackable', {
          initialValue: product.trackable,
        })(
          <Checkbox
            defaultChecked={product.trackable}
            onChange={this.generateIsTrackableToggleHandler}
          >
            <span>Is trackable?&nbsp;
                    <Tooltip title="Do you want to track movement for this product?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          </Checkbox>)}
      </FormItem>
    );

    const serviceNameFormItem = (
      <FormItem label="Service Name：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('productName', {
          initialValue: product.productName,
          rules: [
            {
              required: true,
              message: 'Service name must be specified',
            },
          ],
        })(<Input placeholder="Service name" />)}
      </FormItem>
    );

    const packageNameFormItem = (
      <FormItem label="Package Name：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('productName', {
          initialValue: product.productName,
          rules: [
            {
              required: true,
              message: 'Package name must be specified',
            },
          ],
        })(<Input placeholder="Package name" />)}
      </FormItem>
    );

    const suppliesNameFormItem = (
      <FormItem label="Supplies Name：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('productName', {
          initialValue: product.productName,
          rules: [
            {
              required: true,
              message: 'Supplies name must be specified',
            },
          ],
        })(<Input placeholder="Supplies name" />)}
      </FormItem>
    );

    return (
      <LocaleProvider locale={enUS}>
        <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit} style={{ marginBottom: 20 }} >
          {isEditActive
            ? (
              <div>
                {showServiceNameFormItem && serviceNameFormItem}
                {showPackageNameFormItem && packageNameFormItem}
                {showSuppliesNameFormItem && suppliesNameFormItem}
                {showGroupFormItem && groupFormItem}
                {showBrandFormItem && brandFormItem}
                {showFormulationFormItem && formulationFormItem}
                {showStrengthFormItem && strengthFormItem}
                {showPackSizeFormItem && packSizeFormItem}
                {showAdministrationRouteFormItem && administrationRouteFormItem}
                {showBarcodeFormItem && barcodeFormItem}
                {customProductCodeFormItem}
                {showTrackableFormItem && isTrackableFormItem}
                <FormItem {...tailFormItemLayout}>
                  <Row>
                    <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={this.hasErrors(getFieldsError())}
                      >Save</Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={this.onEditDetailsButtonClickHandler}
                      >Cancel</Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            ) : (
              <div>
                <Row>
                  <Col style={{ textAlign: 'right' }}>
                    <Tooltip title="Edit details">
                      <Button icon="edit" onClick={this.onEditDetailsButtonClickHandler}>Edit</Button>
                    </Tooltip>
                  </Col>
                </Row>
                {product.productType === 'MEDICATION' && medicationDescriptionList}
                {product.productType === 'PACKAGE' && packageDescriptionList}
                {product.productType === 'SERVICE' && serviceDescriptionList}
                {product.productType === 'SUPPLIES' && suppliesDescriptionList}
              </div>
            )}
        </Form>
      </LocaleProvider>
    );
  }
}

export default ProductBasicDetailsView;
