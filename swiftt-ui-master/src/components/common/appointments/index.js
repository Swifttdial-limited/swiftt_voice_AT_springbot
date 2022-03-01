import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Alert } from 'antd';

import Authorized from '../../../utils/Authorized';
import AppointmentsList from './List';
import AppointmentModal from './Modal';
import AppointmentToolbar from './Toolbar';

@connect(({ appointments, loading }) => ({
  appointments,
  loading: loading.effects['appointments/query'],
}))
class AppointmentsView extends PureComponent {

  static propTypes = {
    patientProfile: PropTypes.object,
    visitProfile: PropTypes.object,
    appointments: PropTypes.object.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.fetchAppointments();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'appointments/purge' });
  }

  fetchAppointments() {
    const { dispatch, patientProfile, visitProfile } = this.props;

    let payload = {};

    if ('patientProfile' in this.props) { payload = { patientId: patientProfile.id }; } else if ('visitProfile' in this.props) { payload = { visitId: visitProfile.id }; }

    dispatch({ type: 'appointments/query', payload });
  }

  cancelAppointmentHandler = (appointment) => {
    const { dispatch } = this.props;
    dispatch({ type: 'appointment/cancel', payload: { id: appointment.id } });

    this.fetchAppointments();
  }

  confirmAppointmentHandler = (appointment) => {
    const { dispatch } = this.props;
    dispatch({ type: 'appointment/confirm', payload: { id: appointment.id } });

    this.fetchAppointments();
  }

  render() {
    const { location, dispatch, appointments, patientProfile, visitProfile } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType, success } = appointments;

    const appointmentModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
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

        dispatch({ type: `appointments/${modalType}`, payload: Object.assign({}, currentItem, values) });
      },
      onCancel() {
        dispatch({ type: 'appointments/hideModal' });
      },
    };

    const appointmentListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        const { query, pathname } = location;
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            size: page.pageSize,
          },
        }));
      },
      onCancelAppointment: (item) => this.cancelAppointmentHandler(item),
      onConfirmAppointment: (item) => this.confirmAppointmentHandler(item),
      onEditItem(item) {
        dispatch({
          type: 'appointments/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const appointmentToolbarProps = {
      onAdd() {
        dispatch({
          type: 'appointments/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const AppointmentModalGen = () => <AppointmentModal {...appointmentModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <Authorized authority="CREATE_APPOINTMENT">
            <AppointmentToolbar {...appointmentToolbarProps} />
          </Authorized>

          <Authorized authority="VIEW_APPOINTMENTS">
            <AppointmentsList {...appointmentListProps} />
          </Authorized>

          <AppointmentModalGen />
        </Col>
      </Row>
    );
  }
}

export default AppointmentsView;
