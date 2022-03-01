import React from 'react';
import { Icon, Tabs, message, Row, Col, Card } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import LocationTypesView from '../../../components/system-administration/locations-types-and-locations/location-types';
import LocationsView from '../../../components/system-administration/locations-types-and-locations/locations';

import styles from './index.less';

const TabPane = Tabs.TabPane;

function DataImportationPageView() {
  return (
    <PageHeaderLayout
      title="Data Importation"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div>
        <Tabs tabPosition="left" defaultActiveKey="locationTypes">
          <TabPane tab={<span> Catalogue - Groups </span>} key="locationTypes">
            <LocationTypesView />
          </TabPane>
          <TabPane tab={<span> Catalogue - Formulations </span>} key="locations">
            <LocationsView />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default DataImportationPageView;
