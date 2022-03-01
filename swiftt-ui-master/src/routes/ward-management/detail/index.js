import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { filter } from 'lodash';
import moment from 'moment';
import { Row, Col, Card, Button, Icon, Tabs, Menu, Modal, Tag } from 'antd';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../utils/Authorized';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import AppointmentsView from '../../../components/common/appointments';
import BedOccupationsList from '../../../components/common/BedOccupationsList';
import DiagnosesView from '../../../components/common/diagnosis';
import FilesView from '../../../components/common/files';
import PatientVisitDetailsCard from '../../../components/common/encounters/PatientVisitDetailsCard';
import NotesView from '../../../components/common/notes';
import RequestItemsView from '../../../components/common/requestItems';
import DischargeProcessCard from '../../../components/common/encounters/DischargeProcessCard';
import DischargeSummaryView from '../../../components/encounters-management/encounter/details/discharge-summary';
// import PatientVisitHistory from '../../../components/common/encounters/patientEncounters';
import MedicationsView from '../../../components/common/medication';
import MedicalHistoryView from '../../../components/common/medical-history';
import RequestResults from '../../../components/common/results';
import AdmissionRequestProcessingModal from '../../../components/ward-management/waiting-list/AdmissionRequestProcessingModal';
import BedAssignmentModal from '../../../components/ward-management/admission/BedAssignmentModal';

import styles from './index.less';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

const { Description } = DescriptionList;
const confirm = Modal.confirm;
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

@connect(({ admission, loading }) => ({
  admission,
  loading: loading.effects['admission/query'],
}))
class AdmissionView extends PureComponent {

  static defaultProps = {
    admission: {},
  };

  static propTypes = {
    admission: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/admission/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'admission/query', payload: { id: match[1] } });
    }
  }

  assignBed = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'admission/showBedAssignmentModal',
      payload: {
        modalType: 'create',
      },
    });
  };

  cancelAdmissionRequest = () => {
    const { dispatch } = this.props;
    confirm({
      title: 'Are you sure you want to decline this request?',
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'admission/showDischargeModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    });
  }

  processAdmissionRequest = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'admission/showAdmissionRequestProcessingModal',
      payload: {
        modalType: 'create',
      },
    });
  };

  initiateDischargeClickHandler = () => {
    const { admission, dispatch } = this.props;
    const { data } = admission;

    confirm({
      title: 'Are you sure you want to initiate discharge?',
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        dispatch({ type: 'encounter/initiateDischarge', payload: { id: data.visit.id } });
        dispatch({ type: 'admission/purge' });
        dispatch({ type: 'admission/query', payload: { id: data.id } });
      },
    });
  }

  patientDischargeClickHandler = () => {
    const { admission, dispatch } = this.props;
    const { data } = admission;


    confirm({
      title: 'Are you sure you want to discharge this patient?',
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        dispatch(routerRedux.push(pathToRegexp.compile('/admission/discharge/:id')(data)));
      },
    });
  }

  finishDischargeClickHandler = () => {
    const { admission, dispatch } = this.props;
    const { data } = admission;

    dispatch({ type: 'encounter/discharge', payload: { id: data.visit.id } });
    dispatch({ type: 'admission/purge' });
    dispatch({ type: 'admission/query', payload: { id: data.id } });
  }

  render() {
    const { admission, dispatch } = this.props;
    const {
      loading,
      success,
      data,
      admissionRequestProcessingModalVisible,
      bedAssignmentModalVisible,
      dischargeModalVisible,
      modalType,
    } = admission;

    const admissionRequestProcessingModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: admissionRequestProcessingModalVisible,
      onOk(values) {
        dispatch({ type: 'admission/processRequest', payload: { ...values, id: data.id, actionType: 'PROCESS_REQUEST' } });
      },
      onCancel() {
        dispatch({ type: 'admission/hideAdmissionRequestProcessingModal' });
      },
    };

    const bedAssignmentModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: bedAssignmentModalVisible,
      onOk(values) {
        dispatch({ type: 'admission/assignBed', payload: { ...values, id: data.id, actionType: 'ASSIGN_BED' } });
      },
      onCancel() {
        dispatch({ type: 'admission/hideBedAssignmentModal' });
      },
    };

    const AdmissionRequestProcessingModalGen = () => <AdmissionRequestProcessingModal {...admissionRequestProcessingModalProps} />;
    const BedAssignmentModalGen = () => <BedAssignmentModal {...bedAssignmentModalProps} />;

    const renderAdmissionStatusTag = () => {
      switch (data.status) {
        case 'PENDING':
          return <Tag color="magenta">PENDING</Tag>;
        case 'ACTIVE':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CLOSED':
          return <Tag color="red">CLOSED</Tag>;
        case 'CANCELED':
          return <Tag color="purple">CANCELED</Tag>;
        default:
          return <Tag color="blue">{data.status}</Tag>;
      }
    };

    const action = (
      <div>
        {data.status === 'PENDING' && (
          <div>
            <Authorized authority="CREATE_ADMISSION">
              <Button
                icon="profile"
                onClick={this.processAdmissionRequest}
              >Process Request
              </Button>
            </Authorized>
            <Authorized authority="CREATE_ADMISSION">
              <Button
                icon="close"
                onClick={this.cancelAdmissionRequest}
              >Decline Request
              </Button>
            </Authorized>
          </div>
        )}
        {data.status === 'ACTIVE' && data.visit.dischargeProcessStage === null && (
          <div>
            <Authorized authority="INITIATE_VISIT_DISCHARGE">
              <Button
                icon="disconnect"
                onClick={this.initiateDischargeClickHandler}
              >Initiate Discharge
              </Button>
            </Authorized>
          </div>
        )}
        {data.status === 'ACTIVE' && data.visit.dischargeProcessStage !== null && data.visit.dischargeProcessStage === 'INITIATED' && (
          <div>
            <Authorized authority="DISCHARGE_PATIENT_FROM_ADMISSION">
              <Button
                icon="disconnect"
                onClick={this.patientDischargeClickHandler}
              >Process Discharge
              </Button>
            </Authorized>
          </div>
        )}
        {data.status === 'ACTIVE' && data.visit.dischargeProcessStage !== null && data.visit.dischargeProcessStage === 'PENDING_DISCHARGE' && (
          <div>
            <Authorized authority="DISCHARGE_PATIENT_FROM_ADMISSION">
              <Button
                icon="disconnect"
                onClick={this.finishDischargeClickHandler}
              >Finish Discharge
              </Button>
            </Authorized>
          </div>
        )}
      </div>
    );

    let description;
    if (data.id) {
      description = (
        <div>
          <DescriptionList col={2} gutter={0} size="small">
            <Description term="Admission No">{data.admissionNumber ? data.admissionNumber : 'Not Specified'}</Description>
            <Description term="Status">{renderAdmissionStatusTag()}</Description>
            <Description term="Requested By">{data.createdBy ? data.createdBy.fullName : 'Not Specified'}</Description>
            <Description term="Request Time">{moment(data.creationDate).format(dateTimeFormat)}</Description>
            <Description term="Admitting Doctor">{data.admittingDoctor ? data.admittingDoctor.fullName : 'Not Specified'}</Description>
            <Description term="Doctor In Charge">{data.doctorInCharge ? data.doctorInCharge.fullName : 'Not Specified'}</Description>
            <Description term="Reason">{data.admissionReason ? data.admissionReason : 'None'}</Description>
            <Description term="Comment">{data.admissionComment ? data.admissionComment : 'None'}</Description>
          </DescriptionList>
        </div>
      );
    }

    return (
      <PageHeaderLayout
        title={data.admissionNumber ? `Admission No: ${data.admissionNumber}` : 'Admission No: Not specified'}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        content={description}
      >
        <div className="content-inner">
          <Row>
            {loading && (
              <div>
                <Card loading title="Loading" />
                <Card loading style={{ marginTop: 10 }} />
              </div>
            )}

            {!loading && success && data && (
              <div>
                <PatientVisitDetailsCard encounter={data.visit} />

                {data.visit.dischargeProcessStage !== undefined && data.visit.dischargeProcessStage !== null && (
                  <DischargeProcessCard encounter={data.visit} />
                )}

                <Tabs type="card" tabPosition="left">
                  {data.status !== 'PENDING' && (
                    <TabPane tab="Beds" key="8">
                      <Row>
                        <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                          {data.bedOccupations.length > 0 ?
                            (
                              <Authorized authority="ASSIGN_ADMISSION_BED">
                                <Button type="primary" onClick={this.assignBed} icon="rollback">Reassign Bed</Button>
                              </Authorized>
                            ) : (
                              <Authorized authority="ASSIGN_ADMISSION_BED">
                                <Button type="primary" onClick={this.assignBed} icon="plus">Assign Bed</Button>
                              </Authorized>
                            )}
                        </Col>
                      </Row>
                      <BedOccupationsList bedOccupations={data.bedOccupations} />
                    </TabPane>
                  )}
                  <TabPane tab="Notes" key="3">
                    <NotesView visit={data.visit.id} contextType="ADMISSION" />
                  </TabPane>
                  <TabPane tab="Medical History" key="medicalHistory">
                    <MedicalHistoryView patientProfile={data.visit && data.visit.patient ? data.visit.patient : null} />
                  </TabPane>
                  <TabPane tab="Investigations" key="investigations">
                    <RequestItemsView encounter={data.visit} />
                  </TabPane>
                  <TabPane tab="Results" key="results">
                    <RequestResults
                      encounter={data.visit}
                    />
                  </TabPane>
                  {Authorized.check("READ_VISIT_DIAGNOSES", (
                    <TabPane tab="Diagnoses" key="7">
                      <Authorized authority="READ_VISIT_DIAGNOSES">
                        <DiagnosesView encounter={data.visit} />
                      </Authorized>
                    </TabPane>
                  ))}

                  <TabPane tab="Medications" key="Medications">
                    <MedicationsView
                      encounter={data.visit}
                    />
                  </TabPane>


                  {data.visit.dischargeProcessStage != null && data.visit.dischargeProcessStage !== 'INITIATED' && (
                    <TabPane tab="Discharge Summary" key="6">
                      <DischargeSummaryView encounter={data.visit} />
                    </TabPane>
                  )}

                  {/* {data.status !== 'PENDING' && ( */}
                  <TabPane tab="Appointments" key="2">
                    <AppointmentsView visitProfile={data.visit} />
                  </TabPane>
                  {/* )} */}

                  <TabPane tab="Attachments" key="4">
                    <FilesView context={data.id} contextType="ADMISSION" readOnly={false} />
                  </TabPane>
                </Tabs>

                <AdmissionRequestProcessingModalGen />
                <BedAssignmentModalGen />
              </div>
            )}
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default AdmissionView;
