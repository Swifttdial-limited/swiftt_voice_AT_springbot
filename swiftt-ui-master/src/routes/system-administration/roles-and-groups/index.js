import React from 'react';
import { Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import GroupsView from '../../../components/system-administration/roles-and-groups/groups';
import RolesView from '../../../components/system-administration/roles-and-groups/roles';

const { TabPane } = Tabs;

function RolesAndGroups() {
  return (
    <PageHeaderLayout
      title="Roles &amp; User Groups"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div>
        <Tabs tabPosition="left" defaultActiveKey="groups">
          <TabPane tab="User Groups" key="groups">

            <GroupsView />

          </TabPane>
          <TabPane tab="Roles and Permissions" key="roles">

            <RolesView />

          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default RolesAndGroups;
