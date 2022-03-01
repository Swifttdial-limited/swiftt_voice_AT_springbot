import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { Row, Col, Alert, Card, Button, Modal, Tabs } from 'antd';

import Authorized from '../../../utils/Authorized';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AppointmentsView from '../../../components/common/appointments';
import DiagnosesView from '../../../components/common/diagnosis';
import FilesView from '../../../components/common/files';
import MedicalHistoryView from '../../../components/common/medical-history';
import MedicationView from '../../../components/common/medication';
import NotesView from '../../../components/common/notes';
import PatientVisitDetailsCard from '../../../components/common/encounters/PatientVisitDetailsCard';
import ServiceRequestItemsView from '../../../components/common/requestItems';
import DepositRequestModal from '../../../components/common/deposit-requests/Modal';
import TriageCategoryModal from '../../../components/common/triageCategory/Modal';
import RequestDetail from '../../../components/workspace/request/Detail';
import RequestResults from '../../../components/common/results';
import PatientVisitHistory from '../../../components/common/encounters/patientEncounters';
import ImageViewer from '../../../components/common/ImageViewer';
import SuppliesRequestForm from '../../../components/common/requests/supply'

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
/**
 * NEW - status is assumed when a new request item is created
 * POSTED - status is assumed when a request item is awaiting its corresponding BillItem to be paid
 * ACTIVE - status is assumed when a request item has been paid for i.e Cash Prepay
 *  or after posting to bill for Cash Postpay and Credit. Results should only be entered
 * for a request item with status ACTIVE
 * COMPLETED - status is assumed when no further action can be done on a request
 * item i.e Results have been entered,
 *      stock item has been dispensed, non-stock item has been issued or service with not template
 * CANCELLED - status is assumed when a request item is cancelled at the NEW stage or
 *  when BillItem is cancelled
 *
 * End states of a requestItem have to be either cancelled or completed
 */
@connect(({ encounter, depositRequests, request, loading }) => ({
  depositRequests,
  triageCategoryVisible: encounter.triageCategoryVisible,
  request,
  loading: loading.effects['request/query'],
}))
class RequestDetailView extends PureComponent {

  static defaultProps = {
    triageCategoryVisible: false,
    request: {},
  };

  static propTypes = {
    triageCategoryVisible: PropTypes.bool,
    request: PropTypes.object,
  };

  state = {
    expandPatientAndVisitDetails: false,
    previousVisit: {},
    isPreviousVisit: false,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/workspace/request/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'request/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'request/purge' });
  }

  handleClaimRequest = () => {
    const { dispatch, request } = this.props;

    confirm({
      title: 'Claim this request?',
      onOk() {
        dispatch({
          type: 'request/claim',
          payload: { id: request.data.id },
        });
      },
    });
  }

  markRequestAsCompletedHandler = () => {
    const { dispatch, request } = this.props;

    confirm({
      title: 'Mark this request as Completed?',
      onOk() {
        dispatch({
          type: 'request/markAsCompleted',
          payload: { id: request.data.id },
        });
      },
    });
  }

  showDepositRequestModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'depositRequests/showModal',
      payload: {
        modalType: 'create',
      },
    });
  }

  showTriageCategoryModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'encounter/showTriageCategoryAssignmentModal',
      payload: {
        modalType: 'create',
      },
    });
  }

  checkPermissionItem = (authority, ItemDom) => {
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(
        authority,
        ItemDom
      );
    }
    return ItemDom;
  }

  renderTabs = (items) => {
    const { request } = this.props;
    const { data } = request;
    return items.map((item) => {
      if (this.checkPermissionItem(item.authority, item.content)) {
        return (
          <TabPane tab={item.title} key={item.key}>
            {item.content}
          </TabPane>
        );
      }
    });
  }

  renderPatientAndVisitDetails() {
    return this.state.expandPatientAndVisitDetails ? this.renderDetailedPatientAndVisitDetails() : this.renderSummarizedPatientAndVisitDetails();
  }

  handleActiveVisit = (encounter) => {
    const { request } = this.props;
    const { data } = request;
    this.setState((prevState) => ({
      previousVisit: encounter,
      isPreviousVisit: (data && data.visit && data.visit.id !== encounter.id),
    }));
  }


  render() {
    const { depositRequests, dispatch, triageCategoryVisible, request } = this.props;
    const { modalVisible } = depositRequests;
    const { loading, success, data } = request;

    const { previousVisit, isPreviousVisit, expandPatientAndVisitDetails } = this.state;

    const depositRequestModalProps = {
      item: {},
      type: 'create',
      visible: modalVisible,
      onOk(formData) {
        let payload = formData;

        payload.addressTo = {
          id: data.visit.patient.id,
          name: data.visit.patient.user.fullName,
          code: data.visit.patient.medicalRecordNumber
        };

        dispatch({
          type: 'depositRequests/create',
          payload: payload,
        });
      },
      onCancel() {
        dispatch({ type: 'depositRequests/hideModal' });
      },
    };

    const triageCategoryModalProps = {
      item: {},
      type: 'create',
      visible: triageCategoryVisible,
      onOk(formData) {
        dispatch({
          type: 'encounter/changeTriageCategory',
          payload: {
            id: data.visit.id,
            triageCategory: formData.triageCategory
          }
        });
      },
      onCancel() {
        dispatch({ type: 'encounter/hideTriageCategoryAssignmentModal' });
      },
    };

    const togglePatientAndDetails = () => {// toggle patient summary and detailed view
      this.setState((prevState) => ({ expandPatientAndVisitDetails: !prevState.expandPatientAndVisitDetails }));
    }

    const renderRequestNumber = () => {
      if (data.id) {
        if (data.visit.triageCategory) {
          if (data.visit.triageCategory.colorCode) {
            return <span style={{ color: data.visit.triageCategory.colorCode }}>{data.visit.patient.user.title.name}. {data.visit.patient.user.fullName} {data.requestNumber} </span>;
          }
        }
        return <span>{data.visit.patient.user.title.name}. {data.visit.patient.user.fullName}: {data.requestNumber} </span>;
      } else {
        return '';
      }
    };

    const action = (
      <div>
        {data.assignedUser === null && (
          <Authorized authority="UPDATE_REQUEST">
            <Button
              icon="edit"
              onClick={this.handleClaimRequest}
            >Claim Request
          </Button>
          </Authorized>
        )}
        <Authorized authority="CREATE_PATIENT_DEPOSIT_REQUEST">
          <Button
            icon="edit"
            onClick={this.showDepositRequestModal}
          >Create deposit request
          </Button>
        </Authorized>
        <Authorized authority="UPDATE_VISIT_TRIAGE_CATEGORY">
          <Button
            icon="edit"
            onClick={this.showTriageCategoryModal}
          >Set Triage Category
          </Button>
        </Authorized>
        <Authorized authority="UPDATE_REQUEST">
          <Button
            icon="edit"
            onClick={this.markRequestAsCompletedHandler}
          >Mark as Completed
          </Button>
        </Authorized>
      </div>
    );
    let description = null;
    if (data.id) {
      description = (
        <PatientVisitDetailsCard
          encounter={data.visit}
          request={data}
          detailed={expandPatientAndVisitDetails}
        />
      );
    }

    let tabList = [];
    if (data.id) {
      tabList = [
        {
          key: 'request',
          title: 'Request',
          content: <RequestDetail
            isPreviousVisit={isPreviousVisit}
            request={data} />,
          authority: 'READ_REQUESTS',
        }, {
          key: 'medicalHistory',
          title: 'Medical History',
          content: <MedicalHistoryView patientProfile={data.visit.patient} />,
          authority: 'READ_PATIENT_MEDICAL_HISTORY',
        }, {
          key: 'notes',
          title: 'Notes',
          content: <NotesView
            visit={isPreviousVisit ? previousVisit.id : data.visit.id} isPreviousVisit={isPreviousVisit}
            contextType="REQUEST" />,
          authority: 'READ_VISIT_NOTES',
        }, {
          key: 'investigations',
          title: 'Investigations',
          content: <ServiceRequestItemsView
            encounter={isPreviousVisit ? previousVisit : data.visit}
            isPreviousVisit={isPreviousVisit}
          />,
          authority: 'READ_REQUESTS',
        }, {
          key: 'requestItemResults',
          title: 'Results',
          content: <RequestResults
            encounter={isPreviousVisit ? previousVisit : data.visit}
            isPreviousVisit={isPreviousVisit}
            request={data} />,
          authority: 'READ_REQUESTS',
        }, {
          key: 'diagnoses',
          title: 'Diagnoses',
          content: <DiagnosesView
            encounter={isPreviousVisit ? previousVisit : data.visit}
            isPreviousVisit={isPreviousVisit}
          />,
          authority: 'READ_VISIT_DIAGNOSES',
        }, {
          key: 'medications',
          title: 'Medications',
          content: <MedicationView
            encounter={isPreviousVisit ? previousVisit : data.visit}
            isPreviousVisit={isPreviousVisit}
          />,
          authority: 'READ_VISIT_MEDICATIONS',
        },
        {
          key: 'supplies',
          title: 'Supplies',
          content: <SuppliesRequestForm
            encounter={isPreviousVisit ? previousVisit : data.visit}
            isPreviousVisit={isPreviousVisit}
          />,
          authority: 'READ_VISIT_MEDICATIONS',
        }, {
          key: 'appointments',
          title: 'Appointments',
          content: <AppointmentsView patientProfile={data.visit.patient} />,
          authority: 'READ_APPOINTMENTS',
        }, {
          key: 'attachments',
          title: 'Attachments',
          content: <FilesView context={data.id} contextType="REQUEST" readOnly={false} />,
          authority: 'VIEW_REQUEST_FILE',
        },
      ];
    }

    const DepositRequestModalGen = () => <DepositRequestModal {...depositRequestModalProps} />;
    const TriageCategoryModalGen = () => <TriageCategoryModal {...triageCategoryModalProps} />;

    const UserProfile = (
      <div>
        <ImageViewer referenceType="USER_PHOTO" reference={data.visit ? data.visit.patient.id : null} />
        <Button
          type="dashed"
          size="small"
          onClick={() => togglePatientAndDetails()}
          block>
          {expandPatientAndVisitDetails ? "Summary" : "More Info"}
        </Button>
      </div>
    );

    return (
      <PageHeaderLayout
        title={renderRequestNumber()}
        logo={data.id ? UserProfile : null}
        action={data.id ? action : null}
        content={data.id ? description : null}
        wrapperClassName="page-header-wrapper"
      >
        <Row>
          <Col xs={24} md={24} lg={24}>
            {loading && (
              <div>
                <Card loading />
                <Card loading style={{ marginTop: 10 }} />
              </div>
            )}

            {!loading && !success &&
              <Alert message="Error" description="An error occured." type="error" showIcon />}

            {!loading && success && data && (
              <div>
                <PatientVisitHistory
                  patient={data && data.visit && data.visit.patient ? data.visit.patient : null}
                  handleHistoryVisit={(encounter) => this.handleActiveVisit(encounter)}
                />
                <Tabs
                  type="card"
                  style={{ marginTop: 0 }}
                  tabPosition={"left"}>
                  {this.renderTabs(tabList)}

                </Tabs>
              </div>
            )}
          </Col>
        </Row>
        <DepositRequestModalGen />
        <TriageCategoryModalGen />
      </PageHeaderLayout>
    );
  }
}

export default RequestDetailView;
