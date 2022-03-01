import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Card, Icon, Divider } from 'antd';
import moment from 'moment';

import DescriptionList from '../../DescriptionList';
import PatientDetailsCard from '../../patients-management/patient/PatientDetailsCard';

const { Description } = DescriptionList;
const ageDateFormat = 'YYYY, M, DD';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class PatientVisitDetailsCard extends PureComponent {

  static defaultProps = {
    encounter: {},
    request: {},
  };

  static propTypes = {
    encounter: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired,
  };

  state = {};

  renderSummarizedDetails() {
    const { encounter, request, detailed } = this.props;
    const patientCardStyle = {
      padding: '5px'
    };
    return (
      // <Card
      //   type="inner"
      //   title={encounter.patient.medicalRecordNumber ?
      //     `Patient & Visit Details ${encounter.patient.medicalRecordNumber}` :
      //     `Patient & Visit Details ${encounter.patient.overTheCounterNumber}`}
      //   extra={
      //     <a onClick={this.toggleForm}>View more <Icon type="down" /></a>
      //   }
      //   bodyStyle={patientCardStyle}
      // >
      <PatientDetailsCard
        bodyStyle={patientCardStyle}
        columns={2}
        detailed={detailed}
        patient={encounter.patient}
        request={request} />
      // </Card>
    );
  }

  renderDetailedDetails() {
    const { encounter, detailed, request } = this.props;

    return (
      // <Card
      //   type="inner"
      //   title={encounter.patient.medicalRecordNumber ?
      //     `Patient & Visit Details ${encounter.patient.medicalRecordNumber}` :
      //     `Patient & Visit Details ${encounter.patient.overTheCounterNumber}`}
      //   extra={
      //     <a onClick={this.toggleForm}>View less <Icon type="up" /></a>
      //   }
      // >
      <div>
        <PatientDetailsCard
          columns={2}
          detailed={detailed}
          patient={encounter.patient}
          encounter={encounter}
          request={request} />
      </div>
      // </Card>
    );
  }

  renderPatientAndVisitDetails() {
    return this.props.detailed ? this.renderDetailedDetails() : this.renderSummarizedDetails();
  }

  render() {
    return (
      <div>
        {this.renderPatientAndVisitDetails()}
      </div>
    );
  }

}

export default PatientVisitDetailsCard;
