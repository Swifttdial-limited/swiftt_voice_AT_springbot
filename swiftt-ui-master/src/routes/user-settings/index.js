import React from 'react';
import { Tabs } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GeneralUserDetailsView from '../../components/user-settings/GeneralUserDetailsView';
import PasswordResetView from '../../components/user-settings/PasswordResetView';

const TabPane = Tabs.TabPane;

function UserSettingsView() {

  return(
    <PageHeaderLayout
      title="User settings"
      content="Form pages are used to collect or verify information from profiles. Basic forms are common to form scenes with fewer data items."
    >
      <Tabs tabPosition="left" defaultActiveKey="general">
        <TabPane tab={<span> General </span>} key="general">
          <GeneralUserDetailsView />
        </TabPane>
        <TabPane tab={<span> Change Passoword </span>} key="changePassword">
          <PasswordResetView />
        </TabPane>
      </Tabs>
    </PageHeaderLayout>
  );

}

export default UserSettingsView;
