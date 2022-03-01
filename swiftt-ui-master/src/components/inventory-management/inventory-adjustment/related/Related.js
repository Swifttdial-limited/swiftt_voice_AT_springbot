import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function InventoryAdjustmentRelatedDetails({
  inventoryAdjustment,
}) {
  return (
    <Tabs type="card">
      <TabPane tab="Attachments" key="1">
        <FilesView
          readOnly={false}
          context={inventoryAdjustment.id}
          contextType="INVENTORY_TRANSFER" />
      </TabPane>
      <TabPane tab="Comments" key="4">
        <p>{inventoryAdjustment.comment}</p>
      </TabPane>
    </Tabs>
  );
}

InventoryAdjustmentRelatedDetails.propTypes = {
  inventoryAdjustment: PropTypes.object.isRequired,
};

export default InventoryAdjustmentRelatedDetails;
