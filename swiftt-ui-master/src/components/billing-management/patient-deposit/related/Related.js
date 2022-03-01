import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function PatientDepositRelatedDetails({
  deposit,
}) {
  return (
    <Tabs type="card">
      <TabPane tab="Attachments" key="1">
        <FilesView readOnly={false} context={deposit.id} contextType="PATIENT_DEPOSIT" />
      </TabPane>
      <TabPane tab="Comments" key="4">
        <p>{deposit.comment}</p>
      </TabPane>
    </Tabs>
  );
}

PatientDepositRelatedDetails.propTypes = {
  deposit: PropTypes.object.isRequired,
};

export default PatientDepositRelatedDetails;
