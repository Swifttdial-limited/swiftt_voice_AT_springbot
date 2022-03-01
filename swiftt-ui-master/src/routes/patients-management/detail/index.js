import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import {
  Card, Button,
} from 'antd';

import Authorized from '../../../utils/Authorized';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import AppointmentsView from '../../../components/common/appointments';
import BiometricsView from '../../../components/patients-management/patient/related/biometrics';
import EncoutersView from '../../../components/patients-management/patient/related/encounters';
import FilesView from '../../../components/common/files';
import NextOfKinsView from '../../../components/patients-management/patient/related/next-of-kins';
import GuardiansView from '../../../components/patients-management/patient/related/guardian';
import PatientDemographicsModal from '../../../components/patients-management/patient/Modal';
import PaymentWalletsView from '../../../components/patients-management/patient/related/payment-wallets';
import PreferencesView from '../../../components/patients-management/patient/related/preferences';
import ImageViewer from '../../../components/common/ImageViewer';
import styles from './index.less';

const { Description } = DescriptionList;

const dateFormat = 'YYYY-MM-DD';
const ageDateFormat = 'YYYY, M, DD';

@connect(({ patient, loading }) => ({
  patient,
  loading: loading.effects['patient/query'],
}))
class PatientProfileView extends PureComponent {
  static defaultProps = {
    patient: {},
  };

  static propTypes = {
    patient: PropTypes.object,
  };

  state = {
    operationkey: 'wallets',
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({ type: 'patient/purge' });

    const match = pathToRegexp('/patient/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'patient/query', payload: { id: match[1] } });
    }
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'patient/purge' });
  // }

  onPatientProfileEditClickHandler = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patient/showEditModal',
      payload: {
        modalType: 'edit',
      },
    });
  };

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    const { dispatch, patient } = this.props;
    const { modalVisible, data } = patient;

    const patientDemographicsModalProps = {
      item: data,
      type: 'edit',
      visible: modalVisible,
      onOk(patientData) {
        const updateData = patientData;
        updateData.dateOfBirth = updateData.dateOfBirth.format(dateFormat);
        dispatch({ type: 'user/update', payload: updateData });
      },
      onCancel() {
        dispatch({
          type: 'patient/hideEditModal',
        });
      },
    };

    const patientProps = {
      loadData: true,
      patientProfile: data,
    };

    const userProps = {
      loadData: true,
      userProfile: data.user,
    };

    const PatientDemographicsModalGen = () =>
      <PatientDemographicsModal {...patientDemographicsModalProps} />;

    const action = (
      <div>
        <Authorized authority="UPDATE_PATIENT">
          <Button
            icon="edit"
            onClick={this.onPatientProfileEditClickHandler}
          >Edit Patient Details
          </Button>
        </Authorized>
        <Authorized authority="CREATE_VISIT">
          <Link to="/visit/create">
            <Button type="primary" icon="plus">New Visit</Button>
          </Link>
        </Authorized>
        <Authorized authority="ARCHIVE_PATIENT">
          <Button type="primary">Archive</Button>
        </Authorized>
      </div>
    );

    let description = <DescriptionList className={styles.headerList} size="small" col="2" />;
    if (data.id) {
      description = (
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="Name">{`${data.user.title.name} ${data.user.fullName}`}</Description>
          <Description term="Sex">{data.user.gender === 'MALE' ? 'Male' : 'Female'}</Description>
          <Description term="Date of Birth">{moment(data.user.dateOfBirth).format(dateFormat)}</Description>
          <Description term="Age">{moment(moment(data.user.dateOfBirth).format(ageDateFormat)).fromNow(true)}</Description>
          <Description term="Registration Date">{moment(data.creationTime).format(dateFormat)}</Description>
          <Description term="Religion">{data.user.religion ? data.user.religion.name : 'Not specified'}</Description>
          <Description term="Phone Number">{data.user.phoneNumber ? data.user.phoneNumber : 'Not specified'}</Description>
          <Description term="Alternative Phone Number">{data.user.alternativePhoneNumber ? data.user.alternativePhoneNumber : 'Not specified'}</Description>
          <Description term="Email Address">{data.user.emailAddress ? data.user.emailAddress : 'Not specified'}</Description>
          <Description term="">&nbsp;</Description>
          <Description term="Physical Address">{data.user.physicalAddress ? data.user.physicalAddress : 'Not specified'}</Description>
          <Description term="Region">{data.user.region ? data.user.region.name : 'Not specified'}</Description>
        </DescriptionList>
      );
    }

    const extra = (
      <ImageViewer
        readOnly={false}
        reference={data.id}
        referenceType="USER_PHOTO"
      />
    );

    const tabList = [
      {
        key: 'wallets',
        tab: 'Wallets',
      },
      {
        key: 'guardians',
        tab: 'Guardians',
      },
      {
        key: 'biometrics',
        tab: 'Biometrics',
      },
      {
        key: 'nextOfKin',
        tab: 'Next of Kin',
      },
      {
        key: 'encounters',
        tab: 'Visits',
      },
      {
        key: 'appointments',
        tab: 'Appointments',
      }, {
        key: 'attachments',
        tab: 'Attachments',
      },
      {
        key: 'preferences',
        tab: 'Preferences',
      },
    ];

    let contentList = {};
    if (data.id) {
      contentList = {
        wallets: <PaymentWalletsView {...patientProps} />,
        biometrics: <BiometricsView {...userProps} />,
        nextOfKin: <NextOfKinsView {...userProps} />,
        guardians: <GuardiansView {...patientProps} />,
        encounters: <EncoutersView {...patientProps} />,
        appointments: <AppointmentsView {...patientProps} />,
        attachments: <FilesView context={data.id} contextType="PATIENT" readOnly={false} />,
        preferences: <PreferencesView {...patientProps} />,
      };
    }

    return (
      <PageHeaderLayout
        title={data.medicalRecordNumber ? `Medical Record No: ${data.medicalRecordNumber}` : `OTC Number : ${data.overTheCounterNumber}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        content={description}
        extraContent={data.id ? extra : null}
        tabList={data.id ? tabList : null}
        onTabChange={this.onOperationTabChange}
      >
        { data.id ? <Card>{contentList[this.state.operationkey]}</Card> : <Card loading />}
        { data.id && <PatientDemographicsModalGen /> }
      </PageHeaderLayout>
    );
  }
}

export default PatientProfileView;
