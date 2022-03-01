import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function PurchaseOrderRelatedDetails({
  purchaseOrder,
}) {
  return (
    <Tabs type="card">
      <TabPane tab="Attachments" key="1">
        <FilesView readOnly={false} context={purchaseOrder.id} contextType="PURCHASE_ORDER" />
      </TabPane>
      <TabPane tab="Requisitions" key="2">
        <p>Requisitions</p>
      </TabPane>
      <TabPane tab="Goods Receipt Notes" key="3">
        <p>GRNs</p>
      </TabPane>
      <TabPane tab="Goods Returns" key="5">
        <p>Goods Returns</p>
      </TabPane>
      <TabPane tab="Comments" key="4">
        <p>{purchaseOrder.comment}</p>
      </TabPane>
    </Tabs>
  );
}

PurchaseOrderRelatedDetails.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderRelatedDetails;
