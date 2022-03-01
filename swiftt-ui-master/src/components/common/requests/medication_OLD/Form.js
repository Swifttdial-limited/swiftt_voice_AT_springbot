import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { map, orderBy, uniq, remove } from 'lodash';
import {
  Form,
  Input,
  InputNumber,
  LocaleProvider,
  Select,
  Icon,
  Button,
  Row,
  Col,
  Alert,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { query as pricesQuery } from '../../../../services/catalogue/prices';

import CustomLoader from '../../CustomLoader';
import DepartmentSelect from '../../DepartmentSelect';
import PriceListItemSelect from '../../PriceListItemSelect';

const allowFuture = true;
const allowPast = false;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

let itemsUUID = 0;
let associatedRequestItemsUUID = 0;

@Form.create()
@connect(({ catalogue_prices }) => ({
  catalogue_prices
}))
class RequestForm extends PureComponent {
  static defaultProps = {
    onCancel: () => { },
    onCancelAndNew: () => { },
  };

  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    item: PropTypes.object,
    encounter: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onCancelAndNew: PropTypes.func,
    catalogue_prices: PropTypes.object.isRequired,
  };

  state = {
    isAddProductButtonDisabled: false,
    isAssociatedItemsSectionVisible: false,
    isProductSelectVisible: false,
    isNoPriceItemsFoundAlertVisible: false,
    selectedDepartment: {},
  };

  componentDidMount() {
    if (itemsUUID == 0) {
      this.addRequestItem();
    } else {
      itemsUUID = 0;
      associatedRequestItemsUUID = 0;
    }
  }

  addRequestItem = () => {
    const { form } = this.props;
    // can use data-binding to get
    const itemKeys = form.getFieldValue('itemKeys');
    const nextKeys = itemKeys.concat(itemsUUID);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      itemKeys: nextKeys,
    });
    itemsUUID++;
  }

  addAssociatedRequestItem = () => {
    const { form } = this.props;
    // can use data-binding to get
    const associatedRequestItemKeys = form.getFieldValue('associatedRequestItemKeys');
    const nextKeys = associatedRequestItemKeys.concat(associatedRequestItemsUUID);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      associatedRequestItemKeys: nextKeys,
    });
    associatedRequestItemsUUID++;
  }

  handleSubmitAndClose = () => {
    this.handleSubmit();

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleSubmitAndNew = () => {
    this.handleSubmit();

    if (this.props.onCancelAndNew) {
      this.props.onCancelAndNew();
    }
  }

  validateProductGroupDepartmentAndDestinationDepartment = (departments) => {
    const { selectedDepartment } = this.state;
    console.log("selectedDepartment", selectedDepartment);
    console.log( departments.find(department => department.publicId === selectedDepartment.publicId));
    return departments.find(department => department.publicId === selectedDepartment.publicId);
  }

  handleSubmit = () => {
    const { dispatch, form, encounter } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      console.log("data", data);
      let requests = [];
      let allRequestItems = [];

      if (data.items != undefined) {
        data.items.forEach((item) => {
          allRequestItems.push(item);
        });
      }

      if (data.associatedRequestItems != undefined) {
        data.associatedRequestItems.forEach((associatedRequestItem) => {
          allRequestItems.push(associatedRequestItem);
        });
      }

      console.log("requestItemWrapper", allRequestItems);

      map(
        uniq(
          map(allRequestItems, requestItemWrapper => JSON.stringify(requestItemWrapper.requestItem.destinationDepartment))
        ),
        destinationDepartment => {
          console.log(destinationDepartment)
          return JSON.parse(destinationDepartment);
        }
      ).forEach(destinationDepartment => {
        let request = {
          destinationDepartment: destinationDepartment,
          description: '',
          requestItems: []
        };
        allRequestItems.forEach((requestItemWrapper) => {
          if (requestItemWrapper.requestItem.destinationDepartment.publicId === destinationDepartment.publicId) {
            request.requestItems.push({ requestItem: requestItemWrapper.requestItem });
          }
        });

        requests.push(request);
      });

      console.log(requests);

      //
      const payload = { encounterId: encounter.id, requests: requests };
      dispatch({ type: 'requests/create', payload });
    });
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  quantityChangeHandler = (e, key) => { }

  removeRequestItem = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const itemKeys = form.getFieldValue('itemKeys');
    // We need at least one passenger
    if (itemKeys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      itemKeys: itemKeys.filter(itemKey => itemKey !== k),
    });

    this.removeAssociatedRequestItem(k);
  }

  removeAssociatedRequestItem = (k) => {
    const { form } = this.props;

    const associatedRequestItemKeys = form.getFieldValue('associatedRequestItemKeys');

    form.setFieldsValue({
      associatedRequestItemKeys: associatedRequestItemKeys.filter(associatedRequestItemKey => associatedRequestItemKey !== k),
    });
  }

  resetState = () => {
    this.setState({
      isProductSelectVisible: false,
      isAddProductButtonDisabled: false,
      isAssociatedItemsSectionVisible: false,
      selectedDepartment: {},
    });
  }

  selectedDepartmentHandler = (value) => {
    const { dispatch, encounter, form } = this.props;
    const { setFieldsValue } = form;

    if (value) {
      setFieldsValue({ destinationDepartment: value });
      this.setState({ isProductSelectVisible: true, selectedDepartment: value });
      dispatch({
        type: 'catalogue_prices/query',
        payload: {
          billingDepartment: value.publicId,
          priceList: encounter.defaultPaymentWallet.walletType.priceList.id,
          productType: ['PACKAGE', 'SERVICE'],
          activated: true,
          size: 1000,
        },
      });
    } else { this.resetState(); }
  }

  selectedPriceListItemHandler = (value, key) => {
    const { encounter, form } = this.props;
    const { selectedDepartment } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    if (value) {
      const destinationDepartmentFormItem = `items[${key}].requestItem.destinationDepartment`;
      const productFormItem = `items[${key}].requestItem.priceListItem`;
      const priceFormItem = `items[${key}].requestItem.price`;
      const totalFormItem = `items[${key}].requestItem.total`;

      getFieldDecorator(destinationDepartmentFormItem, { initialValue: this.validateProductGroupDepartmentAndDestinationDepartment(value.product.group.departments) });
      getFieldDecorator(productFormItem, { initialValue: value });
      getFieldDecorator(priceFormItem, { initialValue: value.sellingPrice });
      getFieldDecorator(totalFormItem, { initialValue: value.sellingPrice * 1 });

      form.setFieldsValue({
        items: getFieldValue('items'),
      });

      this.setState({ isAddProductButtonDisabled: true });

      // let associatedRequestProducts = pricesQuery({
      //   billingDepartment: getFieldValue('destinationDepartment').publicId,
      //   parentProduct: value.product.id,
      //   priceList: encounter.defaultPaymentWallet.walletType.priceList.id,
      //   visitType: encounter.visitType.id,
      //   activated: true,
      //   size: 1000,
      // });
      //
      // associatedRequestProducts
      //   .then((response) => {
      //     if (response.content.length > 0) {
      //       this.addAssociatedRequestItems(value, key, response.content);
      //
      //       if (!this.state.isAssociatedItemsSectionVisible) {
      //         this.setState({ isAssociatedItemsSectionVisible: true });
      //       }
      //     }
      //
      //     this.setState({ isAddProductButtonDisabled: false });
      //   });
    }
  }

  addAssociatedRequestItems = (parentPriceListItem, parentKey, associatedRequestItems) => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const parentItem = parentPriceListItem;

    associatedRequestItems.forEach((value, index) => {
      this.addAssociatedRequestItem();

      const parentRequestItemKey = `associatedRequestItems[${index}].requestItem.parentRequestItemKey`;
      const parentPriceListItem = `associatedRequestItems[${index}].requestItem.parentPriceListItem`;
      const destinationDepartmentFormItem = `associatedRequestItems[${index}].requestItem.destinationDepartment`;
      const associatedProductDepartment = `associatedRequestItems[${index}].departments`;
      const productFormItem = `associatedRequestItems[${index}].requestItem.priceListItem`;
      const priceFormItem = `associatedRequestItems[${index}].requestItem.price`;
      const totalFormItem = `associatedRequestItems[${index}].requestItem.total`;

      getFieldDecorator(parentRequestItemKey, { initialValue: parentKey });
      getFieldDecorator(parentPriceListItem, { initialValue: parentItem });
      getFieldDecorator(associatedProductDepartment, { initialValue: value.product.group.departments });
      //validate if associated Request has more than one group department.
      // if its more than one provide a list of departments to select from for the deparment
      if (value.product.group.departments && value.product.group.departments.length === 1) {
        getFieldDecorator(destinationDepartmentFormItem, { initialValue: value.product.group.departments[0] });
      }

      if (parentItem.product.productType === 'PACKAGE')
        value.sellingPrice = 0;

      getFieldDecorator(productFormItem, { initialValue: value });
      getFieldDecorator(priceFormItem, { initialValue: parentItem.product.productType === 'PACKAGE' ? 0 : value.sellingPrice });
      getFieldDecorator(totalFormItem, { initialValue: parentItem.product.productType === 'PACKAGE' ? 0 : value.sellingPrice * 1 });
    });

    form.setFieldsValue({
      associatedRequestItems: getFieldValue('associatedRequestItems'),
    });
  }

  render() {

    //console.log('OPTIMIZE ME PLEASE !!! I KEEP ON RERENDERING ON ADDASSOCIATEDREQUESTITEM !RRRR')

    const { form, catalogue_prices, encounter } = this.props;
    const { list, loading } = catalogue_prices;
    const { getFieldDecorator, getFieldValue } = form;

    const {
      isAddProductButtonDisabled,
      isAssociatedItemsSectionVisible,
      isProductSelectVisible,
      isNoPriceItemsFoundAlertVisible,
    } = this.state;

    const departmentSelectProps = {
      isBillingAllowed: true,
      multiSelect: false,
    };

    const renderParentPriceListItem = (parentPriceListItem) => {
      if (parentPriceListItem)
        return <Input disabled value={parentPriceListItem.product.productName} />;
      else {
        return <Input disabled />;
      }
    };

    const renderAssociatedPriceListItem = (associatedPriceListItem) => {
      if (associatedPriceListItem)
        return <Input disabled value={associatedPriceListItem.product.productName} />;
      else {
        return null;
      }
    };

    getFieldDecorator('itemKeys', { initialValue: [] });
    getFieldDecorator('associatedRequestItemKeys', { initialValue: [] });

    const itemKeys = getFieldValue('itemKeys');
    const associatedRequestItemKeys = getFieldValue('associatedRequestItemKeys');

    const itemEntryFormItems = itemKeys.map((itemKey, index) => {
      return (
        <Row gutter={2} key={itemKey} style={{ marginBottom: 5 }}>
          <Col span={7}>
            <FormItem required>
              {getFieldDecorator(`items[${itemKey}].requestItem.priceListItem`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  message: 'Product must be specified.',
                }],
              })(<PriceListItemSelect
                onPriceListItemSelect={value => this.selectedPriceListItemHandler(value, itemKey)} />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem required>
              {getFieldDecorator(`items[${itemKey}].requestItem.price`, {
                initialValue: 0,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  message: 'Product must have a defined selling price',
                }],
              })(<InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem required>
              {getFieldDecorator(`items[${itemKey}].requestItem.quantity`, {
                initialValue: 1,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  message: 'Quantity must be specified',
                }],
              })(<InputNumber
                style={{ width: '100%' }}
                min={1}
                onChange={value => this.quantityChangeHandler(value, itemKey)} />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem>
              {getFieldDecorator(`items[${itemKey}].requestItem.description`, {
                validateTrigger: ['onChange', 'onBlur'],
              })(<Input placeholder="Instructions" />)}
            </FormItem>
          </Col>
          <Col span={1}>
            {itemKeys.length > 1 ? (
              <Button type="dashed" shape="circle" icon="minus" disabled={itemKeys.length === 1} onClick={() => this.removeRequestItem(itemKey)} />
            ) : null}
          </Col>
        </Row>
      );
    });

    const associatedRequestItemEntryFormItems = associatedRequestItemKeys.map((associatedRequestItemKey, index) => {
      const departments = getFieldValue(`associatedRequestItems[${associatedRequestItemKey}].departments`);
      return (
        <Row gutter={2} key={associatedRequestItemKey} style={{ marginBottom: 5 }}>
          <Col span={5}>
            <FormItem>
              {renderAssociatedPriceListItem(getFieldValue(`associatedRequestItems[${associatedRequestItemKey}].requestItem.priceListItem`))}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {renderParentPriceListItem(getFieldValue(`associatedRequestItems[${associatedRequestItemKey}].requestItem.parentPriceListItem`))}
            </FormItem>
          </Col>
          <Col span={4}>
            {departments && (
              <FormItem required>
                {getFieldDecorator(`associatedRequestItems[${associatedRequestItemKey}].requestItem.destinationDepartment`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: getFieldValue(`associatedRequestItems[${associatedRequestItemKey}].requestItem.destinationDepartment`),
                  rules: [{
                    required: true,
                    message: 'Department is required',
                  }],
                })(
                  <Select>
                    {departments && departments.map((department) => {
                      return <Select.Option value={department}>{department.name}</Select.Option>
                    })}
                  </Select>
                )}
              </FormItem>
            )}
          </Col>
          <Col span={3}>
            <FormItem required>
              {getFieldDecorator(`associatedRequestItems[${associatedRequestItemKey}].requestItem.price`, {
                initialValue: 0,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  message: 'Product must have a defined selling price',
                }],
              })(<InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem required>
              {getFieldDecorator(`associatedRequestItems[${associatedRequestItemKey}].requestItem.quantity`, {
                initialValue: 1,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  message: 'Quantity must be specified',
                }],
              })(<InputNumber
                style={{ width: '100%' }}
                min={1}
                onChange={value => this.quantityChangeHandler(value, associatedRequestItemKey)} />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator(`associatedRequestItems[${associatedRequestItemKey}].requestItem.description`, {
                validateTrigger: ['onChange', 'onBlur'],
              })(<Input placeholder="Instructions" />)}
            </FormItem>
          </Col>
          <Col span={1}>
            <Button type="dashed" shape="circle" icon="minus" onClick={() => this.removeAssociatedRequestItem(associatedRequestItemKey)} />
          </Col>
        </Row>
      );
    });

    return (
      <LocaleProvider locale={enUS}>
        {encounter.defaultPaymentWallet.walletType.priceList
          ? (
            <Form layout="horizontal" onSubmit={this.handleOk}>
              <Alert
                message="Create and send a request to a department with items."
                type="info"
                showIcon
              />
              <FormItem label="Department" hasFeedback>
                {getFieldDecorator('destinationDepartment', {
                  rules: [
                    {
                      required: true,
                      message: 'Department must be specified',
                    },
                  ],
                })(<DepartmentSelect
                  {...departmentSelectProps}
                  onDepartmentSelect={this.selectedDepartmentHandler} />)}
              </FormItem>

              <fieldset>
                <legend>Request Items</legend>
                {!isProductSelectVisible
                  ? (
                    <div style={{ height: 100, textAlign: 'center' }}>
                      <h3>Please select department</h3>
                      <div style={{ marginTop: 10 }}>
                        <FormItem>
                          <Button
                            type="primary"
                            icon="close"
                            onClick={this.handleCancel}
                            style={{ marginRight: 10 }}
                          >Cancel</Button>
                        </FormItem>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {isNoPriceItemsFoundAlertVisible && (
                        <Alert message="Warning"
                          description="Ooops! No departmental products defined."
                          type="warning" showIcon />
                      )}

                      {loading && (
                        <CustomLoader />
                      )}

                      {!loading && list.length > 0 && (
                        <div>
                          <Row gutter={2}>
                            <Col span={7}>Product</Col>
                            <Col span={3}>Price</Col>
                            <Col span={3}>Qty</Col>
                            <Col span={10}>Instructions</Col>
                            <Col span={1} />
                          </Row>
                          <hr />
                          {itemEntryFormItems}
                          <FormItem {...formItemLayout}>
                            <Button type="dashed" onClick={this.addRequestItem} style={{ width: '30%' }} disabled={isAddProductButtonDisabled}>
                              <Icon type="plus" /> Add Product
                            </Button>
                          </FormItem>
                          <br />

                          {isAssociatedItemsSectionVisible && (
                            <fieldset>
                              <legend>Associated Requests</legend>
                              <Row gutter={2}>
                                <Col span={5}>Associated Product</Col>
                                <Col span={4}>Product</Col>
                                <Col span={4}>Department</Col>
                                <Col span={3}>Price</Col>
                                <Col span={3}>Qty</Col>
                                <Col span={4}>Instructions</Col>
                                <Col span={1} />
                              </Row>
                              <hr />
                              {associatedRequestItemEntryFormItems}
                            </fieldset>
                          )}

                          <FormItem label="Comment / Instructions" hasFeedback>
                            {getFieldDecorator('description', {})(<TextArea rows={3} />)}
                          </FormItem>
                          <div style={{ marginTop: 10 }}>
                            <FormItem>
                              <Button
                                type="danger"
                                icon="close"
                                onClick={this.handleCancel}
                                style={{ marginRight: 10 }}
                              >Cancel</Button>
                              <Button
                                type="primary"
                                icon="save"
                                onClick={this.handleSubmitAndClose}
                                style={{ marginRight: 10 }}
                              >Create Request</Button>
                              <Button
                                type="primary"
                                icon="save"
                                onClick={this.handleSubmitAndNew}
                              >Create and New Request</Button>
                            </FormItem>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </fieldset>
            </Form>
          ) : (
            <Alert
              message="Error"
              description={`Sorry. No price list has been tagged to the Patient wallet "${encounter.defaultPaymentWallet.walletType.name}"`}
              type="error"
              showIcon
            />
          )}
      </LocaleProvider>
    );
  }
}

export default RequestForm;
