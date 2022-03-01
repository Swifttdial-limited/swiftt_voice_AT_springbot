import React from 'react';
import { Icon, Tabs, Card } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BinLocationsView from '../../../components/inventory-management/setup/bin-locations';
import GoodsReturnReasonsView from '../../../components/inventory-management/setup/goods-return-reasons';
import InventoryAdjustmentReasonsView from '../../../components/inventory-management/setup/inventory-adjustment-reasons';
import InventoryPreferencesView from '../../../components/inventory-management/setup/preferences';
import ReorderLevelsView from '../../../components/inventory-management/setup/reorder-levels';

const TabPane = Tabs.TabPane;

function InventorySetupView() {
  return (
    <PageHeaderLayout
      title="Inventory setup"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="content-inner">
        <Tabs tabPosition="left" defaultActiveKey="preferences" >
          <TabPane tab={<span> Preferences </span>} key="preferences">
            <Card title="Preferences">
              <InventoryPreferencesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Bin Locations </span>} key="binLocations">
            <Card title="Bin Locations">
              <BinLocationsView />
            </Card>
          </TabPane>
          <TabPane tab={<span > Goods Return Reasons </span>} key="goodsReturnReasons">
            <Card title="Goods Return Reasons">
              <GoodsReturnReasonsView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Inventory Adjustment Reasons</span>} key="inventoryAdjustmentReasons">
            <Card title="Inventory Adjustment Reasons">
              <InventoryAdjustmentReasonsView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Reorder Levels</span>} key="reorderLevels">
            <Card title="Item Reorder Levels">
              <ReorderLevelsView />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default InventorySetupView;
