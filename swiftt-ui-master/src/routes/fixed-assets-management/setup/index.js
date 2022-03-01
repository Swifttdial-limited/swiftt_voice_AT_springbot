import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs, Card } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AssetCategoriesView from '../../../components/fixed-assets-management/setup/assetCategories';
import AssetMaintenanceCategoriesView from '../../../components/fixed-assets-management/setup/assetMaintenanceCategories';

const TabPane = Tabs.TabPane;

function AssetManagementSetupPage() {
  return (
    <PageHeaderLayout
      title="Fixed Asset Management Setup"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="card-container">
        <Tabs tabPosition="left" defaultActiveKey="1">
          <TabPane tab={<span>Asset Categories</span>} key="1">
            <Card title="Asset Categories">
              <AssetCategoriesView/>
            </Card>
          </TabPane>
          <TabPane tab={<span>Maintenance Categories</span>} key="2">
            <Card title="Maintenance Categories">
              <AssetMaintenanceCategoriesView/>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default AssetManagementSetupPage;
