import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Row, Col, Button, Tooltip, Table, LocaleProvider, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/DescriptionList';
import DetailedEncounterView from '../../../../components/common/encounters/DetailedEncounterView';
import PatientSelect from '../../../../components/common/PatientSelect';

const { Description } = DescriptionList;

const ageDateFormat = 'YYYY, M, DD';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ patient, encounters }) => ({
  patient,
  encounters,
}))
class PatientStatementView extends PureComponent {

  static propTypes = {
    encounters: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    patient: {},
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'encounters/purge',
    });
  }

  handlePatientSelectChange = (value) => {
    const { dispatch } = this.props;

    this.setState({ patient: value });

    if(value != undefined) {
      const payload = { patientId: value.id, size: 1000 };
      dispatch({ type: 'encounters/queryPatientEncounters', payload });
    }
  }

  renderDetailedPatientDetails() {
    const { patient } = this.state;

    return (
      <Card
        type="inner"
        title="Patient Details"
      >
        <DescriptionList size="small" style={{ marginBottom: 16 }}>
          <Description term="Name">{patient.user.title.name}. {patient.user.fullName}</Description>
          <Description term="Sex">{patient.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
          <Description term="Date of Birth">{moment(patient.user.dateOfBirth).format(dateFormat)} ({moment(moment(patient.user.dateOfBirth).format(ageDateFormat)).fromNow(true)} old)</Description>
          <Description term="Religion">{patient.user.religion ? patient.user.religion.name : 'Not specified'}</Description>
          <Description term="Phone Number">{patient.user.phoneNumber ? patient.user.phoneNumber : 'Not specified'}</Description>
          <Description term="Alt. Phone Number">{patient.user.alternativePhoneNumber ? patient.user.alternativePhoneNumber : 'Not specified'}</Description>
        </DescriptionList>
      </Card>
    );
  }

  render() {
    const { encounters, dispatch } = this.props;
    const {
      loading,
      list,
      pagination,
      success,
    } = encounters;

    const { patient } = this.state;

    return (
      <PageHeaderLayout
        title={ patient.id ? "Patient Statement - " + patient.user.fullName + " (" + patient.medicalRecordNumber + ") " : "Patient Statement" }
        content="This report shows patient invoices and its details."
      >
        <div className="content-inner">
          <Row style={{ marginBottom: 10 }}>
            <Col md={8} sm={24}>
              <PatientSelect onPatientSelect={this.handlePatientSelectChange} />
            </Col>
            <Col md={2} sm={24} offset={14} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="filter" onClick={this.fetchData} disabled={!patient.id}>Filter</Button>
            </Col>
          </Row>
          { patient.id &&
            <div>
              <Row>
                <Col>{this.renderDetailedPatientDetails()}</Col>
              </Row>
              <br/>
              <Row>
                <Col>
                  { loading
                    ? <Card loading />
                    : list.map((encounter) => <DetailedEncounterView
                      key={encounter.id}
                      encounter={encounter} />)
                  }
                </Col>
              </Row>
            </div>
          }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PatientStatementView;
