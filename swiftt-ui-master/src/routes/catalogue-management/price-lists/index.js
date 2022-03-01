import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PricesView from '../../../components/catalogue-management/catalogue/prices';
import PriceListsView from '../../../components/catalogue-management/catalogue/price-lists';

const TabPane = Tabs.TabPane;

function PriceListPage() {
  return (
    <PageHeaderLayout
      title="Price Lists &amp; Prices"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="content-inner">
        <Tabs type="card" defaultActiveKey="prices">
          <TabPane tab={<span > Prices </span>} key="prices">
            <PricesView />
          </TabPane>
          <TabPane tab={<span > Price Lists </span>} key="priceLists">
            <PriceListsView />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default PriceListPage;
