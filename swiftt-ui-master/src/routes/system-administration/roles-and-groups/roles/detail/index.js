import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { Card, Tabs } from 'antd';

import PageHeaderLayout from '../../../../../layouts/PageHeaderLayout';
import PrivilegesTransfer from '../../../../../components/system-administration/roles-and-groups/role/PrivilegesTransfer';
import Toolbar from '../../../../../components/system-administration/roles-and-groups/role/Toolbar';
import UsersTransfer from '../../../../../components/system-administration/roles-and-groups/role/UsersTransfer';

const { TabPane } = Tabs;

function RoleView({ role }) {
  const { loading, data } = role;

  const privilegeTransferProps = {
    rolePrivileges: data.privileges,
  };

  const toolbarProps = {
    defaultValue: data.name,
  };

  const userTransferProps = {
    roleUsers: data.systemUsers,
  };

  return (
    <PageHeaderLayout
      title="Role"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div>

        {/*{data.name && <Toolbar {...toolbarProps} />}*/}

        <Card loading={loading} >
          Name: {data.name}
          Description: {data.description ? data.description : 'Not specified'}
          User Group: {data.actor ? data.actor.name : 'Not specified'}
          Department: {data.department ? data.department.name : 'Not specified'}
        </Card>

        <Tabs type="card" defaultActiveKey="permissions">
          <TabPane tab={<span > Permissions </span>} key="permissions">
            <Card loading={loading}>
              <PrivilegesTransfer {...privilegeTransferProps} />
            </Card>
          </TabPane>
          <TabPane tab={<span > Users </span>} key="users">
            <Card loading={loading}>
              <UsersTransfer {...userTransferProps} />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>

  );
}

RoleView.propTypes = {
  role: PropTypes.object.isRequired,
};

function mapStateToProps({ role }) {
  return { role };
}

export default connect(mapStateToProps)(RoleView);
