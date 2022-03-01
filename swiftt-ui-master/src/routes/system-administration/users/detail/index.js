import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Collapse,
  Tabs,
  Tag,
  Alert,
  Button,
  Modal
} from 'antd';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import RolesSelectGrid from '../../../../components/common/roles/RolesSelectGrid';
import Toolbar from '../../../../components/system-administration/users/user/Toolbar';
import UserSpecializationsView from '../../../../components/system-administration/users/user/specializations';
import ImageViewer from '../../../../components/common/ImageViewer';

import { queryRoles } from '../../../../services/users';

const { confirm } = Modal;
const { Description } = DescriptionList;
const { Panel } = Collapse;
const TabPane = Tabs.TabPane;

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/query']
}))
class UserView extends PureComponent {

  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.dispatch({ type: 'user/purge' });
  }

  handleRoleChange = (value) => {
    const { dispatch, user } = this.props;

    dispatch({
      type: 'user/addRole',
      payload: {
        userPublicId: user.data.publicId,
        ...value.role
      },
    });
  }

  handleRoleRemoval = (value) => {
    const { dispatch, user } = this.props;

    dispatch({
      type: 'user/removeRole',
      payload: {
        userPublicId: user.data.publicId,
        publicId: value.publicId,
      },
    });
  }

  deleteUserHandler = (publicId) => {
    const { dispatch } = this.props;
    confirm({
      title: 'Are you sure you want to delete this user?',
      onOk() {
        dispatch({
          type: 'users/delete',
          payload: {
            publicId: publicId,
          },
        });
      },
    });
  }

  resetUserPasswordHandler = (publicId) => {
    const { dispatch } = this.props;
    confirm({
      title: 'Are you sure you want to reset this user\'s password?',
      onOk() {
        dispatch({
          type: 'user/applyAction',
          payload: {
            publicId: publicId,
            userActionType: 'REQUEST_PASSWORD_RESET'
          },
        });
      },
    });
  }

  render() {
    const { user } = this.props;
    const { loading, data } = user;

    const toolbarProps = {
      defaultValue: `${data.username} (${data.fullName})`,
    };

    const action = (
      <div>
        <Authorized authority="UPDATE_USER">
          <Button icon="retweet" onClick={() => this.resetUserPasswordHandler(data.publicId)}>Reset User Password</Button>
        </Authorized>
        <Authorized authority="DELETE_USER">
          <Button icon="delete" onClick={() => this.deleteUserHandler(data.publicId)}>Delete User</Button>
        </Authorized>
      </div>
    );

    return (
      <PageHeaderLayout
        title="System User"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
        action={action}
      >
        <div>
          {/*<Toolbar {...toolbarProps} />*/}

          <Row gutter={24}>
            <Col span={20}>
              <Card loading={loading} title="Basic Details" style={{ marginBottom: 24 }}>
                <DescriptionList>
                  <Description term="Name">{data.fullName}</Description>
                  <Description term="Created Date">{data.createdDate}</Description>
                  <Description term="Status">{data.enabled ? 'Enabled' : 'Disabled'}</Description>
                  <Description term="Email Address">{data.emailAddress}</Description>
                  <Description term="Out of Office">{data.outOfOffice ? 'Yes' : 'No'}</Description>
                </DescriptionList>
              </Card>

              <Tabs type="card">
                <TabPane tab="Assigned Roles" key="1">
                  <RolesSelectGrid
                    size="medium"
                    roles={data.roles}
                    onRoleChange={this.handleRoleChange}
                    onRemoveRole={this.handleRoleRemoval} />
                </TabPane>
                <TabPane tab="Specializations" key="2">
                  <UserSpecializationsView userProfile={data.publicId} />
                </TabPane>
              </Tabs>
            </Col>
            <Col span={4}>
              <ImageViewer referenceType="USER_PHOTO" />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default UserView;
