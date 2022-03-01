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
import RequestItemsTableForm from './RequestItemsTableForm';

const allowFuture = true;
const allowPast = false;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

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
    isProductSelectVisible: false,
    isNoPriceItemsFoundAlertVisible: false,
    selectedDepartment: {},
  };

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

      if (data.requestItems != undefined) {
        data.requestItems.forEach((item) => {
          allRequestItems.push({
            requestItem: item,
          });

          if (item.associatedItems != undefined) {
            item.associatedItems.forEach((associatedItem) => {
              allRequestItems.push({
                requestItem: associatedItem,
              });
            });
          }
        });
      }

      // TODO validate requestItems here. if editable is true, if quantity, destinationDepartment are null

      map(
        uniq(
          map(allRequestItems, requestItemWrapper => JSON.stringify(requestItemWrapper.requestItem.destinationDepartment))
        ),
        destinationDepartment => {
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

  render() {

    //console.log('OPTIMIZE ME PLEASE !!! I KEEP ON RERENDERING ON ADDASSOCIATEDREQUESTITEM !RRRR')

    const { form, catalogue_prices, encounter } = this.props;
    const { list, loading } = catalogue_prices;
    const { getFieldDecorator, getFieldValue } = form;

    const {
      isProductSelectVisible,
      isNoPriceItemsFoundAlertVisible,
    } = this.state;

    const departmentSelectProps = {
      isBillingAllowed: true,
      multiSelect: false,
    };

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
                          <div>
                            {getFieldDecorator('requestItems', {
                              //initialValue: requisition.requestItems ? requisition.requestItems : [],
                            })(<RequestItemsTableForm
                                destinationDepartment={getFieldValue('destinationDepartment') ? getFieldValue('destinationDepartment') : null}
                                visitType={encounter.visitType}
                              />
                            )}
                          </div>

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
