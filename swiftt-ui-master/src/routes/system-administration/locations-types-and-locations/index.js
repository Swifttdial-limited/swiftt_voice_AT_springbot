import React from 'react';
import { Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import LocationTypesView from '../../../components/system-administration/locations-types-and-locations/location-types';
import LocationsView from '../../../components/system-administration/locations-types-and-locations/locations';

const TabPane = Tabs.TabPane;

function LocationTypesAndLocationsView() {
  return (
    <PageHeaderLayout
      title="Locations &amp; Location Types"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div>
        <Tabs tabPosition="left" defaultActiveKey="locationTypes">
          <TabPane tab={<span> Location Types </span>} key="locationTypes">
            <LocationTypesView />
          </TabPane>
          <TabPane tab={<span> Locations </span>} key="locations">
            <LocationsView />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default LocationTypesAndLocationsView;
