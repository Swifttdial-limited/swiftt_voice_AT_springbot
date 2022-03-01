import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Tag, Icon, Avatar, Modal, Divider, Card, Button } from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import AppointmentModal from '../../common/appointments/Modal';
import DescriptionList from '../../DescriptionList';
import EncounterRegistrationView from '../../common/encounters/registration';
import EncounterSelectionList from '../../common/encounters/EncounterSelectionList';
import PatientDetailsCard from '../../patients-management/patient/SimplePatientDetailsViewCard';
import Toolbar from './Toolbar';

import { queryPatientEncounters } from '../../../services/patient';

const { confirm } = Modal;
const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ appointment, loading }) => ({
  appointment,
  loading: loading.effects['appointment/query'],
}))
class SummarizedAppointmentView extends PureComponent {

  static defaultProps = {
    loading: false,
    fetchAppointments: () => {},
  };

  static propTypes = {
    loading: PropTypes.bool,
    appointment: PropTypes.object,
    fetchAppointments: PropTypes.func,
  }

  state = {
    modalVisible: false,
    isVisitSelectionViewVisible: false,
    isVisitCreationViewVisible: false,
    encounters: [],
  };

  componentDidMount() {
    console.log('BLA')
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.appointment) {
      if(nextProps.appointment.data.id !== this.props.appointment.data.id) {
        this.setState({
          isEditViewActive: false,
          isVisitCreationViewVisible: false,
          isVisitSelectionViewVisible: false,
        });
      }
    }
  }

  confirmAppointmentHandler = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/confirm', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  claimAppointmentHandler = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/claim', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  editToggleHandler = () => {
    this.setState((previousState, currentProps) => {
      return {
        modalVisible: !previousState.modalVisible
      };
    });
  }

  unclaimAppointmentHander = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/unclaim', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  startAppointmentHandler = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/unclaim', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  linkToVisitAndStartAppointmentHandler = () => {
    const { dispatch, appointment } = this.props;

      queryPatientEncounters({
        patientId: appointment.data.patient.id,
        date: moment().format(dateFormat),
      })
      .then((response) => {
        if(response.content.length > 0) {
          this.setState({ isVisitSelectionViewVisible: true, encounters: response.content });
        } else {
          this.setState({ isVisitCreationViewVisible: true });
        }
      });

    // dispatch({ type: 'appointment/unclaim', payload: { id: appointment.data.id } });
  }

  completeAppointmentHandler = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/complete', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  cancelAppointmentHandler = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/cancel', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  appointmentMissedHandler = () => {
    const { dispatch, appointment, fetchAppointments } = this.props;
    dispatch({ type: 'appointment/miss', payload: { id: appointment.data.id } });

    fetchAppointments();
  }

  rescheduleHandler = () => {
    //const { dispatch, appointment } = this.props;
    //dispatch({ type: 'appointment/reschedule', payload: { id: appointment.data.id } });
  }

  encounterSelectHandler = (encounter) => {
    const { dispatch, appointment } = this.props;
    dispatch({
      type: 'appointment/start',
      payload: {
        id: appointment.data.id,
        visit: encounter
      }
    });

    this.setState({ isVisitSelectionViewVisible: false });
  }

  toggleVisitCreationView = () => {
    this.setState((currentState, previousProps) => {
      return {
        isVisitCreationViewVisible: !previousProps.isVisitCreationViewVisible,
        isVisitSelectionViewVisible: false,
      };
    })
  }

  render() {
    const { loading, appointment } = this.props;
    const { data } = appointment;

    const {
      encounters,
      modalVisible,
      isVisitCreationViewVisible,
      isVisitSelectionViewVisible,
    } = this.state;

    const appointmentModalProps = {
      item: data,
      type: 'update',
      visible: modalVisible,
      onOk(values) {
        values.proposedStartTime = values.operatingTime.startTime;
        values.proposedEndTime = values.operatingTime.endTime;

        if (patientProfile) { values.patient = patientProfile; }

        if (visitProfile) {
          values.visit = visitProfile;
          values.patient = visitProfile.patient;
        }

        delete values.operatingTime

        dispatch({ type: `appointments/${modalType}`, payload: Object.assign({}, data, values) });
      },
      onCancel: this.editToggleHandler,
    };

    const AppointmentModalGen = () => <AppointmentModal {...appointmentModalProps} />

    return (
      <div>
        { loading  && <Card loading /> }
        { !loading && data.id &&
          <div style={{ padding: 10 }}>
            <Toolbar
              appointment={data}
              onClaim={this.claimAppointmentHandler}
              onConfirmation={this.confirmAppointmentHandler}
              onEdit={this.editToggleHandler}
              onStart={this.startAppointmentHandler}
              onLinkToVisitAndStart={this.linkToVisitAndStartAppointmentHandler}
              onComplete={this.completeAppointmentHandler}
              onCancelled={this.cancelAppointmentHandler}
              onMissed={this.appointmentMissedHandler}
              onReschedule={this.rescheduleHandler} />

              { isVisitCreationViewVisible && (
                <EncounterRegistrationView
                  patient={data.patient}
                  appointment={data}
                  allowRequestCreation={false} />
              )}

              { isVisitSelectionViewVisible && (
                <div>
                  <EncounterSelectionList
                    encounters={encounters}
                    onEncounterSelect={this.encounterSelectHandler} />
                  <Divider>or</Divider>
                  <Button type="dashed" block onClick={this.toggleVisitCreationView}>Create New Visit</Button>
                </div>
              )}

              { (!isVisitCreationViewVisible && !isVisitSelectionViewVisible) && (
                <div>
                  <DescriptionList col={1} size="small" style={{ marginBottom: 8 }}>
                    <Description term="Type of Appointment">{data.appointmentType.name}</Description>
                    <Description term="Description">{data.description}</Description>
                    <Description term="Location">{data.location ? data.location.name : 'Not Specified'}</Description>
                  </DescriptionList>
                  <DescriptionList col={2} size="small" style={{ marginBottom: 8 }}>
                    <Description term="Assigned To">{data.assignedTo ? data.assignedTo.fullName : null}</Description>
                    <Description term="Department">{data.assignedDepartment ? data.assignedDepartment.name : null}</Description>
                  </DescriptionList>
                  <Divider />
                  <DescriptionList col={2} size="small" style={{ marginBottom: 8 }}>
                    <Description term="Proposed Date &amp; Time">{moment(data.appointmentDate).local().format(dateFormat)} {data.proposedStartTime} - {data.proposedEndTime}</Description>
                    <Description term="Actual Date &amp; Time">{data.actualStartTime ? moment(data.actualStartTime).local().format(dateTimeFormat) : null} - {data.actualEndTime ? moment(data.actualEndTime).local().format(dateTimeFormat) : null}</Description>
                  </DescriptionList>
                  <DescriptionList col={2} size="small" style={{ marginBottom: 16 }}>
                    <Description term="Booking Date">{moment(data.creationDate).local().format(dateFormat)}</Description>
                    <Description term="Booked By">{data.createdBy.fullName}</Description>
                  </DescriptionList>
                  <Divider />
                  <PatientDetailsCard detailed={true} columns={2} patient={data.patient} />
                </div>
              )}
          </div>
        }
        <AppointmentModalGen />
      </div>
    );
  }
}

export default SummarizedAppointmentView;
