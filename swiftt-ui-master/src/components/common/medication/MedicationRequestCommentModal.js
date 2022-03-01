import PropTypes from 'prop-types';
import React from 'react';
import { Modal, LocaleProvider, Button } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import MedicationForm from './Form';

function MedicationModal({
  onCancel,
  visible,
  department,
  encounter,
  medicationType,
}) {
  const modalOpts = {
    title: 'Add Medication',
    visible,
    width: 1200,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <LocaleProvider locale={enUS}>
      <Modal
        {...modalOpts}
        footer={null}
      >
        <MedicationForm
          department={department}
          medicationType={medicationType}
          encounter={encounter}
        />
      </Modal>
    </LocaleProvider>
  );
}

MedicationModal.defaultProps = {
  department: {},
};

MedicationModal.propTypes = {
  dispatch: PropTypes.func,
  visible: PropTypes.any,
  onCancel: PropTypes.func,
  department: PropTypes.object.isRequired,
  encounter: PropTypes.object.isRequired,
};

export default MedicationModal;
