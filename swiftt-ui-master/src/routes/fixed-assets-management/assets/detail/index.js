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

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import AssetBasicDetailsView from '../../../../components/fixed-assets-management/assets/asset/BasicDetails';
import DepreciationListView from '../../../../components/fixed-assets-management/assets/asset/DepreciationList';
import InsuranceListView from '../../../../components/fixed-assets-management/assets/asset/InsuranceList';
import WarrantyListView from '../../../../components/fixed-assets-management/assets/asset/WarrantyList';
import BarcodeCanvas from '../../../../components/common/BarcodeCanvas';
import DescriptionList from "../../../../components/DescriptionList";

import AddWarrantyModal from "../../../../components/fixed-assets-management/assets/asset/warranty/AddWarrantyModal";
import AddInsuranceModal from "../../../../components/fixed-assets-management/assets/asset/insurance/AddInsuranceModal";
import AddTransferModal from "../../../../components/fixed-assets-management/assets/asset/transfers/AddTransfersModal";
import AddMaintenanceModal from "../../../../components/fixed-assets-management/assets/asset/maintenance/AddMaintanceModal";
import AddDisposalModal from "../../../../components/fixed-assets-management/assets/asset/disposal/AddDisposalModal";

import moment from "moment";
import * as routerRedux from "react-router-redux";

const { confirm } = Modal;
const ButtonGroup = Button.Group;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const { Description } = DescriptionList;

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ fixed_asset, loading }) => ({
  asset: fixed_asset,
  loading: loading.effects['fixed_asset/query'],
}))

class AssetPageView extends PureComponent {

  static propTypes = {
    fixed_asset: PropTypes.object,
  }

  handleAssetUpdate = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fixed_asset/update',
      payload: Object.assign({}, this.props.asset.data, values),
    });
  }

  assetActivateHandler = () => {
    const { dispatch, asset } = this.props;
    const { data } = asset;
    confirm({
      title: 'Activate this item?',
      content: <p>Asset: {data.assetName} ({data.assetCode})</p>,
      okText: 'Activate',
      onOk() {
        dispatch({
          type: 'fixed_asset/activateItem',
          payload: { id: data.id },
        });
      },
    });
  }

  assetApproveHandler = () => {
    const { dispatch, asset } = this.props;
    const { data } = asset;
    confirm({
      title: 'Approve this item?',
      content: <p>Asset: {data.assetName} ({data.assetCode})</p>,
      okText: 'Approve',
      onOk() {
        dispatch({
          type: 'fixed_asset/approveItem',
          payload: { id: data.id },
        });
      },
    });
  }

  assetDeactivateHandler = () => {
    const { dispatch, asset } = this.props;
    const { data } = asset ;

    confirm({
      title: 'Deactivate this item?',
      content: <p>Asset: {data.assetName} ({data.assetCode})</p>,
      okText: 'Deactivate',
      onOk() {
        dispatch({
          type: 'fixed_asset/deactivateItem',
          payload: { id: data.id },
        });
      },
    });
  }

  assetTransferHandler = () => {
    const { dispatch, asset } = this.props;
    dispatch({
      type: 'fixed_asset/showTransferModal',
      payload: {
        modalType: 'create',
      },
    });
  }

  assetDisposeHandler = () => {
    const { dispatch, asset } = this.props;
    dispatch({
      type: 'fixed_asset/showDisposalModal',
      payload: {
        modalType: 'create',
      },
    });
  }

  assetMaintenanceHandler = () => {
    const { dispatch, asset } = this.props;
    dispatch({
      type: 'fixed_asset/showMaintenanceModal',
      payload: {
        modalType: 'create',
      },
    });
  }

  render() {
    const { dispatch, asset } = this.props;
    const {
      loading,
      success,
      data,
      addInsuranceModalVisible,
      addWarrantyModalVisible,
      addMaintainanceModalVisible,
      addTransferModalVisible,
      addDisposalModalVisible,
      modalType,
    } = asset;

    const assetProfileProps = {
      data,
      loading,
      success,
      onAssetUpdate: this.handleAssetUpdate,

    onWarrantyAdd() {
      dispatch({
        type: 'fixed_asset/showWarrantyModal',
      });
    },
    onWarrantyRemove(code) {
      const existingWarranties = data.assetWarranties;
      remove(existingWarranties, (warranty) => {
        return warranty.id === code;
      });
      dispatch({
        type: 'fixed_asset/update',
        payload: Object.assign({}, data, { assetWarranties: existingWarranties }),
      });
    },
    onInsuranceAdd() {
      dispatch({
        type: 'fixed_asset/showInsuranceModal',
      });
    },
    onInsuranceRemove(code) {
      const existingInsurances = data.assetInsurances;
      remove(existingInsurances, (insurance) => {
        return insurance.id === code;
      });
      dispatch({
        type: 'fixed_asset/update',
        payload: Object.assign({}, data, { assetInsurances: existingInsurances }),
      });
    },
    // onMaintenanceAdd() {
    //     dispatch({
    //       type: 'fixed_asset/showMaintenanceModal',
    //       payload: {
    //         modalType: 'create',
    //       },
    //     });
    //   },
    // onTransferAdd() {
    //     dispatch({
    //       type: 'fixed_asset/showTransferModal',
    //       payload: {
    //         modalType: 'create',
    //       },
    //     });
    //   },
    // onDisposalAdd() {
    //     dispatch({
    //       type: 'fixed_asset/showDisposalModal',
    //       payload: {
    //         modalType: 'create',
    //       },
    //     });
    //   },
    };

    const warrantyModalProps = {
      visible: addWarrantyModalVisible,
      onOk(values) {
        let newWarranties = [];
        newWarranties = unionBy(data.assetWarranties, [values], 'asset.id');
        dispatch({
          type: 'fixed_asset/update',
          payload: Object.assign({}, data, { assetWarranties: newWarranties }),
        });
      },
      onCancel() {
        dispatch({ type: 'fixed_asset/hideWarrantyModal' });
      },
    };

    const insuranceModalProps = {
      visible: addInsuranceModalVisible,
      onOk(values) {
        let newInsurances = [];
        newInsurances = unionBy(data.assetInsurances, [values], 'asset.id');
        dispatch({
          type: 'fixed_asset/update',
          payload: Object.assign({}, data, { assetInsurances: newInsurances }),
        });

      },
      onCancel() {
        dispatch({ type: 'fixed_asset/hideInsuranceModal' });
      },
    };

    const maintenanceModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible : addMaintainanceModalVisible,
      onOk(values) {
        dispatch({ type: 'fixed_asset_maintenances/create', payload: { ...values, asset: data } }); //fixed_asset_maintenance
        dispatch({type: 'fixed_asset/hideMaintenanceModal'})
        dispatch(routerRedux.push('/fixed-assets-management/maintenance-listing'));
      },
      onCancel() {
        dispatch({type: 'fixed_asset/hideMaintenanceModal'})
      }
    }

    const disposeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible : addDisposalModalVisible,
      onOk(values) {
        dispatch({ type: 'fixed_asset_disposals/create', payload: { ...values, asset: data } });
        dispatch({type: 'fixed_asset/hideDisposalModal'})
        dispatch(routerRedux.push('/fixed-assets-management/disposal-listing'));
      },
      onCancel() {
        dispatch({type: 'fixed_asset/hideDisposalModal'})
      }
    }

    const transferModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible : addTransferModalVisible,
      onOk(values) {
        dispatch({ type: 'fixed_asset_transfers/create', payload: { ...values, asset: data } });
        dispatch({type: 'fixed_asset/hideTransferModal'})
        dispatch(routerRedux.push('/fixed-assets-management/transfer-listing'));
      },
      onCancel() {
        dispatch({type: 'fixed_asset/hideTransferModal'})
      }
    }

    const action = (
      <div>
        {data.locked ?
          <Button type="danger" icon="unlock" onClick={this.assetActivateHandler}>Activate Item</Button> :
          <Button type="danger" icon="lock" onClick={this.assetDeactivateHandler}>Deactivate Item</Button>
        }
        {data.approved ?
          null :
          <Button type="danger" icon="check" onClick={this.assetApproveHandler}>Approve Item</Button>
        }
        <Button type="danger" icon="issues-close" onClick={this.assetDisposeHandler}> Dispose Item</Button>
        <Button type="danger" icon="disconnect" onClick={this.assetMaintenanceHandler}> Add Maintenance</Button>
        <Button type="danger" icon="swap" onClick={this.assetTransferHandler}> Transfer Item </Button>
      </div>

    );

    let DeprDescription = <DescriptionList size="small" col="2" />;
    DeprDescription = (
      <DescriptionList size="small" col="2">
        <Description term="Depreciation Method">{data.depreciationCalcMethod ? data.depreciationCalcMethod : 'Not Specified'}</Description>
        <Description term="Purchase Price">{data.buyingPrice ? data.buyingPrice : 'Not Specified'}</Description>
        <Description term="Purchase Date">{data.purchaseDate ?  moment(data.purchaseDate).local().format(dateFormat) : 'Not Specified'}</Description>
        <Description term="Purchase From">{data.boughtFrom ? data.boughtFrom.name : 'Not Specified'}</Description>
        <Description term="Salvage Amount">{data.salvageAmount ? data.salvageAmount : 'Not Specified'}</Description>
        <Description term="Asset Life">{data.assetLife ? data.assetLife : 'Not Specified'}</Description>
      </DescriptionList>
    );

    let assetAccountsList = <DescriptionList size="small" col="2" />;
    assetAccountsList = (
      <DescriptionList size="small" col="2">
        <Description term="Bank Account">{data.bankAccount ? data.bankAccount.name : 'Not Specified'}</Description>
        <Description term="Asset Account">{data.assetAccount ? data.assetAccount.name : 'Not Specified'}</Description>
        <Description term="Depr. Expense Account">{data.depreciationExpenseAccount ? data.depreciationExpenseAccount.name : 'Not Specified'}</Description>
        <Description term="Acc. Depr Account">{data.accumulatedDepreciationAccount ? data.accumulatedDepreciationAccount.name : 'Not Specified'}</Description>
        <Description term="Revenue Account">{data.revenueAccount ? data.revenueAccount.name : 'Not Specified'}</Description>
        <Description term="loss Account">{data.lossAccount ? data.lossAccount.name : 'Not Specified'}</Description>
      </DescriptionList>
    );

    const WarrantyModalGen = () => <AddWarrantyModal {...warrantyModalProps} />;
    const InsuranceModalGen = () => <AddInsuranceModal {...insuranceModalProps} />;

    const TransferModalGen = () => <AddTransferModal {...transferModalProps} />;
    const MaintenanceModalGen = () => <AddMaintenanceModal {...maintenanceModalProps} />;
    const DisposalModalGen = () => <AddDisposalModal {...disposeModalProps} />;

    return (
      <PageHeaderLayout
        title={data.id ? `Asset: ${data.assetName}` + ` (${data.assetCode})` : 'Asset'}
        action={action}
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
                      description="This is a deactivated asset."
                      type="warning"
                      showIcon
                    />
                    }
                  </Row>
                  <Row gutter={24}>
                    <Col span={16}>
                      <AssetBasicDetailsView
                        onAssetUpdate={this.handleAssetUpdate}
                        asset={data}
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
                        <TabPane tab="Depreciation Table" key="1">
                          {DeprDescription}
                          <DepreciationListView {...assetProfileProps} loading={loading}  asset={data} />
                        </TabPane>
                        <TabPane tab="Insurance" key="2">
                          <InsuranceListView {...assetProfileProps} loading={loading}  asset={data} />
                        </TabPane>
                        <TabPane tab="Warranty" key="3">
                          <WarrantyListView {...assetProfileProps} loading={loading} asset={data} />
                        </TabPane>
                        <TabPane tab="Accounts" key="4">
                          {assetAccountsList}
                        </TabPane>
                      </Tabs>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </div>

        <WarrantyModalGen />
        <InsuranceModalGen  />

        <TransferModalGen/>
        <MaintenanceModalGen/>
        <DisposalModalGen/>

      </PageHeaderLayout>
    );
  }
}

export default AssetPageView;
