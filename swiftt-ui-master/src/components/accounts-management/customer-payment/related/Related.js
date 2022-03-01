import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Tabs, message, Card } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function CustomerPaymentRelatedDetails({
  customerPayment,
}) {
  return (
    <div>
      <Card>
        <Tabs type="card">
          <TabPane tab="Attachments" key="1">
            <FilesView context={customerPayment.id} contextType="CUSTOMER_PAYMENT" />
          </TabPane>
          <TabPane tab="Comments" key="3">
            <p>{customerPayment.comment}</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

CustomerPaymentRelatedDetails.propTypes = {
  customerPayment: PropTypes.object.isRequired,
};

export default CustomerPaymentRelatedDetails;
