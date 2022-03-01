import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import FilesView from '../../../common/files';

function PatientFileAttachmentStepForm({ dispatch, patient }) {
  return (
    <div style={{ padding: 20 }}>
      <FilesView
        readOnly={false}
        context={patient.data.id}
        contextType="PATIENT" />
    </div>
  );
}

PatientFileAttachmentStepForm.propTypes = {
  patient: PropTypes.object.isRequired,
};

function mapStateToProps({ patient }) {
  return { patient };
}

export default connect(mapStateToProps)(PatientFileAttachmentStepForm);
