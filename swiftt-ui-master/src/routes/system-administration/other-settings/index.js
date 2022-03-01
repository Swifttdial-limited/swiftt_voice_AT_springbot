import React from 'react';
import { Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import IdentificationTypesView from '../../../components/system-administration/other-settings/identification-types';
import RegionsView from '../../../components/system-administration/other-settings/regions';
import ReligionsView from '../../../components/system-administration/other-settings/religions';
import TitlesView from '../../../components/system-administration/other-settings/titles';

const { TabPane } = Tabs;

function OtherSettings() {
  return (
    <PageHeaderLayout
      title="Other definitions"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div>
        <Tabs tabPosition="left" defaultActiveKey="identificationTypes">
          <TabPane
            tab={<span> Identification Types </span>}
            key="identificationTypes"
          >
            <IdentificationTypesView />
          </TabPane>
          <TabPane tab={<span> Regions </span>} key="regions">
            <RegionsView />
          </TabPane>
          <TabPane tab={<span> Religions </span>} key="religions">
            <ReligionsView />
          </TabPane>
          <TabPane tab={<span> Titles </span>} key="titles">
            <TitlesView />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default OtherSettings;
