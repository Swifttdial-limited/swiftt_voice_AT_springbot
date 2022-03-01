import React from 'react';
import { Card, Icon, Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BillingSetupDefinitionsView from '../../../components/billing-management/setup/definitions';
import BillingGroupsView from '../../../components/billing-management/setup/billing-groups';
import BillingRulesView from '../../../components/billing-management/setup/billing-rules';
import DepositDefinitionsView from '../../../components/billing-management/setup/deposit-definitions';
import WalletTypesView from '../../../components/billing-management/setup/wallet-types';

import styles from './index.less';

const TabPane = Tabs.TabPane;

function BillingSetup() {
  return (
    <div className="content-inner">
      <PageHeaderLayout
        title="Billing Setup"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <Tabs tabPosition="left" defaultActiveKey="depositDefinitions">
          {/* <TabPane tab={< span > Definitions </span>} key="definitions"> */}
          {/* <BillingSetupDefinitionsView /> */}
          {/* </TabPane> */}
          <TabPane tab={<span>Deposit Definitions</span>} key="depositDefinitions">
            <Card title="Deposit Definitions">
              <DepositDefinitionsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Wallet Types </span>} key="walletTypes">
            <Card title="Wallet Types">
              <WalletTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Billing Rules</span>} key="billingRules">
            <Card title="Billing Rules">
              <BillingRulesView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Billing Groups</span>} key="billingGroups">
            <Card title="Billing Groups">
              <BillingGroupsView />
            </Card>
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    </div>
  );
}

export default BillingSetup;
