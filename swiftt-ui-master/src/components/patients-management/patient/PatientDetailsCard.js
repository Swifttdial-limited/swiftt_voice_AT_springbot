import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Row, Col, Divider, Tag, Tabs } from 'antd';

import DescriptionList from '../../DescriptionList';
import FilesView from '../../common/files';


const { Description } = DescriptionList;
const TabPane = Tabs.TabPane;

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

function PatientDetailsCard({ detailed, columns, patient, bodyStyle, request, encounter }) {

  const renderRequestStatusTag = () => {
    switch (request.status) {
      case 'NEW':
        return <Tag color="purple">NEW</Tag>;
      case 'ACTIVE':
        return <Tag color="green">IN PROGRESS</Tag>;
      case 'CANCELLED':
        return <Tag color="red">CANCELLED</Tag>;
      case 'COMPLETED':
        return <Tag color="magenta">COMPLETED</Tag>;
      default:
        return <Tag color="blue">{data.status}</Tag>;
    }
  };

  return (
    <div>
      {!detailed && (
        <DescriptionList size="small" columns={4}>
          <Description term="Name">{patient.user.title.name}. {patient.user.fullName}</Description>
          <Description term="Sex">{patient.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
          <Description term="Date of Birth">{moment(patient.user.dateOfBirth).format(dateFormat)} ({moment(moment(patient.user.dateOfBirth).format(ageDateFormat)).fromNow(true)} old)</Description>
          <Description term="Phone No">{patient.user.phoneNumber ? patient.user.phoneNumber : 'Not specified'}</Description>
          <Description term="Alt. Phone No">{patient.user.alternativePhoneNumber ? patient.user.alternativePhoneNumber : 'Not specified'}</Description>
        </DescriptionList>
      )}
      {detailed && (
        <Row>
          <Tabs type="line" size="small">
            <TabPane tab="Patient Info" key="1">
              <DescriptionList col={columns ? columns : 3} size="small" >
                <Description term="Name">{patient.user.title.name}. {patient.user.fullName}</Description>
                <Description term="Sex">{patient.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
                <Description term="Date of Birth">{moment(patient.user.dateOfBirth).format(dateFormat)} ({moment(moment(patient.user.dateOfBirth).format(ageDateFormat)).fromNow(true)} old)</Description>
                <Description term="Religion">{patient.user.religion ? patient.user.religion.name : 'Not specified'}</Description>
              </DescriptionList>
              <Divider style={{ margin: '5px 0' }} />
              <DescriptionList size="small" style={{ marginBottom: 16 }}>
                <Description term="Visit Number">{encounter.visitNumber}</Description>
                <Description term="Visit Type">{encounter.visitType.name}</Description>
                <Description term="Visit Time">{moment(encounter.creationDate).format(dateTimeFormat)}</Description>
                <Description term="Triage Category">{encounter.triageCategory ? encounter.triageCategory.name : 'Not specified'}</Description>
                <Description term="Booked By">{encounter.createdBy ? encounter.createdBy.username : 'Not Specified'}</Description>
                <Description term="Status">{encounter.status ? encounter.status : 'Not Specified'}</Description>
              </DescriptionList>
            </TabPane>
            <TabPane tab="Patient Files" key="2">
              <FilesView context={patient.id} contextType="PATIENT" />
            </TabPane>
            {request && (
              <TabPane tab="Request Info">
                <DescriptionList col={columns ? columns : 3} size="small" >
                  <Description term="From">{request.sourceDepartment ? request.sourceDepartment.name : 'Not specified'}</Description>
                  <Description term="Requested By">{request.createdBy.fullName}</Description>
                  <Description term="Requested At">{moment(request.creationDate).format(dateFormat)}</Description>
                  <Description term="Assigned To">{request.assignedUser ? request.assignedUser.fullName : 'Not assigned'}</Description>
                  <Description term="Status">{renderRequestStatusTag()}</Description>
                  <Description term="Triage Category">{request.visit.triageCategory ? request.visit.triageCategory.name : 'Not Specified'}</Description>
                </DescriptionList>
              </TabPane>
            )}
          </Tabs>
        </Row>
      )}
    </div>

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
