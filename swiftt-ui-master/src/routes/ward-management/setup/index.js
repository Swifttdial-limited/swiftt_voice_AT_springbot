import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const TabPane = Tabs.TabPane;

function WardManagementSetup() {
  return (
    <div className="content-inner">
      <Tabs type="card" defaultActiveKey="specimens">
        <TabPane tab={<span > Specimens </span>} key="specimens">
          <p>Coming soon</p>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default WardManagementSetup;
