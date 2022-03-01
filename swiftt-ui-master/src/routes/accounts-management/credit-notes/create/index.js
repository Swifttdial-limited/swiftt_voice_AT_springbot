import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CreditNoteForm from '../../../../components/accounts-management/credit-note/Form';

@connect()
class CreditNote extends PureComponent {
  render() {
    const { dispatch } = this.props;

    const creditNoteFormProps = {
      onCreate(data) {
        dispatch({ type: 'creditNote/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'creditNote/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Credit Note"
        content="This is the process of reducing the amounts the supplier had invoiced for their delivery.
        When the delivered invoice amount is overstated and the supplier will send a Credit Note to
         reduce the amount. Some items may not be delivered and the invoice will have a high figure,
          to reduce the invoice amount with undelivered items the supplier will send along a Credit Note."
      >
        <div className="content-inner">
          <CreditNoteForm {...creditNoteFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default CreditNote;
