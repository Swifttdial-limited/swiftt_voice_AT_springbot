import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { Icon, message, Row, Col, Alert, Card, Button, Collapse, Tabs, Divider, Tag } from 'antd';

import Authorized from '../../../utils/Authorized';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import DiagnosesView from '../../../components/common/diagnosis';
import MedicationsView from '../../../components/common/medication';
import RequestItemsView from '../../../components/common/requestItems';
import MedicalHistoryView from '../../../components/common/medical-history';
import AppointmentsView from '../../../components/common/appointments';
import NotesView from '../../../components/common/notes';
import FilesView from '../../../components/common/files';
import PatientDetailsCard from '../../../components/patients-management/patient/PatientDetailsCard';
import ImageViewer from '../../../components/common/ImageViewer';
import PatientVisitHistory from '../../../components/common/encounters/patientEncounters';
import RequestResults from '../../../components/common/results';

import styles from './index.less';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

const { Description } = DescriptionList;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

@connect(({ encounter, loading }) => ({
  encounter,
  loading: loading.effects['encounter/query'],
}))
class EncounterProfile extends PureComponent {



  constructor(props) {
    super(props);

    this.state = {
      expandPatientAndVisitDetails: false,
      previousVisit: {},
      isPreviousVisit: false,
    };
  }

  static defaultProps = {
    encounter: {},
  };


  static propTypes = {
    encounter: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;

    dispatch({ type: 'encounter/purge' });
    const match = pathToRegexp('/visit/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'encounter/query', payload: { id: match[1] } });
    }
  }

  closeVisitHandler = () => {
    const { dispatch, encounter } = this.props;
    const { data } = encounter;

    dispatch({
      type: 'encounter/closeVisit',
      payload: { id: data.id }
    });
  }

  openVisitHandler = () => {
    const { dispatch, encounter } = this.props;
    const { data } = encounter;

    dispatch({
      type: 'encounter/openVisit',
      payload: { id: data.id }
    });
  }

  handleActiveVisit = (newEncounter) => {
    const { encounter } = this.props;
    const { data } = encounter;
    this.setState((prevState) => ({
      previousVisit: encounter,
      isPreviousVisit: (data && data.id !== newEncounter.id),
    }));
  }

  render() {
    const { encounter } = this.props;
    const { loading, success, data } = encounter;
    const { previousVisit, isPreviousVisit, expandPatientAndVisitDetails } = this.state;

    const togglePatientAndDetails = () => {// toggle patient summary and detailed view
      this.setState((prevState) => ({ expandPatientAndVisitDetails: !prevState.expandPatientAndVisitDetails }));
    }
    const renderVisitStatusTag = () => {
      switch (data.status) {
        case 'NEW':
          return <Tag color="magenta">NEW</Tag>;
        case 'ACTIVE':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CLOSED':
          return <Tag color="red">CLOSED</Tag>;
        case 'AWAITING_CONFIRMATION':
          return <Tag color="purple">AWAITING CONFIRMATION</Tag>;
        case 'PENDING_ADMISSION':
          return <Tag color="purple">PENDING ADMISSION</Tag>;
        case 'PENDING_PAYMENT':
          return <Tag color="purple">PENDING PAYMENT</Tag>;
        case 'PENDING_BILL_PAYMENT':
          return <Tag color="purple">PENDING BILL PAYMENT</Tag>;
        case 'PENDING_DISCHARGE':
          return <Tag color="purple">PENDING DISCHARGE</Tag>;
        default:
          return <Tag color="blue">{data.status}</Tag>;
      }
    };

    const action = (
      <div>
        <Authorized authority="ARCHIVE_VISIT">
          <Button type="primary">Archive</Button>
        </Authorized>
        <Authorized authority="UPDATE_VISIT">
          {data.status === 'CLOSED' ? (<Button type="primary" icon="unlock" onClick={this.openVisitHandler}>Open Visit</Button>) : null}
          {(data.status === 'ACTIVE' || data.status === 'REACTIVATED') ? (<Button type="danger" icon="lock" onClick={this.closeVisitHandler}>Close Visit</Button>) : null}
        </Authorized>
      </div>
    );

    const UserProfile = (
      <div>
        <ImageViewer referenceType="USER_PHOTO" reference={data && data.patient ? data.patient.id : null} />
        <Button
          type="dashed"
          size="small"
          onClick={() => togglePatientAndDetails()}
          block>
          {expandPatientAndVisitDetails ? "Summary" : "More Info"}
        </Button>
      </div>
    );

    const patientProfile = (
      <PatientDetailsCard
        detailed={expandPatientAndVisitDetails}
        patient={data.patient}
        encounter={data}
      />
    );

    let description = <DescriptionList className={styles.headerList} size="small" col="2" />;
    if (data.id) {
      description = (
        <div>
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="Visit Type">{data.visitType.name}</Description>
            <Description term="Default Payment Wallet">{data.defaultPaymentWallet.walletType.name}</Description>
            <Description term="Visit Time">{moment(data.creationDate).format(dateTimeFormat)}</Description>
            <Description term="Discharge Time"></Description>
            <Description term="Booked By">{data.createdBy ? data.createdBy.username : 'Not Specified'}</Description>
            <Description term="Status">{renderVisitStatusTag()}</Description>
            <Description term="Description">{data.description ? data.description : 'None'}</Description>
          </DescriptionList>



        </div>
      );
    }

    return (
      <PageHeaderLayout
        title={data.visitNumber != null ? `Visit Number : ${data.visitType.prefix ? data.visitType.prefix + '-' + data.visitNumber : data.visitNumber}` : 'Not specified'}
        logo={data.id ? UserProfile : null}
        action={action}
        content={data.patient ? patientProfile : null}
      >
        <div className="content-inner">
          <Row>
            {loading && (
              <div>
                <Card loading title="Loading" />
                <br />
                <Card loading />
              </div>
            )}

            {!loading && data && success && (
              <div>
                <PatientVisitHistory
                  patient={data && data.patient ? data.patient : null}
                  handleHistoryVisit={(encounter) => this.handleActiveVisit(encounter)}
                />
                <Tabs defaultActiveKey="medicalHistory" type="card" tabPosition="left">
                  <TabPane tab="Medical History" key="medicalHistory">
                    <MedicalHistoryView patientProfile={data.patient} />
                  </TabPane>
                  <TabPane tab="Notes" key="notes">
                    <NotesView
                      visit={isPreviousVisit ? previousVisit.id : data.id}
                      isPreviousVisit={isPreviousVisit} contextType="VISIT" />
                  </TabPane>
                  <TabPane tab="Investigations" key="investigations">
                    <RequestItemsView
                      isPreviousVisit={isPreviousVisit}
                      encounter={data} />
                  </TabPane>
                  <TabPane tab="Results" key="results">
                    <RequestResults
                      encounter={isPreviousVisit ? previousVisit : data}
                      isPreviousVisit={isPreviousVisit}
                    />
                  </TabPane>
                  <TabPane tab="Diagnoses" key="diagnoses">
                    <DiagnosesView
                      encounter={isPreviousVisit ? previousVisit : data}
                      isPreviousVisit={isPreviousVisit}

                    />
                  </TabPane>
                  <TabPane tab="Medications" key="medications">
                    <MedicationsView
                      encounter={isPreviousVisit ? previousVisit : data}
                      isPreviousVisit={isPreviousVisit}
                    />
                  </TabPane>
                  <TabPane tab="Appointments" key="appointments">
                    <AppointmentsView patientProfile={data.patient} />
                  </TabPane>

                  <TabPane tab="Attachments" key="attachments">
                    <FilesView
                      isPreviousVisit={isPreviousVisit}
                      context={isPreviousVisit ? previousVisit.id : data.id}
                      contextType="VISIT" readOnly={false} />
                  </TabPane>
                  {data.visitType.requiresAdmission &&
                    (
                      <TabPane tab="Admission" key="admission">
                        <p>Admission view</p>
                      </TabPane>
                    )}
                </Tabs>
              </div>
            )}
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default EncounterProfile;
