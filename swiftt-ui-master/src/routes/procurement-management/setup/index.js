import React from 'react';
import { Icon, Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PurchaseItemsView from '../../../components/procurement-management/setup/purchase-items';

const TabPane = Tabs.TabPane;

function InventorySetupView() {
  return (
    <PageHeaderLayout
      title="Procurement setup"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="content-inner">
        <Tabs tabPosition="left" defaultActiveKey="purchaseItems" >
          {/*
            <TabPane tab={< span > Preferences < /span>} key="preferences">
              <p>Preferences</p>
            </TabPane>
          */}
          <TabPane tab={<span > Vendor Purchase Items </span>} key="purchaseItems">
            <PurchaseItemsView />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default InventorySetupView;
