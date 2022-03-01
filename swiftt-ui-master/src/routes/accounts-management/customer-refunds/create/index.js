import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row, Col
} from 'antd';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CustomerRefundFormWrapper from '../../../../components/accounts-management/customer-refunds/registration/FormStepsWrapper';

@connect(({ processes }) => ({
  processes,
}))
class CustomerRefundView extends PureComponent {
  render() {
    return (
      <PageHeaderLayout
        title="New Customer Refund"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div>
          <Row gutter={24}>
            <Col span={16}>
              <div className="content-inner">
                <CustomerRefundFormWrapper />
              </div>
            </Col>
            <Col span={8}>
              <p>Patient and Visit details</p>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CustomerRefundView;
