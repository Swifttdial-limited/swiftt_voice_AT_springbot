import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CustomerPaymentScheduleForm from '../../../../components/accounts-management/customer-payment-schedule/Form';

@connect()
class CustomerPaymentSchedule extends PureComponent {
  render() {
    const { dispatch } = this.props;

    const payloadDataBuilder = (data) => {
      return {
        ...data,
        addressTo: {
          id: data.customer.publicId,
          name: data.customer.name,
          code: data.customer.code,
        },
        billingAddress: {
          city: data.customer.address.city,
          postalAddress: data.customer.address.postalAddress,
          postalCode: data.customer.address.postalCode,
          streetAddress: data.customer.address.streetAddress,
        },
        items: data.items,
        payment: {
          paymentMode: data.paymentMode,
          receivedAmount: data.amount,
        },
      };
    };


    const customerInvoicesFormProps = {
      onCreate(data) {
        const payload = payloadDataBuilder(data);
        dispatch({ type: 'customerPayment/create', payload });
      },
      onCreateAndSubmit(data) {
        const payload = payloadDataBuilder(data);
        dispatch({ type: 'customerPayment/createAndSubmit', payload });
      },
    };

    return (
      <PageHeaderLayout
        title="New Customer Payment Schedule"
        // content="Description"
      >
        <div className="content-inner">
          <CustomerPaymentScheduleForm {...customerInvoicesFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CustomerPaymentSchedule;
