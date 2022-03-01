import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs, message, Card } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function VendorPaymentRelatedDetails({
  vendorPayment,
}) {
  return (
    <div>
      <Card>
        <Tabs type="card">
          <TabPane tab="Attachments" key="1">
            <FilesView context={vendorPayment.id} contextType="VENDOR_PAYMENT" />
          </TabPane>
          <TabPane tab="Comments" key="3">
            <p>{vendorPayment.comment}</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

VendorPaymentRelatedDetails.propTypes = {
  vendorPayment: PropTypes.object.isRequired,
};

export default VendorPaymentRelatedDetails;
