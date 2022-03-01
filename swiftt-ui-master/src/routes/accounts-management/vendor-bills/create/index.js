import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import VendorBillForm from '../../../../components/accounts-management/vendor-bill/Form';

@connect()
class VendorBillRegistrationView extends PureComponent {

  render() {
    const { dispatch } = this.props;

    const vendorBillFormProps = {
      onCreate(data) {
        dispatch({ type: 'vendorBill/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'vendorBill/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Vendor Bill"
        content="Description"
      >
        <div className="content-inner">
          <VendorBillForm {...vendorBillFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorBillRegistrationView;
