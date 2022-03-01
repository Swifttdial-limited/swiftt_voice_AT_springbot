import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs, Card } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ActiveIngredientsView from '../../../components/catalogue-management/setup/activeIngredients';
import AdministrationRoutesView from '../../../components/catalogue-management/setup/administrationRoutes';
import BrandsView from '../../../components/catalogue-management/setup/brands';
import FormulationsView from '../../../components/catalogue-management/setup/formulations';
import GroupsView from '../../../components/catalogue-management/setup/groups';
import ManufacturersView from '../../../components/catalogue-management/setup/manufacturers';
import StrengthsView from '../../../components/catalogue-management/setup/strengths';
import UnitsOfMeasureView from '../../../components/catalogue-management/setup/units-of-measure';

const TabPane = Tabs.TabPane;

function CataloguePage() {
  return (
    <PageHeaderLayout
      title="Catalogue Setup"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="card-container">
        <Tabs tabPosition="left" defaultActiveKey="productGroups">
          <TabPane tab={<span>Groups </span>} key="productGroups">
            <Card title="Groups">
              <GroupsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Formulations </span>} key="formulations">
            <Card title="Formulations">
              <FormulationsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Strengths </span>} key="strengths">
            <Card title="Strengths">
              <StrengthsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Units of Measure </span>} key="unitsOfMeasure">
            <Card title="Units of Measure">
              <UnitsOfMeasureView location={location} />
            </Card>
          </TabPane>
          <TabPane tab={<span> Active Ingredients </span>} key="activeIngredients">
            <Card title="Active Ingredients">
              <ActiveIngredientsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Administration Routes </span>} key="administrationRoutes">
            <Card title="Administration Routes">
              <AdministrationRoutesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Manufacturers </span>} key="manufacturers">
            <Card title="Manufacturers">
              <ManufacturersView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Brands </span>} key="brands">
            <Card title="Brands">
              <BrandsView />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default CataloguePage;
