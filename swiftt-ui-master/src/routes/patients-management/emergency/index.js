import React from 'react';

import EmergencyRegistrationForm from '../../../components/patients-management/emergency/EmergencyRegistrationForm';

import styles from './index.less';

function EmergencyPatientRegistrationView() {
  return (
    <div className="content-inner">
      <EmergencyRegistrationForm />
    </div>
  );
}

export default EmergencyPatientRegistrationView;
