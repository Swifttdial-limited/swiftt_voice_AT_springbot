import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import MedicalHistoryView from '../../../common/medical-history';

function PatientChronicAllergiesStepForm({ dispatch, patient }) {
  const patientProp = {
    patientProfile: patient.data ? patient.data : {},
  };

  return (
    <div style={{ padding: 20 }}>
      <MedicalHistoryView {...patientProp} />
    </div>
  );
}

PatientChronicAllergiesStepForm.propTypes = {
  patient: PropTypes.object.isRequired,
};

function mapStateToProps({ patient }) {
  return { patient };
}

export default connect(mapStateToProps)(PatientChronicAllergiesStepForm);
