import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Row, Col, Card, Divider, Tabs } from 'antd';

import DescriptionList from '../../DescriptionList';
import FilesView from '../../common/files';
import UserProfilePhotoAvatar from '../../common/ImageViewer';

const { Description } = DescriptionList;
const TabPane = Tabs.TabPane;

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

function PatientDetailsCard({ detailed, columns, patient }) {
  return (
    <Card
      type="inner"
      title="Patient Details"
    >
      { !detailed && (
        <DescriptionList size="small" style={{ marginBottom: 16 }}>
          <Description term="Name">{patient.user.title.name}. {patient.user.fullName}</Description>
          <Description term="Sex">{patient.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
          <Description term="Date of Birth">{moment(patient.user.dateOfBirth).format(dateFormat)} ({moment(moment(patient.user.dateOfBirth).format(ageDateFormat)).fromNow(true)} old)</Description>
        </DescriptionList>
      )}
      { detailed && (
        <Row>
          <Col span={columns ? 6 : 4}>
            <UserProfilePhotoAvatar reference={patient.user.id} referenceType={"USER_PHOTO"} />
          </Col>
          <Col span={columns ? 18 : 20}>
            <Tabs type="card">
              <TabPane tab="Patient Info" key="1">
                <DescriptionList col={columns ? columns : 3} size="small" style={{ marginBottom: 16 }}>
                  <Description term="Name">{patient.user.title.name}. {patient.user.fullName}</Description>
                  <Description term="Sex">{patient.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
                  <Description term="Date of Birth">{moment(patient.user.dateOfBirth).format(dateFormat)} ({moment(moment(patient.user.dateOfBirth).format(ageDateFormat)).fromNow(true)} old)</Description>
                  <Description term="Religion">{patient.user.religion ? patient.user.religion.name : 'Not specified'}</Description>
                  <Description term="Phone Number">{patient.user.phoneNumber ? patient.user.phoneNumber : 'Not specified'}</Description>
                  <Description term="Alt. Phone Number">{patient.user.alternativePhoneNumber ? patient.user.alternativePhoneNumber : 'Not specified'}</Description>
                </DescriptionList>
              </TabPane>
              <TabPane tab="Patient Files" key="2">
                <FilesView context={patient.id} contextType="PATIENT" />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      )}
    </Card>

  );
}

PatientDetailsCard.defaultProps = {
  detailed: false,
  patient: {},
};

PatientDetailsCard.propTypes = {
  detailed: PropTypes.bool,
  patient: PropTypes.object.isRequired,
};

export default PatientDetailsCard;
