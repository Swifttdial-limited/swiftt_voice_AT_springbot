import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PatientDepositsView from '../../../components/billing-management/patient-deposits';
import PatientDepositRequestsView from '../../../components/billing-management/patient-deposit-requests';

class PatientDepositsViewWrapper extends PureComponent {
  static propTypes = {
    deposits: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    operationkey: 'pending',
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {

    const tabList = [{
      key: 'pending',
      tab: 'Unprocessed',
    }, {
      key: 'processed',
      tab: 'Processed',
    }];

    const contentList = {
      pending: <PatientDepositRequestsView />,
      processed: <PatientDepositsView />,
    };

    return (
      <PageHeaderLayout
        title="Deposits &amp; Advance Payments"
        tabList={tabList}
        onTabChange={this.onOperationTabChange}
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          {contentList[this.state.operationkey]}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PatientDepositsViewWrapper;
