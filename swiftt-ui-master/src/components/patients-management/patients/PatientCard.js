import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import moment from 'moment';
import { Avatar, Card, Col, Icon, Row } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { random } from '../../../utils/theme';
import { getRandomInt } from '../../../utils/utils';
import DescriptionList from '../../DescriptionList';
import './PatientCard.less';

const { Description } = DescriptionList;

const dateFormat = 'YYYY-MM-DD';

function PatientCard({
  patient,
}) {
  return (
    <Link to={`/patient/view/${patient.id}`}>
      <Card
        hoverable
        title={patient.user.fullName}
      >
        <div style={{ width: '13%', display: 'block', float: 'left' }}>
          {patient.photoUrl ? <Avatar src={patient.photoUrl} /> : (
            <Avatar size="large" style={{ backgroundColor: random[getRandomInt(20)] }}>
              {patient.user.firstName.charAt(0) + patient.user.surname.charAt(0)}
            </Avatar>
          )}
        </div>
        <div>
          <DescriptionList size="small" col="0" >
            <Description term={patient.medicalRecordNumber ? 'MRNo' : 'OTCNo'}>{patient.medicalRecordNumber ? patient.medicalRecordNumber : patient.overTheCounterNumber}</Description>
            <Description term="Sex">{patient.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
            <Description term="Registration Date">{moment(patient.creationDate).format(dateFormat)}</Description>
            <Description term="Phone Number">{patient.user.phoneNumber ? patient.user.phoneNumber : 'Not specified'}</Description>
          </DescriptionList>
        </div>
      </Card>
    </Link>
  );
}

PatientCard.Prop;

export default PatientCard;
