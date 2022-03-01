import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function InventoryTransferRelatedDetails({
  inventoryTransfer,
}) {
  return (
    <Tabs type="card">
      <TabPane tab="Attachments" key="1">
        <FilesView
          readOnly={false}
          context={inventoryTransfer.id}
          contextType="INVENTORY_TRANSFER" />
      </TabPane>
      <TabPane tab="Comments" key="4">
        <p>{inventoryTransfer.comment}</p>
      </TabPane>
    </Tabs>
  );
}

InventoryTransferRelatedDetails.propTypes = {
  inventoryTransfer: PropTypes.object.isRequired,
};

export default InventoryTransferRelatedDetails;
