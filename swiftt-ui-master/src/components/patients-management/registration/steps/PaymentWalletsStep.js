import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PaymentWalletsView from '../../patient/related/payment-wallets';

function PaymentWalletsRegistrationForm({ dispatch, patient }) {
  const patientProp = {
    patientProfile: patient.data ? patient.data : {},
  };

  return (
    <div style={{ padding: 20 }}>
      <PaymentWalletsView {...patientProp} />
    </div>
  );
}

PaymentWalletsRegistrationForm.propTypes = {
  patient: PropTypes.object.isRequired,
};

function mapStateToProps({ patient }) {
  return { patient };
}

export default connect(mapStateToProps)(PaymentWalletsRegistrationForm);
