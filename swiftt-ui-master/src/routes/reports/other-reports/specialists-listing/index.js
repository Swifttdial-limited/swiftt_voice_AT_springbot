import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider, Tag } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import UserGroupSelect from '../../../../components/common/UserGroupSelect';

import { querySpecialistsByUserGroup } from '../../../../services/userGroups';

class SpecialistssListingView extends PureComponent {
  state = {
    loading: false,
    specialists: [],
  };

  fetchData = (userGroup) => {
    this.setState({ loading: true });

    querySpecialistsByUserGroup({
      publicId: userGroup.publicId,
    }).then((response) => {
      this.setState({ loading: false, specialists: response.content });
    }).catch((error) => {
      this.setState({ loading: false, specialists: [] });
    });
  }

  userGroupSelectHandler = (value) => {
    if (value) { this.fetchData(value); } else { this.setState({ loading: false, specialists: [] }); }
  }

  render() {
    const { loading, specialists } = this.state;

    const columns = [
      {
        title: 'User',
        dataIndex: 'user.fullName',
        key: 'user.fullName',
      }, {
        title: 'Speciality',
        dataIndex: 'actor.name',
        key: 'actor.name',
      }, {
        title: 'Identification Type',
        dataIndex: 'identificationType.name',
        key: 'identificationType.name',
      }, {
        title: 'Identification',
        dataIndex: 'identification',
        key: 'identification',
      },
    ];

    return (
      <PageHeaderLayout
        title="Specialists Listing Report"
        content="This is a report that shows specialists by group."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={16} sm={24}>
              <UserGroupSelect onUserGroupSelect={this.userGroupSelectHandler} />
            </Col>
            <Col md={8} sm={24} style={{ textAlign: 'right' }}></Col>
          </Row>
          <Row>
            <Col xs={24} md={24} lg={24}>
              <LocaleProvider locale={enUS}>
                <Table
                  size="small"
                  bordered
                  columns={columns}
                  dataSource={specialists}
                  loading={loading}
                  simple
                  rowKey={record => record.id}
                />
              </LocaleProvider>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default SpecialistssListingView;
