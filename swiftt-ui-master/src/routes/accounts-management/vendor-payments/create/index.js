import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import VendorPaymentForm from '../../../../components/accounts-management/vendor-payment/Form';

@connect()
class VendorPaymentRegistrationView extends PureComponent {
  render() {
    const { dispatch } = this.props;

    const vendorPaymentFormProps = {
      onCreate(data) {
        dispatch({ type: 'vendorPayment/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'vendorPayment/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Vendor Payment"
        content="Description"
      >
        <div className="content-inner">
          <VendorPaymentForm {...vendorPaymentFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorPaymentRegistrationView;
