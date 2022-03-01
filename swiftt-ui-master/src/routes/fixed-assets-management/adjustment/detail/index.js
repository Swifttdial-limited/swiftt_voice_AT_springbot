import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Collapse,
  Tabs,
  Tag,
  Alert,
  Button,
  Modal
} from 'antd';

import Authorized from "../../../../utils/Authorized";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import DescriptionList from "../../../../components/DescriptionList";
//import RolesSelectGrid from "../../../../components/common/roles/RolesSelectGrid";
//import UserSpecializationsView from "../../../../components/system-administration/users/user/specializations";
import ImageViewer from "../../../../components/common/ImageViewer";

const { confirm } = Modal;
const { Description } = DescriptionList;
const { Panel } = Collapse;
const TabPane = Tabs.TabPane;

@connect(({ asset, loading }) => ({
  asset,
  loading: loading.effects['fixed_asset/query']
}))

class AssetView extends PureComponent {

  static propTypes = {
    asset: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.dispatch({ type: 'fixed_asset/purge' });
  }

  handleDepreciationMethodChange = (value) => {
    const { dispatch, asset } = this.props;

    dispatch({
      type: 'fixed-asset/depreciationMethod',
      payload: {
        assetPublicId: asset.data.publicId,
        ...value.depreciationMethod
      },
    });
  }

  // handleWarrantyDelete = (value) => {
  //   const { dispatch, asset } = this.props;
  //
  //   dispatch({
  //     type: 'fixed-asset/warrantyDelete',
  //     payload: {
  //       assetPublicId: asset.data.publicId,
  //       publicId: value.publicId,
  //     },
  //   });
  // }
  //
  // handleInsuranceDelete = (value) => {
  //   const { dispatch, asset } = this.props;
  //
  //   dispatch({
  //     type: 'fixed-asset/insuranceDelete',
  //     payload: {
  //       assetPublicId: asset.data.publicId,
  //       publicId: value.publicId,
  //     },
  //   });
  // }


  handleWarrantyDelete = (publicId) => {
    const { dispatch } = this.props;
    confirm({
      title: 'Are you sure you want to delete this Warranty?',
      onOk() {
        dispatch({
          type: 'handleWarrantyDelete',
          payload: {
            publicId: publicId,
          },
        });
      },
    });
  }

  handleInsuranceDelete = (publicId) => {
    const { dispatch } = this.props;
    confirm({
      title: 'Are you sure you want to delete this Warranty?',
      onOk() {
        dispatch({
          type: 'handleInsuranceDelete',
          payload: {
            publicId: publicId,
          },
        });
      },
    });
  }

  render() {
    const { asset } = this.props;
    const { loading, data } = asset;

    return (
      <PageHeaderLayout
        title="Manage Asset"
        content="Form pages are used to collect or verify information from fixed asset management. Basic forms are common to form scenes with fewer data items."
        action={action}
      >
        <div>

          <Row gutter={24}>
            <Col span={20}>
              <Card loading={loading} title="Basic Details" style={{ marginBottom: 24 }}>
                <DescriptionList>
                  <Description term="Name">{data.assetName}</Description>
                  <Description term="Created Date">{data.createdDate}</Description>
                  <Description term="Status">{data.enabled ? 'Enabled' : 'Disabled'}</Description>
                  <Description term="Email Address">{data.emailAddress}</Description>
                  <Description term="Out of Office">{data.outOfOffice ? 'Yes' : 'No'}</Description>
                </DescriptionList>
              </Card>

              <Tabs type="card">
                <TabPane tab="Depreciation Table" key="1">
                  <DepreciationGrid
                    size="medium"
                    roles={data.roles}
                    //onRoleChange={this.handleRoleChange}
                    //onRemoveRole={this.handleRoleRemoval}
                  />
                </TabPane>

                <TabPane tab="Insurance" key="2">
                  <AssetInsuranceView assetProfile={data.publicId} />
                </TabPane>

                <TabPane tab="Warranties" key="3">
                  <AssetWarrantyView assetProfile={data.publicId} />
                </TabPane>

                <TabPane tab="Maintenance" key="4">
                  <AssetMaintenanceView assetProfile={data.publicId} />
                </TabPane>

                <TabPane tab="Disposal" key="4">
                  <AssetDisposalView assetProfile={data.publicId} />
                </TabPane>

              </Tabs>
            </Col>
            <Col span={4}>
              <ImageViewer referenceType="USER_PHOTO" />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }

}

export default AssetView;

