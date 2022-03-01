import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function RequisitionRelatedDetails({
  requisition,
}) {
  return (
    <Tabs type="card">
      <TabPane tab="Attachments" key="1">
        <FilesView readOnly={false} context={requisition.id} contextType="REQUISITION" />
      </TabPane>
      <TabPane tab="Purchase Order" key="2">
        <p>Purchase Order</p>
      </TabPane>
      <TabPane tab="Comments" key="3">
        <p>{requisition.comment}</p>
      </TabPane>
    </Tabs>
  );
}

RequisitionRelatedDetails.propTypes = {
  requisition: PropTypes.object.isRequired,
};

export default RequisitionRelatedDetails;
