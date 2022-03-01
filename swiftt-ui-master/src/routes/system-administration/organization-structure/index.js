import React from 'react';
import { Tabs, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import GeneralInformationView from '../../../components/system-administration/organization-structure/general-information';
import OrganogramView from '../../../components/system-administration/organization-structure/organogram';

const { TabPane } = Tabs;

function OrganizationStructure() {
  return (
    <PageHeaderLayout
      title="Organizational Structure"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <Tabs tabPosition="left" defaultActiveKey="generalInformation">
              <TabPane tab={<span> General Information </span>} key="generalInformation">
                <GeneralInformationView />
              </TabPane>
              <TabPane tab={<span> Organogram </span>} key="organogram">
                <OrganogramView />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </PageHeaderLayout>
  );
}

export default OrganizationStructure;
