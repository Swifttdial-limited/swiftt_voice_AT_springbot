import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Icon,
  message,
  Row,
  Col,
  Alert,
  Button,
  Dropdown,
  Menu,
  Card,
  Tabs,
  Collapse,
  Modal
} from 'antd';
import { remove, unionBy } from 'lodash';

import AssignableRolesModal from '../../../../components/catalogue-management/catalogue/product/related/assignable-roles/AssignableRolesModal';
import AssociatedProductsModal from '../../../../components/catalogue-management/catalogue/product/related/associated-products/AssociatedProductsModal';
import DiagnosesModal from '../../../../components/catalogue-management/catalogue/product/related/linked-diagnoses/DiagnosesModal';
import IncomeAccountsModal from '../../../../components/catalogue-management/catalogue/product/related/accounts-and-tax-codes/IncomeAccountsModal';

import AccountsAndTaxCodeView from '../../../../components/catalogue-management/catalogue/product/related/accounts-and-tax-codes';
import AssignableRolesView from '../../../../components/catalogue-management/catalogue/product/related/assignable-roles';
import AssociatedProductsView from '../../../../components/catalogue-management/catalogue/product/related/associated-products';
import CostHistoryEntriesView from '../../../../components/catalogue-management/catalogue/product/related/cost-history';
import InventoryBalanceView from '../../../../components/catalogue-management/catalogue/product/related/inventory-balance';
import LinkedDiagnosesView from '../../../../components/catalogue-management/catalogue/product/related/linked-diagnoses';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PricesView from '../../../../components/catalogue-management/catalogue/product/related/prices';
import ProductBasicDetailsView from '../../../../components/catalogue-management/catalogue/product/BasicDetails';

//import AssociatedProductsView from '../../../../components/catalogue-management/catalogue/product/related/associations/AssociatedProductsView';
import BarcodeCanvas from '../../../../components/common/BarcodeCanvas';

const { confirm } = Modal;
const ButtonGroup = Button.Group;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

@connect(({ catalogue_product, loading }) => ({
  product: catalogue_product,
  loading: loading.effects['catalogue_product/query'],
}))
class ProductPageView extends PureComponent {

  static propTypes = {
    catalogue_product: PropTypes.object,
  }

  handleProductUpdate = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalogue_product/update',
      payload: Object.assign({}, this.props.product.data, values),
    });
  }

  productActivateHandler = () => {
    const { dispatch, product } = this.props;
    const { data } = product;

    confirm({
      title: 'Activate this item?',
      content: <p>Product: {data.productName} ({data.productCode})</p>,
      okText: 'Activate',
      onOk() {
        dispatch({
          type: 'catalogue_product/activateItem',
          payload: { id: data.id },
        });
      },
    });
  }

  productDeactivateHandler = () => {
    const { dispatch, product } = this.props;
    const { data } = product;

    confirm({
      title: 'Deactivate this item?',
      content: <p>Product: {data.productName} ({data.productCode})</p>,
      okText: 'Deactivate',
      onOk() {
        dispatch({
          type: 'catalogue_product/deactivateItem',
          payload: { id: data.id },
        });
      },
    });
  }

  render() {
    const { dispatch, product } = this.props;
    const {
      loading,
      success,
      data,
      assignableRoleModalVisible,
      associatedProductModalVisible,
      diagnosesModalVisible,
      incomeAccountsModalVisible,
    } = product;

    const productProfileProps = {
      data,
      loading,
      success,
      onProductUpdate: this.handleProductUpdate,
      onAssignableRoleAdd() {
        dispatch({
          type: 'catalogue_product/showAssignableRolesModal',
        });
      },
      onAssignableRoleRemove(publicId) {
        const existingAssignableRoles = data.assignableRoles;
        remove(existingAssignableRoles, (role) => {
          return role.publicId === publicId;
        });

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { assignableRoles: existingAssignableRoles }),
        });
      },
      onAssociatedProductAdd() {
        dispatch({
          type: 'catalogue_product/showAssociatedProductsModal',
        });
      },
      onAssociatedProductRemove(id) {
        const existingAssociatedProducts = data.associatedProducts;
        remove(existingAssociatedProducts, (associatedProduct) => {
          return associatedProduct.product.id === id;
        });

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { associatedProducts: existingAssociatedProducts }),
        });
      },
      onDiagnosesAdd() {
        dispatch({
          type: 'catalogue_product/showDiagnosesModal',
        });
      },
      onDiagnosesRemove(code) {
        const existingDiagnoses = data.diagnoses;
        remove(existingDiagnoses, (diagnosis) => {
          return diagnosis.code === code;
        });

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { diagnoses: existingDiagnoses }),
        });
      },
      onIncomeAccountsAdd() {
        dispatch({
          type: 'catalogue_product/showIncomeAccountsModal',
        });
      },
      onIncomeAccountRemove(publicId) {
        const existingIncomeAccounts = data.incomeAccounts;
        remove(existingIncomeAccounts, (incomeAccount) => {
          return incomeAccount.publicId === publicId;
        });

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { incomeAccounts: existingIncomeAccounts }),
        });
      },
    };

    const assignableRolesModalProps = {
      visible: assignableRoleModalVisible,
      onOk(values) {
        let newAssignableRoles = [];
        newAssignableRoles = unionBy(data.assignableRoles, values.assignableRoles, 'publicId');

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { assignableRoles: newAssignableRoles }),
        });
      },
      onCancel() {
        dispatch({ type: 'catalogue_product/hideAssignableRolesModal' });
      },
    };

    const associatedProductsModalProps = {
      visible: associatedProductModalVisible,
      onOk(values) {
        let newAssociatedProducts = [];
        newAssociatedProducts = unionBy(data.associatedProducts, [values], 'product.id');
        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { associatedProducts: newAssociatedProducts }),
        });
      },
      onCancel() {
        dispatch({ type: 'catalogue_product/hideAssociatedProductModal' });
      },
    };

    const diagnosesModalProps = {
      visible: diagnosesModalVisible,
      onOk(values) {
        let newDiagnoses = [];
        newDiagnoses = unionBy(data.diagnoses, values.diagnoses, 'code');

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { diagnoses: newDiagnoses }),
        });
      },
      onCancel() {
        dispatch({ type: 'catalogue_product/hideDiagnosesModal' });
      },
    };

    const incomeAccountModalProps = {
      visible: incomeAccountsModalVisible,
      onOk(values) {
        let newIncomeAccounts = [];
        newIncomeAccounts = unionBy(data.incomeAccounts, values.incomeAccounts, 'publicId');

        dispatch({
          type: 'catalogue_product/update',
          payload: Object.assign({}, data, { incomeAccounts: newIncomeAccounts }),
        });
      },
      onCancel() {
        dispatch({ type: 'catalogue_product/hideIncomeAccountsModal' });
      },
    };

    const action = (
      <div>
        {data.locked ?
          <Button type="danger" icon="unlock" onClick={this.productActivateHandler}>Activate Item</Button> :
          <Button type="danger" icon="lock" onClick={this.productDeactivateHandler}>Deactivate Item</Button> }
      </div>
    );

    const AssignableRolesModalGen = () => <AssignableRolesModal {...assignableRolesModalProps} />;
    const AssociatedProductsModalGen = () => <AssociatedProductsModal {...associatedProductsModalProps} />;
    const DiagnosesModalGen = () => <DiagnosesModal {...diagnosesModalProps} />;
    const IncomeAccountsModalGen = () => <IncomeAccountsModal {...incomeAccountModalProps} />;

    return (
      <PageHeaderLayout
        title={data.id ? `Product: ${data.productName}` : 'Product'}
        action={action}
        //content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col xs={24} md={24} lg={24}>
              {loading && !success &&
                <Alert message="Loading data" type="info" showIcon />}

              {!loading && !success &&
                <Alert message="Error" description="This is an error message about copywriting." type="error" showIcon />}

              {!loading && success && data.id && (
              <div>
                <Row style={{ marginBottom: 10 }}>
                  { data.locked &&
                    <Alert
                      message="Warning"
                      description="This is a deactivated product."
                      type="warning"
                      showIcon
                    />
                  }
                </Row>
                <Row gutter={24}>
                  <Col span={16}>
                    <ProductBasicDetailsView
                      onProductUpdate={this.handleProductUpdate}
                      product={data}
                    />
                  </Col>
                  <Col span={8}>
                    <Card title="Barcodes">
                      {data.barcode ? <BarcodeCanvas validate={false} characters={data.barcode} /> : <p>No bar code</p>}
                      <hr />
                      {data.alternativeBarCode ? <BarcodeCanvas validate={false} characters={data.alternativeBarCode} /> : <p>No alternative bar code</p>}
                    </Card>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col>
                    <Tabs defaultActiveKey="1" type="card">
                      <TabPane tab="Associated Products" key="1">
                        <AssociatedProductsView
                          {...productProfileProps}
                          loading={loading}
                          product={data}
                        />
                      </TabPane>
                      <TabPane tab="Linked Diagnoses" key="4">
                        <LinkedDiagnosesView
                          {...productProfileProps}
                          loading={loading}
                          product={data}
                        />
                      </TabPane>
                      <TabPane tab="Accounts and Tax" key="2">
                        <AccountsAndTaxCodeView
                          {...productProfileProps}
                          product={data}
                        />
                      </TabPane>
                      <TabPane tab="Assignable Roles" key="3">
                        <AssignableRolesView
                          {...productProfileProps}
                          loading={loading}
                          product={data}
                        />
                      </TabPane>
                      <TabPane tab="Cost History" key="5">
                        <CostHistoryEntriesView product={data} />
                      </TabPane>
                      <TabPane tab="Inventory Balance" key="6">
                        <InventoryBalanceView product={data} />
                      </TabPane>
                      {/*
                        <TabPane tab="Prices" key="4">
                          <p>Prices</p>
                        </TabPane>
                        <TabPane tab="Product Deposits" key="5">
                          <p>Prices</p>
                        </TabPane>
                        <TabPane tab="Purchase Items" key="4">
                          <PricesView product={data} />
                        </TabPane>
                        */}
                    </Tabs>
                  </Col>
                </Row>
              </div>
            )}
            </Col>
          </Row>
        </div>

        <AssignableRolesModalGen />
        <AssociatedProductsModalGen />
        <DiagnosesModalGen />
        <IncomeAccountsModalGen />

      </PageHeaderLayout>
    );
  }
}

export default ProductPageView;
